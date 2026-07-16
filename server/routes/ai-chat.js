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
const { safeJson, publicChild, contentItem, sameId } = require('../ai-chat-utils');

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

function buildFallbackReply({ message, currentModule, currentQuestion, context }) {
  const moduleLabel = currentModule ? (MODULE_LABELS[currentModule] || currentModule) : 'ton module';
  const questionText = currentQuestion?.text || currentQuestion?.question || '';
  const age = context?.enfant?.age ? ` Tu as ${context.enfant.age} ans, donc je reste simple et direct.` : '';
  const lower = String(message || '').toLowerCase();

  if (lower.includes('bloque') || lower.includes('bloqué') || lower.includes('bloquee') || lower.includes('bloquée')) {
    return `On reprend calmement sur ${moduleLabel}. ${questionText ? `La consigne est: ${questionText} ` : ''}Fais trois choses: 1) lis la consigne, 2) repère ce qu'on te demande, 3) réponds d'abord avec l'idée la plus simple.${age}`;
  }

  if (lower.includes('exercice') || lower.includes('quiz') || lower.includes('question')) {
    return `Pour ${moduleLabel}, commence par supprimer les réponses impossibles, puis cherche l'indice dans la leçon ou la consigne. Si tu veux, envoie-moi la question exacte et je te guide étape par étape.${age}`;
  }

  if (lower.includes('bonjour') || lower.includes('salut')) {
    return `Salut ! On avance ensemble sur ${moduleLabel}. Dis-moi ce que tu vois ou ce qui te bloque, et je t'aide simplement et sans te noyer.${age}`;
  }

  return `Je ne peux pas interroger Gemini maintenant, mais je peux quand même t'aider sur ${moduleLabel}. Dis-moi la consigne exacte ou le point qui te bloque, et je te guide pas à pas.${age}`;
}

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

  // Mémoire persistante de Milo — concepts expliqués à l'enfant
  // julianday() permet de calculer les jours écoulés côté SQLite (évite les problèmes de timezone JS)
  const stmtLoadMemories = db.prepare(`
    SELECT *, CAST((julianday('now') - julianday(last_seen)) AS INTEGER) AS days_ago
    FROM milo_memory WHERE child_id = ? ORDER BY last_seen DESC LIMIT 30
  `);
  const stmtGetMemory    = db.prepare(`SELECT id FROM milo_memory WHERE child_id = ? AND concept_low = ?`);
  const stmtRecallMemory = db.prepare(`
    SELECT concept, times_seen, CAST((julianday('now') - julianday(last_seen)) AS INTEGER) AS days_ago
    FROM milo_memory WHERE child_id = ? AND concept_low = ?
  `);
  const stmtInsertMemory = db.prepare(`
    INSERT OR IGNORE INTO milo_memory (child_id, module, concept, concept_low, context, summary)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const stmtUpdateMemory = db.prepare(`
    UPDATE milo_memory SET times_seen = times_seen + 1, last_seen = datetime('now') WHERE id = ?
  `);

  // Bibliothèque de réponses préfabriquées (KB) — servies sans appel API
  const stmtLoadKb = db.prepare('SELECT * FROM milo_kb WHERE enabled = 1');
  const stmtKbHit  = db.prepare('UPDATE milo_kb SET hits = hits + 1 WHERE id = ?');

  // Journal des questions "définition" non couvertes par la KB → candidates à ajouter
  const stmtKbMiss = db.prepare(`
    INSERT INTO milo_kb_miss (message_norm, module) VALUES (?, ?)
    ON CONFLICT(message_norm, module)
    DO UPDATE SET count = count + 1, last_seen = datetime('now')
  `);

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
      const found = mod && [...mod.quizzes, ...mod.exercises].find(x => sameId(x.id, s.ref));
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
      const found = mod && [...mod.quizzes, ...mod.exercises].find(x => sameId(x.id, activityId));
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
    // Ordinaux en toutes lettres (les quiz vont jusqu'à 10 questions)
    const ordinals = {
      premi: 1, deuxi: 2, troisi: 3, quatri: 4, cinqui: 5,
      sixi: 6, septi: 7, huiti: 8, neuvi: 9, dixi: 10,
    };
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
      lecture:   ['lecture', 'lire', 'texte', 'compréhension', 'comprehension', 'synonyme', 'antonyme', 'contraire', 'histoire', 'paragraphe', 'personnage', 'morale'],
      numerique: ['numérique', 'numerique', 'informatique', 'ordinateur', 'internet', 'réseau', 'reseau', 'adresse ip', 'wifi', 'wi-fi', 'email', 'mail', 'fichier', 'logiciel', 'mot de passe'],
      robotique: ['robotique', 'robot', 'programme', 'séquence', 'sequence', 'algorithme', 'algo', 'boucle', 'instruction', 'capteur', 'moteur', 'scratch', 'actionneur', 'microcontrôleur', 'microcontroleur'],
      anglais:   ['anglais', 'english', 'traduction', 'traduire', 'vocabulary', 'grammaire', 'mot anglais'],
      civique:   ['civique', 'citoyenneté', 'citoyennete', 'droits', 'devoirs', 'société', 'societe', 'loi', 'démocratie', 'democratie', 'laïcité', 'laicite', 'vote', 'président', 'president', 'marianne', 'harcèlement', 'harcelement'],
      eco:       ['éco', 'eco', 'environnement', 'nature', 'planète', 'planete', 'recyclage', 'climat', 'énergie', 'energie', 'pollution', 'déchet', 'dechet', 'tri', 'biodiversité', 'biodiversite', 'compost'],
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
    // Couvre les tournures directes ("j'ai répondu X") et rétrospectives ("j'avais mis X"),
    // avec ou sans connecteur de contraste explicite ("mais c'est faux" est optionnel :
    // le contexte "mauvaise réponse" est parfois déjà donné par miloWrongAnswer()).
    const m = msg.match(
      /(?:j'?ai (?:répondu|choisi|mis|dit|coché|coche|sélectionné|selectionne)|j'?avais (?:mis|répondu|choisi)|je pensais que c'?[ée]tait)\s*[«"']?([^«"',!?\.]+?)[»"']?(?:\s*(?:mais|et|or|pourtant)\b.*)?$/i
    );
    return m ? m[1].trim() : null;
  }

  /**
   * Si l'enfant tape juste le texte d'un choix (sans phrase complète), détecte à quel
   * choix ça correspond parmi ceux de la question affichée — et si c'est le bon.
   * Réduit le risque que Gemini se trompe en interprétant une réponse ambiguë.
   * Ignoré si le message est long (probable question/phrase, pas une simple réponse)
   * ou si plusieurs choix matchent à la fois (ambigu).
   *
   * @returns {{ choice:string, correct:boolean } | null}
   */
  function detectProposedChoice(msg, currentQuestion) {
    if (!currentQuestion || !Array.isArray(currentQuestion.choices)) return null;
    const norm = normalize(msg);
    if (!norm || norm.length > 40) return null;

    const matches = [];
    currentQuestion.choices.forEach((choice, i) => {
      const cNorm = normalize(choice);
      if (!cNorm) return;
      const allowed = Math.max(1, Math.floor(cNorm.length * 0.2));
      if (approxSubstringDistance(norm, cNorm) <= allowed) matches.push({ choice, i });
    });

    if (matches.length !== 1) return null; // 0 ou ambigu (plusieurs choix) → on ne tranche pas
    return { choice: matches[0].choice, correct: matches[0].i === currentQuestion.correctIndex };
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

  // ─── Mémoire persistante ────────────────────────────────────────────────────

  /**
   * Charge les 30 derniers souvenirs Milo pour un enfant.
   * `days_ago` est calculé par SQLite (évite les décalages de fuseau horaire JS).
   */
  function loadMemories(childId) {
    return stmtLoadMemories.all(childId);
  }

  // ─── Bibliothèque de réponses préfabriquées ──────────────────────────────────

  /**
   * Normalise un texte pour la comparaison : minuscules, sans accents,
   * ponctuation remplacée par des espaces, espaces multiples réduits.
   * Ainsi "C'est quoi un Synonyme ?" et "cest quoi un synonyme" matchent.
   */
  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')  // retire les accents
      .replace(/[^a-z0-9]+/g, ' ')                        // ponctuation → espace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Traduit les raccourcis systématiques des enfants vers une forme standard,
   * pour que la bibliothèque les comprenne ("c koi" → "c est quoi", "koi" → "quoi").
   * S'applique à un texte DÉJÀ normalisé (minuscules, sans accents, tokenisé par espaces).
   */
  function kidSpeak(msg) {
    let s = ' ' + msg + ' ';
    s = s.replace(/ ko[ia] /g, ' quoi ')                       // koi, koa → quoi
         .replace(/ ki /g, ' qui ')
         .replace(/ (koman|komen|comen) /g, ' comment ')       // koman → comment
         .replace(/ (pk|pkoi|pq|pourkoi|pourkoa) /g, ' pourquoi ')
         .replace(/ (keske|kesske|keske|kes ke) /g, ' qu est ce que ')
         .replace(/ (c|ce|s|se|cet|cest) quoi /g, ' c est quoi ') // c koi / ce koi → c est quoi
         .replace(/ (sa|ca) (ve|veu) /g, ' ca veut ')           // sa ve dire → ca veut dire
         .replace(/ dir /g, ' dire ');
    return s.replace(/\s+/g, ' ').trim();
  }

  /**
   * Distance d'édition minimale pour aligner `pattern` sur N'IMPORTE QUEL
   * sous-texte de `text` (approximate substring matching). La 1ʳᵉ ligne de la
   * matrice reste à 0 : le motif peut donc commencer à n'importe quel endroit.
   * Sert à tolérer les fautes d'orthographe des enfants ("sinonime" ≈ "synonyme").
   */
  function approxSubstringDistance(text, pattern) {
    const n = text.length, m = pattern.length;
    if (m === 0) return 0;
    let prev = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
      const cur = new Array(n + 1);
      cur[0] = i;
      for (let j = 1; j <= n; j++) {
        const cost = pattern[i - 1] === text[j - 1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      prev = cur;
    }
    return Math.min(...prev);
  }

  /**
   * Cherche une réponse préfabriquée correspondant au message de l'enfant.
   *
   * 1) Correspondance EXACTE : une phrase-déclencheur (séparées par |) est
   *    contenue telle quelle dans le message → le déclencheur le plus long gagne.
   * 2) Repli TOLÉRANT AUX FAUTES : si rien d'exact, on accepte une phrase-
   *    déclencheur approchée (≤20% de fautes) — mais on exige que TOUTE la phrase
   *    corresponde, pas juste le mot-concept, pour éviter les faux positifs.
   *
   * Les entrées ciblées par `module` ne matchent que dans ce module.
   * @returns {{ id:number, answer:string, source:'exact'|'fuzzy' } | null}
   */
  function findKbAnswer(message, resolvedModule) {
    const msg = kidSpeak(normalize(message));
    if (msg.length < 3) return null;

    const entries = stmtLoadKb.all().filter(e => !e.module || e.module === resolvedModule);

    // — 1) Exact (rapide, prioritaire) —
    let best = null, bestLen = 0;
    for (const entry of entries) {
      for (const trigger of entry.keywords.split('|')) {
        const t = normalize(trigger);
        if (t.length >= 4 && msg.includes(t) && t.length > bestLen) {
          best = entry; bestLen = t.length;
        }
      }
    }
    if (best) return { id: best.id, answer: best.answer, label: best.label, source: 'exact' };

    // — 2) Tolérant aux fautes (uniquement sur phrases assez longues) —
    let fuzzyBest = null, fuzzyScore = Infinity;
    for (const entry of entries) {
      for (const trigger of entry.keywords.split('|')) {
        const t = normalize(trigger);
        if (t.length < 8) continue;                       // trop court → risque de faux positif
        const allowed = Math.max(2, Math.floor(t.length * 0.2));
        const d = approxSubstringDistance(msg, t);
        if (d <= allowed) {
          // À nombre de fautes égal, on préfère la phrase-déclencheur la plus longue
          const score = d / t.length - t.length / 1000;
          if (score < fuzzyScore) { fuzzyBest = entry; fuzzyScore = score; }
        }
      }
    }
    return fuzzyBest ? { id: fuzzyBest.id, answer: fuzzyBest.answer, label: fuzzyBest.label, source: 'fuzzy' } : null;
  }

  /** Choisit un élément au hasard dans un tableau. */
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /**
   * Relie une réponse de la bibliothèque à la mémoire persistante de Milo,
   * et VARIE la formulation pour ne jamais répéter le même texte à l'identique.
   *
   * Trois cas selon l'historique du concept (entrées "Définition : X" / "Astuce : X") :
   *   • Jamais vu           → réponse telle quelle.
   *   • Revu le jour même   → courte intro "on vient d'en parler" (variée).
   *   • Revu il y a ≥2 jours → rappel affectueux daté ("tu te rappelles, il y a 3 jours…").
   *
   * Dans tous les cas le concept est enregistré/réactivé en mémoire, pour que les
   * explications instantanées comptent autant que celles générées par Gemini.
   *
   * @returns {string} La réponse finale (éventuellement préfixée).
   */
  function applyKbMemory(childId, module, kb, questionText) {
    const conceptMatch = /^(?:Définition|Astuce)\s*:\s*(.+)$/.exec(kb.label || '');
    if (!conceptMatch) return kb.answer;                 // politesse, soutien… → pas un concept

    const concept = conceptMatch[1].trim();
    const low = concept.toLowerCase();
    let reply = kb.answer;

    try {
      const mem = stmtRecallMemory.get(childId, low);
      if (mem && mem.days_ago >= 2) {
        // Rappel long terme : on date le souvenir
        const when = mem.days_ago < 7 ? `il y a ${mem.days_ago} jours` : 'il y a quelque temps';
        reply = `${pick([
          `Tu te rappelles, on en avait parlé ${when} 😊 Petit rappel :`,
          `Ça me dit quelque chose… on avait vu ça ${when} ! Je te rafraîchis la mémoire :`,
          `On en a déjà parlé ${when}, tu te souviens ? 💡 Voilà pour te rappeler :`,
        ])}\n\n${kb.answer}`;
      } else if (mem && mem.times_seen >= 1) {
        // Même session / même journée : rotation déterministe (jamais 2× la même de suite)
        const variants = [
          'Encore un petit rappel 😊 :',
          'Pas de souci, on revoit ça ensemble :',
          'Je te le remets, tranquille 👍 :',
          'Tu y es presque — voilà encore une fois :',
        ];
        reply = `${variants[mem.times_seen % variants.length]}\n\n${kb.answer}`;
      }
      // Enregistre / réactive le concept en mémoire (silencieux si échec)
      saveMemory(childId, module || null, concept, questionText || null, kb.answer.slice(0, 200));
    } catch (e) {
      console.warn('[Milo] Mémoire KB ignorée :', e.message);
    }
    return reply;
  }

  // ─── Garde-fou : détection d'usage détourné (charabia, provoc') ──────────────

  /**
   * Détecte un message qui n'est pas une vraie demande d'aide : clavier tapé au
   * hasard, mots rigolos, ou provocation envers Milo. Renvoie une réponse douce
   * (0 token, jamais vexée) pour recadrer, ou null si le message semble légitime.
   *
   * Volontairement CONSERVATEUR : en cas de doute, on renvoie null → Gemini prend
   * le relais. On ne bloque JAMAIS une vraie question. On ne traite pas les
   * répétitions (cliquer plusieurs fois "Encore un indice" est légitime).
   *
   * @returns {{ reply:string } | null}
   */
  function detectMisuse(message) {
    const low = normalize(message);
    if (!low) return null;
    const compact = low.replace(/\s+/g, '');

    // 1) Charabia : suite de lettres sans voyelle, lettre répétée 4×+, ou rangée de clavier
    const gibberish =
      (/^[a-z]{4,}$/.test(compact) && !/[aeiouy]/.test(compact)) ||
      /([a-z])\1{3,}/.test(compact) ||
      /\b(azerty|qwerty|azertyuiop|qwertyuiop|asdfgh|qsdfgh|wxcvbn|hjklm|bidule|blabla|nawak)\b/.test(low);

    if (gibberish) {
      return { reply: pick([
        "Oups, j'ai pas compris ça 😅 Réécris-moi ta question autrement et je t'aide !",
        "Hmm, on dirait que ton chat a marché sur le clavier 🐱 Dis-moi ce qui te bloque !",
        "Là je suis un peu perdu 😄 Reformule-moi ce que tu cherches, on va y arriver !",
      ]) };
    }

    // 2) Mots rigolos → on rit avec l'enfant puis on recentre
    if (/\b(caca|pipi|prout|zizi|crotte|popo|kaka|pet|pets|fesse|fesses)\b/.test(low)) {
      return { reply: pick([
        "Haha 😄 Bon, on se concentre sur la question maintenant — je suis là pour t'aider à la réussir !",
        "Hihi 🙈 Allez, revenons à ton exercice ! Dis-moi ce qui te bloque.",
      ]) };
    }

    // 3) Provocation / impolitesse envers Milo → on reste calme, jamais vexé
    const rude = /\b(idiot|idiote|debile|stupide|abruti|abrutie|cretin|cretine|nul a chier|con|conne|connard|salope|merde|putain|pd|tg)\b/
      .test(low) || /t'?es? (nul|bete|moche|debile)|tu es (nul|bete|debile)|tu ser[st] a rien|ta gueule|tais[ -]?toi|ferme[ -]?la/.test(low);

    if (rude) {
      return { reply: pick([
        "Pas grave si tu es un peu agacé 😊 Moi je reste ton copain. Dis-moi ce qui coince dans la question et on avance !",
        "Oh là ! 😮 Entre copains, on reste polis. Allez, montre-moi ce qui te bloque, je suis là pour t'aider !",
        "Je ne me fâche jamais, moi 😄 On repart du bon pied ? Dis-moi ce que tu ne comprends pas.",
      ]) };
    }

    return null;
  }

  /**
   * Enregistre un concept expliqué par Milo, ou incrémente le compteur si déjà connu.
   * La déduplication est insensible à la casse via `concept_low`.
   */
  function saveMemory(childId, module, concept, context, summary) {
    const low = concept.toLowerCase().trim();
    const existing = stmtGetMemory.get(childId, low);
    if (existing) {
      stmtUpdateMemory.run(existing.id);
    } else {
      stmtInsertMemory.run(childId, module || null, concept, low, context || null, summary || null);
    }
  }

  /**
   * Formate les souvenirs pour injection dans le prompt système.
   *
   * Sélection :
   *   - Concepts "pertinents" : leur mot apparaît dans la question ou le message actuel
   *   - 5 souvenirs les plus récents en complément
   *   - Maximum 10 entrées pour ne pas surcharger le contexte Gemini
   */
  function buildMemoryPrompt(memories, message, questionText, prenom) {
    if (!memories.length) return '';

    const searchText  = ((message || '') + ' ' + (questionText || '')).toLowerCase();
    const relevant    = memories.filter(m => searchText.includes(m.concept_low));
    const relevantIds = new Set(relevant.map(m => m.id));
    const recent      = memories.filter(m => !relevantIds.has(m.id)).slice(0, 5);
    const toShow      = [...relevant, ...recent].slice(0, 10);
    if (!toShow.length) return '';

    const lines = toShow.map(m => {
      const when     = m.days_ago === 0 ? "aujourd'hui" : m.days_ago === 1 ? 'hier' : `il y a ${m.days_ago} jours`;
      const seenNote = m.times_seen > 1 ? `, revu ${m.times_seen - 1}× depuis` : '';
      const modNote  = m.module ? ` (${MODULE_LABELS[m.module] || m.module})` : '';
      const flag     = relevantIds.has(m.id) ? ' ⬅ pertinent' : '';
      return `• "${m.concept}"${modNote} — expliqué ${when}${seenNote}${flag}`;
    });

    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 MÉMOIRE PARTAGÉE — concepts déjà expliqués à ${prenom}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${lines.join('\n')}

→ Concept ⬅ pertinent : fais le lien naturellement — "Tu te rappelles quand on avait parlé de [concept] ?"
→ Concept revu 3+ fois : l'enfant le connaît sûrement — teste-le : "C'est quoi [concept] selon toi ?"
→ Ne réexplique jamais un concept listé comme si c'était la première fois.`;
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
   * Construit un bloc de profil d'apprentissage basé sur les stats de session.
   * Injecté dans le prompt pour que Milo adapte son point d'entrée pédagogique
   * à ce que l'enfant a montré sur les questions précédentes du même quiz.
   *
   * @param {{ hints: number[], avg: number, streak: number, correctAfterHelp: number } | null} stats
   * @returns {string}
   */
  function buildLearningProfile(stats) {
    if (!stats || !Array.isArray(stats.hints) || !stats.hints.length) return '';

    const { hints, avg = 0, streak = 0, correctAfterHelp = 0 } = stats;
    const n = hints.length;
    const lines = [];

    // Profil selon la moyenne d'indices par question
    if (n >= 2) {
      if (avg >= 3) {
        lines.push(`L'enfant a besoin de beaucoup d'aide : ${avg} indices en moyenne sur ${n} question(s).`);
        lines.push("→ Ne lui demande PAS 'qu'est-ce que tu as essayé ?' — ça le frustre. Commence directement par une analogie concrète. Va droit au but dès le 1er message.");
      } else if (avg >= 2) {
        lines.push(`L'enfant a besoin de quelques indices : ${avg} en moyenne sur ${n} question(s).`);
        lines.push("→ Stade 1 très court (une seule question de relance max), puis passe vite à l'analogie.");
      } else if (avg <= 0.5 && n >= 3) {
        lines.push(`L'enfant est en confiance : seulement ${avg} indice(s) en moyenne sur ${n} question(s).`);
        lines.push("→ S'il demande de l'aide maintenant, c'est qu'il est vraiment bloqué. Va directement à l'essentiel.");
      }
    }

    // Série de réponses correctes sans aide
    if (streak >= 7) {
      lines.push(`⭐ SÉRIE EXCEPTIONNELLE : ${streak} bonnes réponses d'affilée sans aide ! Mentionne-la avec enthousiasme.`);
    } else if (streak >= 5) {
      lines.push(`🚀 SÉRIE : ${streak} bonnes réponses sans aide ! C'est impressionnant — valorise-le.`);
    } else if (streak >= 3) {
      lines.push(`🔥 ${streak} de suite sans aide — l'enfant est en feu. Un mot dessus pour l'encourager.`);
    }

    // Hints efficaces → l'enfant progresse grâce aux explications
    if (correctAfterHelp >= 3) {
      lines.push(`L'enfant a réussi ${correctAfterHelp} fois après avoir reçu de l'aide → il retient et applique bien. Valorise cette capacité à apprendre !`);
    }

    if (!lines.length) return '';

    return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 PROFIL D'APPRENTISSAGE (session en cours — ${n} question(s) analysée(s))
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${lines.join('\n')}`;
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
   * @param {string|null} questionText    - Texte de la question affichée (pour compter les répétitions)
   * @param {object|null} sessionLearning - Profil de session (pour sauter les stades inutiles)
   * @returns {1|2|3|4}
   */
  function getExplorationStage(history, msg, questionText, sessionLearning) {
    const low = msg.toLowerCase();

    // Signaux explicites qui court-circuitent le comptage de tours
    if (/encore un indice/i.test(low))                                   return 3;
    if (/c['']?était faux|c'?est faux|mauvais|pas la bonne/i.test(low)) return 2;
    if (/toujours pas|je comprends toujours|encore bloqué/i.test(low))  return 3;

    // Si l'enfant a demandé de l'aide 3× sur cette même question → explication complète directe
    const repeatCount = countHintsForQuestion(history, questionText);
    if (repeatCount >= 3) return 4;
    if (repeatCount >= 2) return 3;

    const aiTurns = history.filter(m => m.role === 'assistant').length;

    // Adaptation au profil de session : si l'enfant a besoin de ≥3 indices en moyenne
    // sur les questions précédentes, sauter le stade 1 (écoute) dès le premier contact —
    // lui demander "qu'est-ce que tu as essayé ?" le frustre plus que ça ne l'aide.
    const avgHints = sessionLearning?.avg || 0;
    const prevQuestions = sessionLearning?.hints?.length || 0;
    if (prevQuestions >= 2 && avgHints >= 3 && aiTurns === 0) return 2;

    // Escalade progressive standard
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
    if (/j'?ai trouv|c'?est [çca]a|j'?ai compris|jai compris|j'?y suis|c'?est bon|trop bien|j'?ai eu|j'?ai gagn|r[ée]ussi|voil[àa]/.test(low))
      return 'success';
    if (/comprend(s)? (rien|pas)|nul(le)?|trop dur|c'?est dur|j'?arrive pas|impossible|abandonne|j'?en peux plus|chui nul|je suis nul|jai la flemme|je veux plus|j'?en ai marre|ras le bol|trop long|p[ée]nible/.test(low))
      return 'frustrated';
    if (/quoi[?!]|hein[?!]|\?\?\?|pas s[uû]r|comprend pas la question|c['']?est quoi|jsp|sé pa|sais pas|je sais pas|chui perdu|perdu|comprends rien|bloqu[ée]|coinc[ée]/.test(low))
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
  function buildSystemPrompt(context, currentModule, activityId, history, message, currentQuestion, sessionLearning, memories) {
    const { enfant, scores, moduleStats, badges, modules } = context;

    // — Analyses du contexte —
    const niveau          = detectNiveauGlobal(scores);
    const screenText      = currentQuestion?.text || null;
    const stage           = getExplorationStage(history, message, screenText, sessionLearning);
    const emotion         = detectEmotion(message);
    const wrongAnswer     = extractWrongAnswer(message);
    const hintsBlock      = extractPreviousHints(history);
    const learningProfile = buildLearningProfile(sessionLearning);
    const memoryBlock     = buildMemoryPrompt(memories || [], message, screenText, enfant.prenom);

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

      // Si l'enfant a juste tapé un mot (sans phrase "j'ai répondu..."), on a déjà
      // vérifié nous-mêmes s'il correspond à un choix — Gemini n'a plus à deviner.
      const proposed = wrongAnswer ? null : detectProposedChoice(message, currentQuestion);
      const proposedNote = proposed
        ? proposed.correct
          ? `\nL'enfant vient de proposer "${proposed.choice}" — C'EST LA BONNE RÉPONSE. Félicite-le et explique brièvement pourquoi c'est juste.`
          : `\nL'enfant vient de proposer "${proposed.choice}" — c'est INCORRECT. Explique pourquoi, puis guide-le vers "${correct}" sans le donner directement.`
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
${correct ? `\n→ Réponse correcte : "${correct}"` : ''}${wrongNote}${proposedNote}${scoreNote}

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
${memoryBlock}${learningProfile}${hintsBlock}

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
7. MÉMORISATION : Si tu expliques un concept/mot/règle NOUVEAU (absent de la mémoire ci-dessus), ajoute exactement à la TOUTE FIN de ta réponse : [MEM:le_concept]. Un seul tag par réponse. Exemples : [MEM:synonyme], [MEM:boucle], [MEM:droits du citoyen]. N'ajoute ce tag que si c'est vraiment la 1ère explication — pas pour des rappels ou des reformulations.

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
    const sessionLearning = (req.body.sessionLearning && typeof req.body.sessionLearning === 'object')
      ? req.body.sessionLearning : null;

    if (!message) return res.status(400).json({ error: 'Message vide.' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Assistant IA non configuré.' });

    // ── Voie rapide : bibliothèque de réponses préfabriquées ──────────────────
    // Si le message correspond à une entrée connue, on répond instantanément
    // sans appeler Gemini (0 token consommé, 0 latence réseau).
    const kbModule = currentModule || detectModuleFromMessage(message);
    try {
      const kb = findKbAnswer(message, kbModule);
      if (kb) {
        stmtKbHit.run(kb.id);
        // Relie la réponse à la mémoire persistante : rappel si déjà vu + enregistrement
        const reply = applyKbMemory(req.auth.id, kbModule, kb, currentQuestion?.text);
        return res.json({ reply, source: 'kb' });
      }
      // Garde-fou : charabia / provoc' → recadrage doux sans appeler Gemini
      const misuse = detectMisuse(message);
      if (misuse) return res.json({ reply: misuse.reply, source: 'guard' });
      // Question type "définition" non couverte → on la note pour enrichir la KB
      if (/c'?est quoi|ca veut dire|que veut dire|c'?est koi|ce koi|definition|a quoi (ca |sa )?sert/i.test(message)) {
        const norm = message.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
        if (norm.length >= 3) stmtKbMiss.run(norm, kbModule || null);
      }
    } catch (e) {
      console.warn('[Milo] Bibliothèque KB ignorée :', e.message);
    }

    try {
      const context  = buildChildContext(req);
      const memories = loadMemories(req.auth.id);

      // Résolution du module actif (nécessaire aussi pour sauvegarder les souvenirs)
      const focusAct       = findActivity(context.modules, activityId);
      const resolvedModule = currentModule
        || (focusAct ? focusAct.module : null)
        || detectModuleFromMessage(message);

      const prompt = buildSystemPrompt(context, currentModule, activityId, history, message, currentQuestion, sessionLearning, memories);

      const geminiModel = getGeminiClient().getGenerativeModel({
        model: MODEL,
        systemInstruction: prompt,
        generationConfig: {
          temperature:     0.6,
          topP:            0.90,
          topK:            40,
          maxOutputTokens: 800,
          // Désactive le mode "thinking" de Gemini 2.5 — évite que le modèle
          // sorte sa chaîne de raisonnement dans la réponse visible par l'enfant
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      // Filtre et adapte l'historique au format Gemini (roles: user/model)
      const geminiHistory = history
        .filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
        .slice(-14)  // 7 échanges max → évite les prompts trop longs
        .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

      const chat   = geminiModel.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(message);
      const raw    = result.response.text().trim();

      // Extraire et strip le tag mémoire [MEM:concept] inséré par Gemini
      const memMatch = raw.match(/\[MEM:([^\]]{1,50})\]/);
      const concept  = memMatch ? memMatch[1].trim() : null;
      const reply    = raw.replace(/\s*\[MEM:[^\]]*\]/g, '').trim();

      // Enregistrer le nouveau concept en base (silencieux en cas d'erreur pour ne pas bloquer l'enfant)
      if (concept) {
        try {
          saveMemory(
            req.auth.id,
            resolvedModule,
            concept,
            currentQuestion?.text?.slice(0, 100) || null,
            reply.slice(0, 250)
          );
        } catch (e) {
          console.warn('[Milo] Mémoire non sauvegardée :', e.message);
        }
      }

      res.json({ reply: reply || "Désolé, je n'ai pas pu générer de réponse." });

    } catch (err) {
      console.error('[Milo] Erreur Gemini :', err.message);

      if ((err.message || '').match(/quota|429|rate.?limit/i)) {
        const context = buildChildContext(req);
        return res.json({
          reply: buildFallbackReply({ message, currentModule, currentQuestion, context }),
          degraded: true,
          reason: 'gemini_quota',
        });
      }
      res.status(502).json({ error: "L'assistant IA est momentanément indisponible." });
    }
  });

  // ─── Mini-quiz de révision (répétition espacée, 0 token) ─────────────────────

  // Sélectionne le concept "dû" : vu il y a ≥3 jours, le moins réactivé et le plus ancien.
  const stmtDueRevision = db.prepare(`
    SELECT concept, module, summary,
           CAST((julianday('now') - julianday(last_seen)) AS INTEGER) AS days_ago
    FROM milo_memory
    WHERE child_id = ? AND (julianday('now') - julianday(last_seen)) >= 3
    ORDER BY times_seen ASC, last_seen ASC
    LIMIT 1
  `);

  /** Retourne la définition de la bibliothèque pour un concept, si elle existe. */
  function kbDefinitionFor(concept) {
    const low = concept.toLowerCase().trim();
    for (const e of stmtLoadKb.all()) {
      const m = /^Définition\s*:\s*(.+)$/.exec(e.label || '');
      if (m && m[1].trim().toLowerCase() === low) return e.answer;
    }
    return null;
  }

  /**
   * GET /revision — propose un concept à réviser (ou { revision: null } si rien n'est dû).
   * Le "rappel" renvoyé vient de la bibliothèque si possible, sinon du souvenir stocké.
   */
  router.get('/revision', requireAuth('child'), (req, res) => {
    try {
      const due = stmtDueRevision.get(req.auth.id);
      if (!due) return res.json({ revision: null });

      const reminder = kbDefinitionFor(due.concept) || due.summary || null;
      res.json({
        revision: {
          concept:  due.concept,
          module:   due.module || null,
          daysAgo:  due.days_ago,
          reminder,
        },
      });
    } catch (e) {
      console.warn('[Milo] Révision indisponible :', e.message);
      res.json({ revision: null });
    }
  });

  /**
   * POST /revision/done — l'enfant a fait sa révision : on réactive le souvenir
   * (times_seen++ et last_seen = maintenant) pour ne pas le redemander tout de suite.
   */
  router.post('/revision/done', requireAuth('child'), (req, res) => {
    try {
      const concept = String(req.body.concept || '').trim();
      if (concept) {
        const existing = stmtGetMemory.get(req.auth.id, concept.toLowerCase());
        if (existing) stmtUpdateMemory.run(existing.id);
      }
      res.json({ ok: true });
    } catch (e) {
      res.json({ ok: false });
    }
  });

  return router;
};
