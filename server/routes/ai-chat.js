/**
 * @file ai-chat.js
 * @route POST /api/ai-chat
 * @description Assistant pédagogique Milo — propulsé par Google Gemini 2.0 Flash.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  ARCHITECTURE DU PROMPT SYSTÈME                                 │
 * │                                                                 │
 * │  1. [ÉCRAN]    Question exacte visible sur l'écran de l'enfant  │
 * │                → source de vérité absolue (envoyée par le quiz) │
 * │  2. [CIBLÉE]   Question mentionnée par n° dans le message       │
 * │                → fallback quand pas de données écran            │
 * │  3. [PERSONA]  Identité, ton et règles de Milo                  │
 * │  4. [STADE]    Niveau d'aide 1→4 + état émotionnel détecté      │
 * │  5. [PROFIL]   Âge, niveau, badges, scores récents              │
 * │  6. [CONTENU]  Module actif en détail + résumé des autres       │
 * └─────────────────────────────────────────────────────────────────┘
 */

'use strict';

const express = require('express');
const { safeJson, publicChild, contentItem } = require('../ai-chat-utils');

// ─── Constantes ───────────────────────────────────────────────────────────────

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

/** Clés internes des modules (ordre d'affichage dans le prompt) */
const MODULE_KEYS = ['lecture', 'numerique', 'robotique', 'anglais', 'civique', 'eco'];

/** Libellés lisibles par l'IA pour chaque module */
const MODULE_LABELS = {
  lecture:   'Lecture & compréhension',
  numerique: 'Numérique',
  robotique: 'Robotique',
  anglais:   'Anglais',
  civique:   'Éducation civique',
  eco:       'Éco-citoyenneté',
};

/**
 * Stratégies pédagogiques par module.
 * Ces conseils sont injectés dans le prompt pour orienter la façon dont
 * Milo choisit ses analogies et ses exemples.
 */
const MODULE_TIPS = {
  lecture:
    "Aide l'enfant à identifier les mots-clés, le sujet et l'idée principale. " +
    "Encourage la reformulation avec ses propres mots. " +
    "Pour les synonymes/antonymes : partir d'exemples du quotidien ('joyeux c'est comme happy en anglais, le contraire c'est triste').",
  numerique:
    "Utilise des analogies du quotidien : IP = adresse postale, fichier = boîte, " +
    "programme = recette de cuisine, réseau = autoroute. Décompose les concepts abstraits en images concrètes.",
  robotique:
    "Décompose toujours en petites étapes séquentielles. " +
    "Analogie clé : 'donner des instructions très précises à quelqu'un qui ne réfléchit pas seul'. " +
    "Si l'enfant bloque sur une boucle, demande-lui combien de fois il ferait l'action à la main.",
  anglais:
    "Donne des indices sur la structure grammaticale EN FRANÇAIS d'abord, " +
    "puis encourage l'enfant à formuler en anglais. " +
    "Valide l'effort phonétique même approximatif. Ne corrige jamais l'accent, seulement le sens.",
  civique:
    "Relie toujours les concepts abstraits à des situations concrètes : école, famille, quartier. " +
    "Exemples : droits = ce que tu peux faire, devoirs = ce que tu dois faire pour les autres.",
  eco:
    "Pars de gestes quotidiens simples (tri, transport, eau, énergie) pour expliquer les grands enjeux. " +
    "Valorise chaque petit geste. Évite la culpabilisation — préfère la fierté d'agir.",
};

function requireAuth(role) {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({ error: 'Non autorisé.' });
    }
    if (role && req.auth.role && req.auth.role !== role) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }
    return next();
  };
}

// ─── Initialisation du module ─────────────────────────────────────────────────

module.exports = function aiChatRoutes(db) {
  const router = express.Router();

  // Le client Gemini est instancié une seule fois par processus (pas à chaque requête)
  // pour économiser des ressources et éviter les instanciations répétées.
  let _geminiClient = null;
  function getGeminiClient() {
    if (!_geminiClient) {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      _geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return _geminiClient;
  }

  // Requêtes SQLite préparées une fois → meilleures performances
  const stmtChild    = db.prepare('SELECT * FROM children WHERE id = ?');
  const stmtContents = db.prepare('SELECT * FROM contents WHERE module = ? ORDER BY is_custom, created_at');

  // ─── Chargement des données ──────────────────────────────────────────────────

  /**
   * Charge toutes les activités de tous les modules depuis la BDD.
   * @returns {{ [moduleKey]: { quizzes, exercises, lessons } }}
   */
  function loadAllModules() {
    const out = {};
    for (const key of MODULE_KEYS) {
      const mod = { quizzes: [], exercises: [], lessons: [] };
      for (const row of stmtContents.all(key)) {
        const item = contentItem(row);
        if (row.type === 'quizzes')   mod.quizzes.push(item);
        if (row.type === 'exercises') mod.exercises.push(item);
        if (row.type === 'lessons')   mod.lessons.push(item);
      }
      out[key] = mod;
    }
    return out;
  }

  /**
   * Construit le contexte complet de l'enfant (profil + scores + modules).
   * @param {Express.Request} req
   */
  function buildChildContext(req) {
    const child   = publicChild(stmtChild.get(req.auth.id));
    const modules = loadAllModules();

    // Enrichit les scores avec le titre de l'activité (lisible par l'IA)
    const scores = (child.scores || []).map(s => {
      const mod   = modules[s.module];
      const found = mod && [...mod.quizzes, ...mod.exercises].find(x => x.id === s.ref);
      return { ...s, activityTitle: found ? found.title : (s.ref || 'activité inconnue') };
    });

    // Moyenne par module pour identifier les points forts/faibles
    const moduleStats = {};
    for (const s of scores) {
      if (!moduleStats[s.module]) moduleStats[s.module] = { sum: 0, count: 0 };
      moduleStats[s.module].sum   += (s.score / s.total) * 100;
      moduleStats[s.module].count += 1;
    }
    for (const key of Object.keys(moduleStats)) {
      moduleStats[key].avg = Math.round(moduleStats[key].sum / moduleStats[key].count);
    }

    return { enfant: { prenom: child.prenom, age: child.age }, scores, moduleStats, badges: child.badges, modules };
  }

  // ─── Helpers de recherche ────────────────────────────────────────────────────

  /**
   * Trouve une activité (quiz ou exercice) par son identifiant dans tous les modules.
   * @returns {{ module: string, activity: object } | null}
   */
  function findActivity(modules, activityId) {
    if (!activityId) return null;
    for (const key of MODULE_KEYS) {
      const mod   = modules[key];
      const found = mod && [...mod.quizzes, ...mod.exercises].find(x => x.id === activityId);
      if (found) return { module: key, activity: found };
    }
    return null;
  }

  /**
   * Trouve la question N°qNum dans une activité précise (priorité),
   * ou en comptant globalement sur tout le module (fallback).
   * @returns {{ activityTitle, question, choices, correct } | null}
   */
  function findPinnedQuestion(modules, moduleKey, qNum, activityId) {
    if (!qNum) return null;

    // Priorité 1 : cherche Q(qNum) dans l'activité spécifiquement ouverte par l'enfant
    if (activityId) {
      const fa = findActivity(modules, activityId);
      const q  = fa && (fa.activity.questions || [])[qNum - 1];
      if (q) return buildQuestionResult(fa.activity.title, q, qNum);
    }

    // Fallback : comptage global sur tout le module
    if (!moduleKey || !modules[moduleKey]) return null;
    let idx = 0;
    for (const activity of [...modules[moduleKey].quizzes, ...modules[moduleKey].exercises]) {
      for (let i = 0; i < (activity.questions || []).length; i++) {
        if (++idx === qNum) return buildQuestionResult(activity.title, activity.questions[i], i + 1);
      }
    }
    return null;
  }

  /** Formate un objet question en résultat exploitable par le prompt. */
  function buildQuestionResult(activityTitle, q, localIndex) {
    const correct = q.c && q.a !== undefined ? q.c[q.a] : null;
    return {
      activityTitle,
      localIndex,
      question: q.q,
      choices: (q.c || []).map((c, i) => `  ${String.fromCharCode(65 + i)}) ${c}${i === q.a ? ' [CORRECT]' : ''}`),
      correct,
    };
  }

  // ─── Formatage du contenu pour le prompt ────────────────────────────────────

  /** Formate une liste de questions Q/R pour injection dans le prompt. */
  function formatQuestions(questions) {
    if (!Array.isArray(questions) || !questions.length) return '';
    return questions.map((q, i) => {
      const choices = (q.c || []).map((c, ci) => {
        const letter = String.fromCharCode(65 + ci);
        return `  ${letter}) ${c}${ci === q.a ? ' [CORRECT]' : ''}`;
      }).join('\n');
      return `  Q${i + 1}: ${q.q}\n${choices}`;
    }).join('\n\n');
  }

  /**
   * Formate le contenu des modules pour le prompt.
   *
   * Stratégie :
   *   - Si un module est identifié (focusModule) → envoi complet de ce module,
   *     résumé en 1 ligne pour les autres (évite que Gemini se perde dans du contenu hors-sujet).
   *   - Si aucun module connu → envoi complet de tous les modules
   *     (fallback sécurisé : mieux que de laisser Gemini inventer).
   */
  function formatModulesForPrompt(modules, focusModule) {
    const lines = [];

    if (!focusModule) {
      lines.push('(Module non identifié — contenu de tous les modules envoyé)\n');
      for (const key of MODULE_KEYS) {
        const mod = modules[key];
        if (!mod) continue;
        lines.push(`\n### ${MODULE_LABELS[key]}`);
        for (const quiz of mod.quizzes) {
          lines.push(`[Quiz "${quiz.title}"]`);
          lines.push(formatQuestions(quiz.questions) || '  (aucune question)');
          lines.push('');
        }
        for (const ex of mod.exercises) {
          lines.push(`[Exercice "${ex.title}"]`);
          if (ex.text) lines.push(`  Texte : "${ex.text.slice(0, 300).replace(/\n/g, ' ')}…"`);
          lines.push(formatQuestions(ex.questions) || '');
          lines.push('');
        }
      }
      return lines.join('\n');
    }

    for (const key of MODULE_KEYS) {
      const mod = modules[key];
      if (!mod) continue;

      if (key !== focusModule) {
        // Résumé minimaliste pour les modules hors-focus
        const nQ = [...mod.quizzes, ...mod.exercises]
          .reduce((s, a) => s + (a.questions?.length || 0), 0);
        lines.push(`• ${MODULE_LABELS[key]} — ${nQ} question(s)`);
        continue;
      }

      lines.push(`\n### MODULE ACTUEL : ${MODULE_LABELS[key]}`);
      lines.push('(Questions + réponses correctes — base de connaissance de Milo pour ce module)\n');

      for (const quiz of mod.quizzes) {
        lines.push(`[Quiz "${quiz.title}" — id: ${quiz.id}]`);
        lines.push(formatQuestions(quiz.questions) || '  (aucune question)');
        lines.push('');
      }
      for (const ex of mod.exercises) {
        lines.push(`[Exercice "${ex.title}" — id: ${ex.id}]`);
        if (ex.text) lines.push(`  Texte : "${ex.text.slice(0, 500).replace(/\n/g, ' ')}"`);
        lines.push(formatQuestions(ex.questions) || '');
        lines.push('');
      }
      if (mod.lessons.length) {
        lines.push('[Leçons disponibles :]');
        for (const l of mod.lessons) lines.push(`  • "${l.title}"`);
      }
    }
    return lines.join('\n');
  }

  // ─── Analyse du message ──────────────────────────────────────────────────────

  /**
   * Détecte le numéro de question mentionné dans le message de l'enfant.
   * Supporte les formes : "question 2", "Q2", "numéro 3", "deuxième", "2ème question"…
   * @returns {number|null} Numéro 1-basé ou null si non trouvé.
   */
  function extractQuestionNumber(msg) {
    const patterns = [
      /question\s*n[o°]?\s*(\d+)/i,
      /question\s+(\d+)/i,
      /exercice?\s+(\d+)/i,
      /\bq\s*(\d+)\b/i,
      /num[eé]ro\s+(\d+)/i,
      /\bn[o°]\s*(\d+)/i,
      /(\d+)\s*(?:e|ème|eme|er|ère|re)\s*question/i,
    ];
    for (const re of patterns) {
      const m = msg.match(re);
      if (m) return parseInt(m[1], 10);
    }
    // Ordinaux en toutes lettres
    const ordinals = { premi: 1, deuxi: 2, troisi: 3, quatri: 4, cinqui: 5, sixi: 6 };
    const low = msg.toLowerCase();
    for (const [prefix, n] of Object.entries(ordinals)) {
      if (low.includes(prefix)) return n;
    }
    return null;
  }

  /**
   * Tente de détecter le module mentionné dans le message quand l'URL ne le précise pas.
   * Utile quand l'enfant parle depuis la page d'accueil : "je comprends rien au module robotique".
   * @returns {string|null} Clé de module ou null.
   */
  function detectModuleFromMessage(msg) {
    const low = msg.toLowerCase();
    const aliases = {
      lecture:   ['lecture', 'lire', 'texte', 'compréhension', 'comprehension', 'synonyme', 'antonyme', 'contraire'],
      numerique: ['numérique', 'numerique', 'informatique', 'ordinateur', 'internet', 'réseau', 'adresse ip'],
      robotique: ['robotique', 'robot', 'programme', 'séquence', 'sequence', 'algorithme', 'algo', 'boucle', 'instruction'],
      anglais:   ['anglais', 'english', 'traduction', 'traduire', 'vocabulary', 'grammaire'],
      civique:   ['civique', 'citoyenneté', 'citoyennete', 'droits', 'devoirs', 'société', 'loi', 'démocratie'],
      eco:       ['éco', 'eco', 'environnement', 'nature', 'planète', 'planete', 'recyclage', 'climat', 'énergie'],
    };
    for (const [key, words] of Object.entries(aliases)) {
      if (words.some(w => low.includes(w))) return key;
    }
    return null;
  }

  /**
   * Extrait la mauvaise réponse choisie par l'enfant depuis son message.
   * Ex : "j'ai répondu 'sombre' mais c'était faux" → "sombre"
   * Permet à Milo d'expliquer POURQUOI ce choix précis est incorrect.
   * @returns {string|null}
   */
  function extractWrongAnswer(msg) {
    const m = msg.match(/(?:j'?ai répondu|j'?ai choisi|j'?ai mis|j'?ai dit)\s*[«"']?([^«"',!?\.]+)[»"']?\s*(?:mais|et|or|pourtant)/i);
    return m ? m[1].trim() : null;
  }

  /**
   * Compte combien de fois l'enfant a déjà demandé de l'aide sur la question actuellement
   * affichée (identifiée par ses 25 premiers caractères dans les messages user).
   * Permet d'escalader le stade plus vite si l'enfant est bloqué depuis longtemps.
   */
  function countHintsForQuestion(history, questionText) {
    if (!questionText) return 0;
    const key = questionText.slice(0, 25).toLowerCase();
    return history.filter(m => m.role === 'user' && (m.content || '').toLowerCase().includes(key)).length;
  }

  /**
   * Extrait un résumé des indices déjà donnés par Milo (3 dernières réponses).
   * Injecté dans le prompt pour éviter que Milo répète le même angle d'explication.
   */
  function extractPreviousHints(history) {
    const miloTurns = history
      .filter(m => m.role === 'assistant')
      .map(m => (m.content || '').trim())
      .filter(Boolean);
    if (!miloTurns.length) return '';
    const previews = miloTurns.slice(-3).map((t, i) => `  [${i + 1}] ${t.slice(0, 120).replace(/\n/g, ' ')}…`);
    return '\nINDICES DÉJÀ DONNÉS (ne PAS répéter le même angle — trouver une approche différente) :\n' + previews.join('\n');
  }

  /**
   * Détecte le stade d'aide optimal selon l'historique et le contenu du message.
   *
   * Stades :
   *   1 → Premier contact : écouter, questionner (pas d'indice encore)
   *   2 → Première piste  : analogie, rappel de règle (sans révéler la réponse)
   *   3 → Indice ciblé   : pointe directement le blocage précis
   *   4 → Explication complète : révèle la réponse + raisonnement complet
   *
   * @param {string|null} questionText - Texte de la question affichée (pour compter les répétitions)
   * @returns {1|2|3|4}
   */
  function getExplorationStage(history, msg, questionText) {
    const low = msg.toLowerCase();

    // Signaux explicites qui court-circuitent le comptage de tours
    if (/encore un indice/i.test(low))                                   return 3;
    if (/c['']?était faux|c'?est faux|mauvais|pas la bonne/i.test(low)) return 2;
    if (/toujours pas|je comprends toujours|encore bloqué/i.test(low))  return 3;

    // Si l'enfant a demandé de l'aide 3× sur cette même question → explication complète directe
    const repeatCount = countHintsForQuestion(history, questionText);
    if (repeatCount >= 3) return 4;
    if (repeatCount >= 2) return 3;

    // Sinon : escalade progressive selon le nombre de tours IA
    const aiTurns = history.filter(m => m.role === 'assistant').length;
    if (aiTurns === 0) return 1;
    if (aiTurns === 1) return 2;
    if (aiTurns <= 3) return 3;
    return 4;
  }

  /**
   * Détecte l'état émotionnel du message pour adapter le ton de Milo.
   * Couvre le langage SMS courant des enfants (jsp, sé pa, chui perdu…).
   * @returns {'success'|'frustrated'|'confused'|'neutral'}
   */
  function detectEmotion(msg) {
    const low = msg.toLowerCase();
    if (/j'?ai trouv|c'?est [çca]a|j'?ai compris|jai compris|j'?y suis|c'?est bon|trop bien|j'?ai eu/.test(low))
      return 'success';
    if (/comprend(s)? (rien|pas)|nul(le)?|trop dur|c'?est dur|j'?arrive pas|impossible|abandonne|j'?en peux plus|chui nul|je suis nul|jai la flemme|je veux plus/.test(low))
      return 'frustrated';
    if (/quoi[?!]|hein[?!]|\?\?\?|pas s[uû]r|comprend pas la question|c['']?est quoi|jsp|sé pa|sais pas|je sais pas|chui perdu|perdu|comprends rien/.test(low))
      return 'confused';
    return 'neutral';
  }

  /**
   * Calcule le niveau global de l'enfant à partir de tous ses scores.
   * @returns {{ label: string, avg: number|null }}
   */
  function detectNiveauGlobal(scores) {
    if (!scores.length) return { label: 'débutant', avg: null };
    const avg = Math.round(scores.reduce((s, e) => s + (e.score / e.total) * 100, 0) / scores.length);
    if (avg >= 85) return { label: 'expert',          avg };
    if (avg >= 70) return { label: 'avancé',          avg };
    if (avg >= 50) return { label: 'intermédiaire',   avg };
    return            { label: 'en difficulté',        avg };
  }

  // ─── Construction du prompt système ─────────────────────────────────────────

  /**
   * Construit le prompt système complet envoyé à Gemini.
   * Ce prompt est recalculé à chaque requête pour refléter l'état temps-réel.
   *
   * @param {object}  context         - Données enfant + modules (buildChildContext)
   * @param {string|null} currentModule  - Module URL (?m=...)
   * @param {string|null} activityId     - Activité URL (?id=...)
   * @param {Array}   history         - Historique de la conversation
   * @param {string}  message         - Dernier message de l'enfant
   * @param {object|null} currentQuestion - Question affichée sur l'écran (envoyée par le quiz)
   */
  function buildSystemPrompt(context, currentModule, activityId, history, message, currentQuestion) {
    const { enfant, scores, moduleStats, badges, modules } = context;

    // — Analyses du contexte —
    const niveau      = detectNiveauGlobal(scores);
    const screenText  = currentQuestion?.text || null;
    const stage       = getExplorationStage(history, message, screenText);
    const emotion     = detectEmotion(message);
    const wrongAnswer = extractWrongAnswer(message);
    const hintsBlock  = extractPreviousHints(history);

    const strongModules = Object.entries(moduleStats).filter(([, s]) => s.avg >= 70).map(([k]) => MODULE_LABELS[k]);
    const weakModules   = Object.entries(moduleStats).filter(([, s]) => s.avg  < 50).map(([k]) => MODULE_LABELS[k]);

    // — Résolution du module actif (URL > activité > texte du message) —
    const focusActivity  = findActivity(modules, activityId);
    const resolvedModule = currentModule
      || (focusActivity ? focusActivity.module : null)
      || detectModuleFromMessage(message);

    const moduleTip   = resolvedModule ? MODULE_TIPS[resolvedModule] || '' : '';
    const moduleLabel = resolvedModule ? MODULE_LABELS[resolvedModule] : null;

    // — Contexte de l'activité en cours —
    let activityBlock = '';
    if (focusActivity) {
      const qs = formatQuestions(focusActivity.activity.questions);
      activityBlock = [
        `\n📌 ACTIVITÉ EN COURS : "${focusActivity.activity.title}" (${MODULE_LABELS[focusActivity.module]})`,
        qs ? `Questions de cette activité :\n${qs}` : '',
      ].filter(Boolean).join('\n') + '\n';
    }

    // — Bloc ÉCRAN : source de vérité absolue (question visible par l'enfant) —
    let screenBlock = '';
    if (currentQuestion?.text && Array.isArray(currentQuestion.choices)) {
      const { text, choices, correctIndex, displayNumber, total, currentScore } = currentQuestion;
      const correct = typeof correctIndex === 'number' ? choices[correctIndex] : null;
      const choiceLines = choices.map((c, i) => {
        const letter = String.fromCharCode(65 + i);
        return `  ${letter}) ${c}${i === correctIndex ? '  ✅ BONNE RÉPONSE' : ''}`;
      }).join('\n');

      const wrongNote = wrongAnswer
        ? `\nL'enfant a choisi "${wrongAnswer}" — explique spécifiquement POURQUOI ce choix est incorrect,\npuis guide-le vers "${correct}" sans le donner directement.`
        : '';

      // Le score en cours permet à Milo d'adapter son encouragement ("déjà 4/6, super !")
      const scoreNote = (typeof currentScore === 'number' && displayNumber > 1)
        ? `\nScore session : ${currentScore}/${displayNumber - 1} bonnes réponses sur les questions précédentes.`
        : '';

      screenBlock = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  QUESTION AFFICHÉE À L'ÉCRAN  (Q${displayNumber}/${total || '?'})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"${text}"

${choiceLines}
${correct ? `\n→ Réponse correcte : "${correct}"` : ''}${wrongNote}${scoreNote}

⚠️  RÈGLE ABSOLUE : Cette question est ce que l'enfant voit EN CE MOMENT.
Tout ce que tu dis doit concerner UNIQUEMENT cette question.
N'invente aucune autre question. Ne mentionne pas d'autres exercices.
`;
    }

    // — Bloc CIBLÉE : fallback si pas de données écran mais numéro mentionné —
    let pinnedBlock = '';
    if (!screenBlock) {
      const qNum   = extractQuestionNumber(message);
      const pinned = qNum ? findPinnedQuestion(modules, resolvedModule, qNum, activityId) : null;

      if (pinned) {
        const wrongNote = wrongAnswer
          ? `\nL'enfant a répondu "${wrongAnswer}" — explique pourquoi c'est faux avant de guider.`
          : '';
        pinnedBlock = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ QUESTION CIBLÉE (Q${qNum} mentionnée par l'enfant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Activité : "${pinned.activityTitle}"
"${pinned.question}"
${pinned.choices.join('\n')}
→ Bonne réponse : "${pinned.correct || '?'}"${wrongNote}

INSTRUCTION : guide l'enfant vers cette réponse selon le stade d'aide actuel.
`;
      } else if (qNum && !resolvedModule) {
        pinnedBlock = `\n⚠️ L'enfant parle de Q${qNum} mais sans préciser le module. Demande-lui lequel.\n`;
      }
    }

    // — Style selon l'âge —
    const ageStyle = (enfant.age || 10) <= 7
      ? 'Phrases ultra-courtes (max 8 mots). Mots très simples. 1-2 emojis. Beaucoup de chaleur.'
      : enfant.age <= 10
      ? 'Phrases courtes (max 20 mots). Vocabulaire accessible. Quelques emojis. Ton complice.'
      : 'Phrases claires, vocabulaire correct. Emojis discrets (max 1). Ton de pote curieux.';

    // — Instructions selon le stade d'aide —
    const stageGuide = [
      '',
      /* Stade 1 */ `STADE 1 — Écoute active.
Demande ce que l'enfant a déjà compris ou essayé AVANT de donner quoi que ce soit.
Ex : "Tu peux me dire ce que t'as essayé ?" / "Qu'est-ce que tu comprends dans la question ?"
→ Ne révèle PAS encore la piste. Construis d'abord une image de ce que l'enfant sait.`,

      /* Stade 2 */ `STADE 2 — Première piste indirecte.
Tu connais la bonne réponse — construis UNE analogie ou un rappel de règle qui oriente vers elle.
Sois précis sur le CONCEPT en jeu (pas une généralité vague).
Si mauvaise réponse choisie : explique d'abord POURQUOI ce choix-là est incorrect.
Ne révèle pas encore la lettre ou le mot exact de la bonne réponse.`,

      /* Stade 3 */ `STADE 3 — Indice ciblé.
L'enfant bloque. Donne un indice qui pointe DIRECTEMENT vers l'élément manquant.
Formule de préférence comme une question rhétorique :
"Et si tu regardais [X], qu'est-ce que ça te donne ?"
L'indice doit être suffisamment précis pour débloquer, sans donner la réponse en clair.`,

      /* Stade 4 */ `STADE 4 — Explication complète.
L'enfant a vraiment besoin d'aide totale. Révèle la bonne réponse AVEC le raisonnement :
"Voilà comment on trouve — [étapes] — donc la réponse c'est [réponse] !"
Explique aussi POURQUOI les autres choix sont incorrects (très utile pour retenir).
Reste chaleureux : c'est une découverte partagée, pas une leçon magistrale.`,
    ][Math.min(stage, 4)];

    // — Instruction émotionnelle (uniquement si non-neutre) —
    const emotionGuide = {
      success:
        `L'enfant a trouvé (ou croit avoir trouvé). FÊTE sincèrement, puis explique le POURQUOI. ` +
        `Si incomplet, valorise ce qui est juste et donne un petit coup de pouce pour finir.`,
      frustrated:
        `L'enfant est découragé. Empathie COURTE ("C'est dur, t'inquiète !"), ` +
        `puis IMMÉDIATEMENT un indice concret. Ne pas rester trop dans l'empathie — passer vite à l'aide.`,
      confused:
        `L'enfant ne comprend pas la question elle-même. ` +
        `Reformule la question avec d'autres mots + un exemple concret. Puis reprends le stade normal.`,
      neutral: '',
    }[emotion];

    // — Assemblage final du prompt —
    return `Tu es MILO, l'assistant pédagogique d'AtelierKids. Tu parles avec ${enfant.prenom}, ${enfant.age} ans.
${hintsBlock}

STYLE : ${ageStyle}
${screenBlock}${pinnedBlock}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUI EST MILO ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Milo est un ami compétent et bienveillant. Il connaît parfaitement toutes les questions
et les bonnes réponses de chaque module — il s'en sert pour guider l'enfant intelligemment.
Il ne donne jamais la réponse directement (sauf stade 4), il GUIDE vers elle.

• Ton : complice, enthousiaste, jamais condescendant
• Utilise le prénom de l'enfant naturellement dans la conversation
• Célèbre chaque progrès sincèrement — varie les formules (ne jamais répéter la même)
• Si l'enfant écrit en SMS ou avec des fautes, répond normalement sans le corriger

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROCESSUS INTERNE (à appliquer mentalement avant chaque réponse)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. IDENTIFIER  — Sur quelle question précise porte le message ? (voir bloc ÉCRAN ou CIBLÉE ci-dessus)
2. CONNAÎTRE   — Quelle est la bonne réponse [CORRECT] ? Quel raisonnement y mène ?
3. DIAGNOSTIQUER — Qu'est-ce que l'enfant ne comprend pas ? Pourquoi a-t-il choisi ce mauvais choix ?
4. ADAPTER     — Construis ta réponse selon le stade actuel (voir ci-dessous).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÈGLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Ne révèle jamais [CORRECT] mot pour mot (sauf stade 4). Utilise-le pour tes indices.
2. Si l'enfant propose une réponse → dis-lui clairement si c'est juste ou non (bienveillant mais net).
3. Hors-sujet AtelierKids → redirige gentiment en 1 phrase.
4. Format : **gras** pour les mots-clés. Listes si plusieurs points. Max 3 paragraphes courts.
5. Si tu n'as pas assez d'info sur la question → demande à l'enfant de préciser.
6. Si l'enfant dit "j'ai compris" / "merci" / "c'est bon" → célèbre brièvement, puis propose-lui de répondre seul à la question sans aide. Exemple : "Super ! Maintenant essaie de répondre sans moi — tu vas y arriver !"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STADE D'AIDE ACTUEL : ${stage}/4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${stageGuide}
${emotionGuide ? `\n🎭 ÉMOTION DÉTECTÉE : ${emotionGuide}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFIL DE ${enfant.prenom.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Âge : ${enfant.age} ans | Niveau global : ${niveau.label}${niveau.avg !== null ? ` (${niveau.avg}% de moyenne)` : ''}
Badges obtenus : ${badges.length ? badges.join(', ') : 'aucun pour l\'instant'}
${moduleLabel ? `Module actuel : ${moduleLabel}` : ''}
${activityBlock}
Points forts : ${strongModules.length ? strongModules.join(', ') : 'pas encore de données'}
Points à travailler : ${weakModules.length ? weakModules.join(', ') : 'aucun identifié'}

Dernières activités :
${scores.length
  ? scores.slice().reverse().slice(0, 8).map(s =>
      `• ${MODULE_LABELS[s.module] || s.module} — "${s.activityTitle}" : ${s.score}/${s.total} (${Math.round(s.score / s.total * 100)}%)`
    ).join('\n')
  : '  Aucune activité encore.'}
${moduleTip ? `\nAPPROCHE PÉDAGOGIQUE POUR CE MODULE :\n${moduleTip}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENU DES MODULES
(Module actif : contenu complet. Autres : résumé 1 ligne pour éviter la confusion.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatModulesForPrompt(modules, resolvedModule)}`;
  }

  // ─── Route principale ────────────────────────────────────────────────────────

  router.post('/', requireAuth('child'), async (req, res) => {
    // Validation et nettoyage des entrées
    const message    = String(req.body.message || '').trim();
    const history    = Array.isArray(req.body.history) ? req.body.history : [];
    const currentModule = MODULE_KEYS.includes(req.body.currentModule) ? req.body.currentModule : null;
    const activityId    = typeof req.body.activityId === 'string'
      ? req.body.activityId.slice(0, 80) : null;
    const currentQuestion = (req.body.currentQuestion && typeof req.body.currentQuestion === 'object')
      ? req.body.currentQuestion : null;

    if (!message) return res.status(400).json({ error: 'Message vide.' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Assistant IA non configuré.' });

    try {
      const context = buildChildContext(req);
      const prompt  = buildSystemPrompt(context, currentModule, activityId, history, message, currentQuestion);

      const geminiModel = getGeminiClient().getGenerativeModel({
        model: MODEL,
        systemInstruction: prompt,
        generationConfig: {
          temperature:     0.6,   // Assez créatif pour varier le ton, assez précis pour ne pas halluciner
          topP:            0.90,
          topK:            40,
          maxOutputTokens: 800,   // Réponses concises — les enfants ne lisent pas les pavés
        },
      });

      // Filtre et adapte l'historique au format Gemini (roles: user/model)
      const geminiHistory = history
        .filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
        .slice(-14)  // 7 échanges max → évite les prompts trop longs
        .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

      const chat   = geminiModel.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(message);
      const reply  = result.response.text().trim();

      res.json({ reply: reply || "Désolé, je n'ai pas pu générer de réponse." });

    } catch (err) {
      console.error('[Milo] Erreur Gemini :', err.message);

      if ((err.message || '').match(/quota|429|rate.?limit/i)) {
        return res.status(429).json({
          error: "Je suis un peu débordé là ! Réessaie dans quelques secondes 😊",
        });
      }
      res.status(502).json({ error: "L'assistant IA est momentanément indisponible." });
    }
  });

  return router;
};
