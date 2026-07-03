'use strict';
const express = require('express');
const { requireAuth } = require('../session');
const { publicChild, contentItem } = require('../helpers');

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const MODULE_KEYS = ['lecture', 'numerique', 'robotique', 'anglais', 'civique', 'eco'];
const MODULE_LABELS = {
  lecture:   'Lecture & compréhension',
  numerique: 'Numérique',
  robotique: 'Robotique',
  anglais:   'Anglais',
  civique:   'Éducation civique',
  eco:       'Éco-citoyenneté',
};

// Tips pédagogiques par module
const MODULE_TIPS = {
  lecture:   'Pour la lecture : aide l\'enfant à identifier les mots-clés, le sujet de la phrase, l\'idée principale. Encourage la reformulation avec ses propres mots.',
  numerique: 'Pour le numérique : utilise des analogies du quotidien (IP = adresse postale, fichier = boîte, programme = recette de cuisine). Décompose les concepts abstraits.',
  robotique: 'Pour la robotique : décompose toujours le problème en petites étapes séquentielles. Utilise l\'analogie "donner des instructions précises à quelqu\'un qui ne réfléchit pas".',
  anglais:   'Pour l\'anglais : donne des indices sur la structure grammaticale en français, puis encourage l\'enfant à formuler en anglais. Valide l\'effort phonétique même approximatif.',
  civique:   'Pour l\'éducation civique : relie toujours les concepts abstraits à des situations concrètes (droits, devoirs, vie en société). Utilise des exemples de l\'école ou de la famille.',
  eco:       'Pour l\'éco-citoyenneté : part de gestes quotidiens simples (tri, transport, eau) pour expliquer les grands enjeux environnementaux. Valorise chaque petit geste.',
};

module.exports = function aiChatRoutes(db) {
  const router = express.Router();

  function loadAllModules() {
    const out = {};
    for (const key of MODULE_KEYS) {
      const rows = db.prepare(
        'SELECT * FROM contents WHERE module = ? ORDER BY is_custom, created_at'
      ).all(key);
      const mod = { quizzes: [], exercises: [], lessons: [] };
      for (const row of rows) {
        const item = contentItem(row);
        if (row.type === 'quizzes')   mod.quizzes.push(item);
        if (row.type === 'exercises') mod.exercises.push(item);
        if (row.type === 'lessons')   mod.lessons.push(item);
      }
      out[key] = mod;
    }
    return out;
  }

  function formatQuestions(questions) {
    if (!Array.isArray(questions)) return '';
    return questions.map((q, i) => {
      const choices = (q.c || []).map((c, ci) => {
        const letter = String.fromCharCode(65 + ci);
        const mark = ci === q.a ? ' [CORRECT]' : '';
        return `  ${letter}) ${c}${mark}`;
      }).join('\n');
      return `  Q${i + 1}: ${q.q}\n${choices}`;
    }).join('\n\n');
  }

  // Détecte un numéro de question dans le message de l'enfant (retourne entier 1-based ou null)
  function extractQuestionNumber(message) {
    const patterns = [
      /question\s*n[o°]?\s*(\d+)/i,
      /question\s+(\d+)/i,
      /exercice?\s+(\d+)/i,
      /q\s*(\d+)\b/i,
      /num[eé]ro\s+(\d+)/i,
      /n[o°]\s*(\d+)/i,
      /(\d+)(?:e|ème|eme|er|ère|re)\s+question/i,
    ];
    for (const re of patterns) {
      const m = message.match(re);
      if (m) return parseInt(m[1], 10);
    }
    const ordinals = { 'premi': 1, 'deuxi': 2, 'troisi': 3, 'quatri': 4, 'cinqui': 5, 'sixi': 6 };
    const low = message.toLowerCase();
    for (const [prefix, num] of Object.entries(ordinals)) {
      if (low.includes(prefix)) return num;
    }
    return null;
  }

  // Détecte la mention d'un module dans le message de l'enfant
  function detectModuleFromMessage(message) {
    const low = message.toLowerCase();
    const aliases = {
      lecture:   ['lecture', 'lire', 'texte', 'compréhension', 'comprehension'],
      numerique: ['numérique', 'numerique', 'informatique', 'ordinateur', 'internet'],
      robotique: ['robotique', 'robot', 'programme', 'séquence', 'sequence', 'algo'],
      anglais:   ['anglais', 'english', 'traduction'],
      civique:   ['civique', 'citoyenneté', 'citoyennete', 'droits', 'devoirs', 'société'],
      eco:       ['éco', 'eco', 'environnement', 'nature', 'planète', 'planete', 'recyclage'],
    };
    for (const [key, words] of Object.entries(aliases)) {
      if (words.some(w => low.includes(w))) return key;
    }
    return null;
  }

  // Trouve la question N : cherche d'abord dans l'activité courante (activityId), puis dans tout le module
  function findPinnedQuestion(modules, moduleKey, qNum, activityId) {
    if (!qNum) return null;

    // Priorité 1 : activité spécifique ouverte par l'enfant
    if (activityId) {
      const fa = findActivity(modules, activityId);
      if (fa) {
        const qs = fa.activity.questions || [];
        const q = qs[qNum - 1];
        if (q) {
          const correct = q.c && q.a !== undefined ? q.c[q.a] : null;
          return {
            activityTitle: fa.activity.title,
            localIndex: qNum,
            question: q.q,
            choices: (q.c || []).map((c, ci) => `${String.fromCharCode(65+ci)}) ${c}${ci===q.a?' [CORRECT]':''}`),
            correct,
          };
        }
      }
    }

    // Priorité 2 : module connu, comptage global
    if (!moduleKey) return null;
    const mod = modules[moduleKey];
    if (!mod) return null;
    let idx = 0;
    for (const activity of [...mod.quizzes, ...mod.exercises]) {
      for (let i = 0; i < (activity.questions || []).length; i++) {
        idx++;
        if (idx === qNum) {
          const q = activity.questions[i];
          const correct = q.c && q.a !== undefined ? q.c[q.a] : null;
          return {
            activityTitle: activity.title,
            localIndex: i + 1,
            question: q.q,
            choices: (q.c || []).map((c, ci) => `${String.fromCharCode(65+ci)}) ${c}${ci===q.a?' [CORRECT]':''}`),
            correct,
          };
        }
      }
    }
    return null;
  }

  // Formate les modules pour le prompt
  // Si focusModule connu → ce module en détail, les autres en résumé (1 ligne)
  // Si focusModule inconnu → tous les modules en détail (fallback sécurisé)
  function formatModulesForPrompt(modules, focusModule) {
    const lines = [];

    if (!focusModule) {
      // Fallback : tout envoyer pour que l'IA ne parte pas dans l'imagination
      lines.push('(Aucun module détecté — contenu complet de tous les modules ci-dessous)\n');
      for (const key of MODULE_KEYS) {
        const mod = modules[key];
        if (!mod) continue;
        lines.push(`\n### ${MODULE_LABELS[key]}`);
        if (mod.quizzes.length) {
          for (const quiz of mod.quizzes) {
            lines.push(`[Quiz "${quiz.title}"]`);
            lines.push(formatQuestions(quiz.questions));
            lines.push('');
          }
        }
        if (mod.exercises.length) {
          for (const ex of mod.exercises) {
            lines.push(`[Exercice "${ex.title}"]`);
            if (ex.text) lines.push(`  Texte : "${ex.text.slice(0, 300).replace(/\n/g, ' ')}"`);
            if (ex.questions) lines.push(formatQuestions(ex.questions));
            lines.push('');
          }
        }
      }
      return lines.join('\n');
    }

    // Module connu : détail complet pour ce module, résumé pour les autres
    for (const key of MODULE_KEYS) {
      const mod = modules[key];
      if (!mod) continue;

      if (key !== focusModule) {
        const nQ = mod.quizzes.reduce((s, q) => s + (q.questions?.length || 0), 0)
                 + mod.exercises.reduce((s, e) => s + (e.questions?.length || 0), 0);
        lines.push(`• ${MODULE_LABELS[key]} — ${nQ} question(s)`);
        continue;
      }

      lines.push(`\n### MODULE ACTUEL : ${MODULE_LABELS[key]}`);
      lines.push('(Questions + réponses correctes — utilise-les pour guider l\'enfant)\n');

      for (const quiz of mod.quizzes) {
        lines.push(`[Quiz "${quiz.title}" — id: ${quiz.id}]`);
        lines.push(formatQuestions(quiz.questions));
        lines.push('');
      }
      for (const ex of mod.exercises) {
        lines.push(`[Exercice "${ex.title}" — id: ${ex.id}]`);
        if (ex.text) lines.push(`  Texte : "${ex.text.slice(0, 500).replace(/\n/g, ' ')}"`);
        if (ex.questions) lines.push(formatQuestions(ex.questions));
        lines.push('');
      }
      if (mod.lessons.length) {
        lines.push('[Leçons :]');
        for (const lesson of mod.lessons) lines.push(`  • "${lesson.title}"`);
      }
    }
    return lines.join('\n');
  }

  function buildContext(req) {
    const child = publicChild(db, db.prepare('SELECT * FROM children WHERE id = ?').get(req.auth.id));
    const modules = loadAllModules();

    const scoresEnriched = (child.scores || []).map(s => {
      const mod = modules[s.module];
      let activityTitle = s.ref || 'activité inconnue';
      if (mod) {
        const found = [...mod.quizzes, ...mod.exercises].find(x => x.id === s.ref);
        if (found) activityTitle = found.title;
      }
      return { ...s, activityTitle };
    });

    const moduleStats = {};
    for (const s of scoresEnriched) {
      if (!moduleStats[s.module]) moduleStats[s.module] = { sum: 0, count: 0 };
      moduleStats[s.module].sum += (s.score / s.total) * 100;
      moduleStats[s.module].count++;
    }
    for (const key of Object.keys(moduleStats)) {
      moduleStats[key].avg = Math.round(moduleStats[key].sum / moduleStats[key].count);
    }

    return {
      enfant: { prenom: child.prenom, age: child.age },
      scores: scoresEnriched,
      moduleStats,
      badges: child.badges,
      modules,
    };
  }

  // Stade d'exploration selon l'historique (approche collaborative)
  function getExplorationStage(history, message) {
    // "Encore un indice" → on saute directement au stade 3 (indice ciblé)
    if (/encore un indice/i.test(message)) return 3;
    // "J'ai répondu X mais c'était faux" → stade 2 (on analyse l'erreur)
    if (/c['']était faux|c'est faux|mauvais|pas la bonne/i.test(message)) return 2;
    const aiTurns = history.filter(m => m.role === 'assistant').length;
    if (aiTurns === 0) return 1;
    if (aiTurns === 1) return 2;
    if (aiTurns <= 3) return 3;
    return 4;
  }

  // Détecte l'état émotionnel du message
  function detectEmotion(msg) {
    const m = msg.toLowerCase();
    if (/j'?ai trouv|c'?est [çca]a|j'?ai compris|jai compris|j'?y suis|c'?est bon/.test(m)) return 'success';
    if (/comprend(s)? (rien|pas)|nul(le)?|trop dur|c'?est dur|j'?arrive pas|impossible|abandonne|j'?en peux plus|sais pas quoi/.test(m)) return 'frustrated';
    if (/quoi[?!]|hein[?!]|\?\?\?|pas s[uû]r|comprend pas la question|c['']?est quoi/.test(m)) return 'confused';
    return 'neutral';
  }

  function detectNiveauGlobal(scores) {
    if (!scores.length) return { label: 'débutant', avg: null };
    const avg = Math.round(scores.reduce((s, e) => s + (e.score / e.total) * 100, 0) / scores.length);
    if (avg >= 85) return { label: 'expert', avg };
    if (avg >= 70) return { label: 'avancé', avg };
    if (avg >= 50) return { label: 'intermédiaire', avg };
    return { label: 'en difficulté', avg };
  }

  // Cherche une activité spécifique par ID dans tous les modules
  function findActivity(modules, activityId) {
    if (!activityId) return null;
    for (const key of MODULE_KEYS) {
      const mod = modules[key];
      if (!mod) continue;
      const found = [...mod.quizzes, ...mod.exercises].find(x => x.id === activityId);
      if (found) return { module: key, activity: found };
    }
    return null;
  }

  function systemPrompt(context, currentModule, activityId, history, message, currentQuestion) {
    const { enfant, scores, moduleStats, badges, modules } = context;
    const niveau = detectNiveauGlobal(scores);
    const stage  = getExplorationStage(history, message);
    const emotion = detectEmotion(message);

    const strongModules = Object.entries(moduleStats).filter(([, s]) => s.avg >= 70).map(([k]) => MODULE_LABELS[k]);
    const weakModules   = Object.entries(moduleStats).filter(([, s]) => s.avg < 50).map(([k]) => MODULE_LABELS[k]);

    // Détermine l'activité courante (via activityId de l'URL)
    const focusActivity = findActivity(modules, activityId);

    // Détermine le module actif : URL > activityId > message texte
    const resolvedModule = currentModule
      || (focusActivity ? focusActivity.module : null)
      || detectModuleFromMessage(message);

    const currentModuleLabel = resolvedModule ? MODULE_LABELS[resolvedModule] : null;
    const moduleTip = resolvedModule ? MODULE_TIPS[resolvedModule] || '' : '';

    let activityContext = '';
    if (focusActivity) {
      const qs = formatQuestions(focusActivity.activity.questions);
      activityContext = `\n📌 ACTIVITÉ EN COURS : "${focusActivity.activity.title}" (${MODULE_LABELS[focusActivity.module]})\n${qs ? 'Questions de cette activité :\n' + qs : ''}\n`;
    }

    // Détecte si l'enfant mentionne un numéro de question précis
    const mentionedQNum = extractQuestionNumber(message);
    const pinnedQ = mentionedQNum ? findPinnedQuestion(modules, resolvedModule, mentionedQNum, activityId) : null;

    // Bloc "question affichée à l'écran" — source de vérité absolue quand disponible
    let screenBlock = '';
    if (currentQuestion && currentQuestion.text && Array.isArray(currentQuestion.choices)) {
      const cq = currentQuestion;
      const choiceLines = cq.choices.map((c, i) => {
        const letter = String.fromCharCode(65 + i);
        const mark = i === cq.correctIndex ? ' ✅ [BONNE RÉPONSE]' : '';
        return `  ${letter}) ${c}${mark}`;
      }).join('\n');
      const correct = typeof cq.correctIndex === 'number' ? cq.choices[cq.correctIndex] : null;
      screenBlock = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️ QUESTION AFFICHÉE À L'ÉCRAN (question ${cq.displayNumber}/${cq.total || '?'})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"${cq.text}"
${choiceLines}
${correct ? `\n→ Bonne réponse : "${correct}"` : ''}

RÈGLE ABSOLUE : Cette question est ce que l'enfant voit EN CE MOMENT sur son écran.
Toutes tes réponses, indices et explications doivent porter sur CETTE question uniquement.
N'invente AUCUNE autre question. Ne parle pas d'autres exercices. Guide vers "${correct}".
`;
    }

    let pinnedBlock = '';
    if (!screenBlock && pinnedQ) {
      pinnedBlock = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ QUESTION CIBLÉE — L'ENFANT PARLE DE Q${mentionedQNum}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Activité : "${pinnedQ.activityTitle}"
"${pinnedQ.question}"
${pinnedQ.choices.join('\n')}
→ Bonne réponse : "${pinnedQ.correct || '?'}"

INSTRUCTION CRITIQUE : guide l'enfant vers cette réponse uniquement.
`;
    } else if (!screenBlock && mentionedQNum && !resolvedModule) {
      pinnedBlock = `\n⚠️ L'enfant mentionne Q${mentionedQNum} mais sans préciser le module. Demande-lui quel module.\n`;
    }

    const ageInstruction = (enfant.age || 10) <= 7
      ? 'STYLE : phrases ultra-courtes (max 8 mots), mots très simples, 1-2 emojis, beaucoup de chaleur et de rire.'
      : enfant.age <= 10
      ? 'STYLE : phrases courtes (max 20 mots), vocabulaire accessible, quelques emojis, ton complice et enjoué.'
      : 'STYLE : phrases claires, vocabulaire correct, emojis discrets (max 1), ton de pote curieux.';

    // Stades d'aide progressifs
    const explorationInstruction = [
      '', // index 0 unused
      `STADE 1 — Premier contact : demande ce que l'enfant a déjà compris ou tenté.
       "Tu peux me dire ce que t'as essayé ?" / "Qu'est-ce que tu as compris dans la question ?"
       → N'utilise PAS encore la réponse correcte. Écoute d'abord.`,

      `STADE 2 — Première piste : tu connais la bonne réponse, construis UNE analogie ou un rappel
       de règle qui oriente vers elle sans la révéler. Sois précis sur le concept en jeu.
       Ex : si la bonne réponse implique la notion de "programme séquentiel", rappelle ce qu'est
       une séquence d'instructions. Si c'est une règle de grammaire, rappelle la règle concernée.`,

      `STADE 3 — Indice ciblé : l'enfant bloque encore. Utilise ta connaissance de la réponse correcte
       pour donner un indice qui pointe directement vers l'élément clé manquant.
       "La piste c'est de regarder [élément précis qui mène à la bonne réponse]..."
       Formule comme une question rhétorique si possible : "Et si tu regardais [X], qu'est-ce que ça donne ?"`,

      `STADE 4 — Explication complète : l'enfant a besoin d'une aide totale. Explique la bonne réponse
       avec le raisonnement complet, étape par étape. Montre POURQUOI c'est la bonne réponse et pas
       les autres. Reste chaleureux : "Alors voilà comment on trouve — [raisonnement] — et donc la réponse c'est [réponse] !"`,
    ][Math.min(stage, 4)];

    const emotionInstruction = {
      success:    `L'enfant semble avoir trouvé ! Milo FÊTE sincèrement : "On l'a trouvé ! 🎉 C'est exactement ça !" puis explique le pourquoi avec enthousiasme. Si incomplet, valorise ce qu'il a trouvé et donne un petit indice pour finir.`,
      frustrated: `L'enfant montre de la frustration. Milo commence par de l'empathie COURTE ("Hey, c'est un truc dur — t'inquiète !") PUIS donne immédiatement un INDICE CONCRET pour débloquer la situation. Ne pas rester dans l'empathie trop longtemps — passer vite à l'aide.`,
      confused:   `L'enfant ne comprend pas la question elle-même. Milo reformule la question DIFFÉREMMENT avec ses propres mots, puis donne un exemple concret pour éclairer ce qui est demandé.`,
      neutral:    ``,
    }[emotion];

    return `Tu es MILO, l'assistant pédagogique intelligent d'AtelierKids.
Tu parles avec ${enfant.prenom}, ${enfant.age} ans.

${ageInstruction}
${screenBlock}${pinnedBlock}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUI EST MILO ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Milo est un ami bienveillant ET compétent. Il connaît parfaitement tout le contenu des modules
(les questions, les bonnes réponses, les raisonnements) et il s'en sert pour guider l'enfant.
Il ne donne pas la réponse directement — il guide vers elle de façon progressive et chaleureuse.

- Ton : complice, enthousiaste, jamais condescendant
- Il utilise le prénom de l'enfant naturellement
- Il célèbre chaque progrès sincèrement : "Ouais ! C'est exactement ça ! 🎉"
- Il ne répète jamais deux fois la même formule d'encouragement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROCESSUS DE RÉFLEXION (à appliquer à chaque message)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Avant de répondre, tu fais mentalement ces étapes :

1. IDENTIFIER — Sur quelle question/exercice porte le message de l'enfant ?
   Cherche dans le contenu ci-dessous la question exacte ou le sujet abordé.

2. CONNAÎTRE — Quelle est la bonne réponse [CORRECT] ? Quel est le raisonnement qui y mène ?
   Tu dois avoir cette réponse clairement en tête avant de répondre.

3. DIAGNOSTIQUER — Qu'est-ce que l'enfant semble croire ou ne pas comprendre ?
   Compare sa réponse/question avec la bonne réponse pour identifier le blocage précis.

4. ADAPTER — Selon le stade ci-dessous, construis une réponse qui guide vers la bonne réponse
   sans la donner directement (sauf stade 4).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÈGLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. RÉPONSES [CORRECT] : ne les lis jamais mot pour mot. Utilise-les pour construire
   tes indices et explications. Au stade 4, tu peux donner la réponse complète avec explication.
2. VÉRIFICATION : si l'enfant propose une réponse, compare-la à [CORRECT] et dis-lui
   clairement si c'est juste ou pas — avec bienveillance mais sans ambiguïté.
3. PÉRIMÈTRE : uniquement les modules AtelierKids. Hors-sujet → redirige gentiment.
4. FORMAT : **gras** pour les mots-clés. Listes si plusieurs points. Max 3 paragraphes courts.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STADE D'AIDE ACTUEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${explorationInstruction}
${emotionInstruction ? '\n🎭 SITUATION ÉMOTIONNELLE : ' + emotionInstruction : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFIL DE ${enfant.prenom.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Âge : ${enfant.age} ans | Niveau : ${niveau.label}${niveau.avg !== null ? ` (${niveau.avg}% de moyenne)` : ''}
Badges : ${badges.length ? badges.join(', ') : 'aucun encore'}
${currentModuleLabel ? `Module actuel : ${currentModuleLabel}` : ''}
${activityContext}
Points forts : ${strongModules.length ? strongModules.join(', ') : 'pas encore de données'}
Difficultés : ${weakModules.length ? weakModules.join(', ') : 'aucune identifiée'}

Historique récent :
${scores.length
  ? scores.slice().reverse().slice(0, 8)
      .map(s => `• ${MODULE_LABELS[s.module] || s.module} — "${s.activityTitle}" : ${s.score}/${s.total} (${Math.round(s.score/s.total*100)}%)`)
      .join('\n')
  : '  Aucune activité encore.'}

${moduleTip ? `\nAPPROCHE POUR CE MODULE :\n${moduleTip}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENU DES MODULES
(Le module actuel est en détail. Les autres : résumé court pour éviter la confusion.)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatModulesForPrompt(modules, resolvedModule)}
`;
  }

  router.post('/', requireAuth('child'), async (req, res) => {
    const message       = String(req.body.message || '').trim();
    const history       = Array.isArray(req.body.history) ? req.body.history : [];
    const currentModule = MODULE_KEYS.includes(req.body.currentModule) ? req.body.currentModule : null;
    const activityId    = typeof req.body.activityId === 'string' ? req.body.activityId.slice(0, 80) : null;
    const currentQuestion = (req.body.currentQuestion && typeof req.body.currentQuestion === 'object')
      ? req.body.currentQuestion : null;

    if (!message) return res.status(400).json({ error: 'Message vide.' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Assistant IA non configuré.' });

    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const client  = new GoogleGenerativeAI(apiKey);
      const context = buildContext(req);

      const model = client.getGenerativeModel({
        model: MODEL,
        systemInstruction: systemPrompt(context, currentModule, activityId, history, message, currentQuestion),
        generationConfig: {
          temperature: 0.65,
          topP: 0.92,
          maxOutputTokens: 900,
        },
      });

      const previous = history
        .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-14)
        .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

      const chat = model.startChat({ history: previous });
      const result = await chat.sendMessage(message);
      const reply  = result.response.text().trim();

      res.json({ reply: reply || "Désolé, je n'ai pas pu générer de réponse." });
    } catch (err) {
      console.error('Erreur assistant IA :', err);
      const msg = err.message || '';
      if (msg.includes('quota') || msg.includes('429')) {
        return res.status(429).json({ error: "Je suis un peu débordé ! Réessaie dans quelques secondes 😊" });
      }
      res.status(502).json({ error: "L'assistant IA est momentanément indisponible." });
    }
  });

  return router;
};
