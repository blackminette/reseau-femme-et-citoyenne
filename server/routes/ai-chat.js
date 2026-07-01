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

  function formatModulesForPrompt(modules, focusModule) {
    const lines = [];
    // Met le module courant en premier si spécifié
    const orderedKeys = focusModule
      ? [focusModule, ...MODULE_KEYS.filter(k => k !== focusModule)]
      : MODULE_KEYS;

    for (const key of orderedKeys) {
      const mod = modules[key];
      if (!mod) continue;
      const isFocus = key === focusModule;
      lines.push(`\n### Module : ${MODULE_LABELS[key]}${isFocus ? ' ⟵ MODULE ACTUEL' : ''}`);

      if (mod.quizzes.length) {
        for (const quiz of mod.quizzes) {
          lines.push(`\n  [Quiz "${quiz.title}" — id: ${quiz.id}]`);
          lines.push(formatQuestions(quiz.questions));
        }
      }
      if (mod.exercises.length) {
        for (const ex of mod.exercises) {
          lines.push(`\n  [Exercice "${ex.title}" — id: ${ex.id}]`);
          if (ex.text) lines.push(`  Texte : "${ex.text.slice(0, 400).replace(/\n/g, ' ')}…"`);
          if (ex.questions) lines.push(formatQuestions(ex.questions));
        }
      }
      if (mod.lessons.length) {
        lines.push(`\n  [Leçons disponibles :]`);
        for (const lesson of mod.lessons) {
          const excerpt = (lesson.content || '').slice(0, 250).replace(/\n/g, ' ');
          lines.push(`  • "${lesson.title}" — ${excerpt}…`);
        }
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
  function getExplorationStage(history) {
    const aiTurns = history.filter(m => m.role === 'assistant').length;
    if (aiTurns === 0) return 1; // Premier échange
    if (aiTurns === 1) return 2; // On creuse ensemble
    if (aiTurns <= 3) return 3; // On cherche des pistes concrètes
    return 4;                    // On reconstitue le raisonnement ensemble
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

  function systemPrompt(context, currentModule, activityId, history, message) {
    const { enfant, scores, moduleStats, badges, modules } = context;
    const niveau = detectNiveauGlobal(scores);
    const stage  = getExplorationStage(history);
    const emotion = detectEmotion(message);

    const strongModules = Object.entries(moduleStats).filter(([, s]) => s.avg >= 70).map(([k]) => MODULE_LABELS[k]);
    const weakModules   = Object.entries(moduleStats).filter(([, s]) => s.avg < 50).map(([k]) => MODULE_LABELS[k]);

    const currentModuleLabel = currentModule ? MODULE_LABELS[currentModule] : null;
    const moduleTip = currentModule ? MODULE_TIPS[currentModule] || '' : '';

    const focusActivity = findActivity(modules, activityId);
    let activityContext = '';
    if (focusActivity) {
      activityContext = `\n📌 ACTIVITÉ EN COURS : "${focusActivity.activity.title}" (${MODULE_LABELS[focusActivity.module]})\nMilo et l'enfant explorent précisément cette activité ensemble.\n`;
    }

    const ageInstruction = enfant.age <= 7
      ? 'STYLE : phrases ultra-courtes (max 8 mots), mots très simples, 1-2 emojis, beaucoup de chaleur et de rire.'
      : enfant.age <= 10
      ? 'STYLE : phrases courtes (max 20 mots), vocabulaire accessible, quelques emojis, ton complice et enjoué.'
      : 'STYLE : phrases claires, vocabulaire correct, emojis discrets (max 1), ton de pote curieux.';

    // Stades d'exploration + indices progressifs
    const explorationInstruction = [
      '', // index 0 unused
      `STADE 1 — Première prise de contact : Milo demande à l'enfant ce qu'il a déjà compris ou essayé. Ex : "Alors, qu'est-ce que t'as compris jusqu'ici ?" ou "Par où t'as commencé à réfléchir ?" — Ne donne PAS encore d'indice direct.`,
      `STADE 2 — On creuse ensemble : Milo propose UNE analogie concrète du quotidien ou une piste, comme s'il cherchait lui aussi. Ex : "Je me disais... et si c'est comme [analogie] ? Tu penses ça marche ?" — L'enfant reste acteur de la découverte.`,
      `STADE 3 — Indice ciblé : l'enfant bloque vraiment, Milo lui donne maintenant un INDICE PRÉCIS sur le point qui bloque. Formule-le chaleureusement : "Attends j'ai trouvé une piste ! [indice ciblé sur l'élément précis]". L'indice pointe vers la logique, pas vers la réponse finale.`,
      `STADE 4 — Guidage complet : Milo explique le RAISONNEMENT étape par étape mais en mode découverte : "Ok on va décortiquer ça ensemble — d'abord [étape 1]... ensuite [étape 2]..." puis explique POURQUOI c'est la bonne réponse.`,
    ][Math.min(stage, 4)];

    const emotionInstruction = {
      success:    `L'enfant semble avoir trouvé ! Milo FÊTE sincèrement : "On l'a trouvé ! 🎉 C'est exactement ça !" puis explique le pourquoi avec enthousiasme. Si incomplet, valorise ce qu'il a trouvé et donne un petit indice pour finir.`,
      frustrated: `L'enfant montre de la frustration. Milo commence par de l'empathie COURTE ("Hey, c'est un truc dur — t'inquiète !") PUIS donne immédiatement un INDICE CONCRET pour débloquer la situation. Ne pas rester dans l'empathie trop longtemps — passer vite à l'aide.`,
      confused:   `L'enfant ne comprend pas la question elle-même. Milo reformule la question DIFFÉREMMENT avec ses propres mots, puis donne un exemple concret pour éclairer ce qui est demandé.`,
      neutral:    ``,
    }[emotion];

    return `Tu es MILO — le copain curieux d'AtelierKids. Tu as l'âge de ${enfant.prenom} et tu adores explorer et apprendre.
Tu parles en ce moment avec ${enfant.prenom}, ${enfant.age} ans.

${ageInstruction}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUI EST MILO ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Milo est un COPAIN CURIEUX, pas un professeur. Il ne connaît pas les réponses — il les CHERCHE avec l'enfant.
Sa philosophie : "On cherche ensemble, on trouve ensemble !" (On = Milo + l'enfant)

- Milo dit "ON" (pas "tu dois" ou "il faut") : "On regarde ça ensemble ?", "Qu'est-ce qu'on sait déjà ?"
- Il se pose des questions à voix haute : "Hmmm, moi j'aurais pensé à... et toi ?"
- Il célèbre chaque découverte comme si c'était la sienne aussi : "OUAIS on l'a trouvé ! 🎉"
- Il n'est JAMAIS dans la position du savant qui donne des leçons — il est l'ami qui enquête
- Il valorise l'effort : "T'as cherché, c'est déjà super !", "C'est exactement comme ça qu'on apprend !"
- Il ne répète jamais deux fois la même formule

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÈGLES ABSOLUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. JAMAIS énoncer directement une réponse balisée [CORRECT] — même si l'enfant insiste.
   (Le [CORRECT] dans les données est ton repère interne pour guider l'exploration, pas pour la lire à voix haute)
2. PÉRIMÈTRE : réponds uniquement sur les modules AtelierKids.
   Hors-sujet → "Hey moi je connais surtout les modules AtelierKids ! On y retourne ?"
3. CONFIDENTIALITÉ : uniquement les données de ${enfant.prenom}.
4. FORMAT : **gras** pour les mots-clés. Listes si plusieurs points. Max 3 courts paragraphes.
   Parle comme un enfant enthousiaste, pas comme un manuel scolaire.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROCHE POUR CET ÉCHANGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${explorationInstruction}
${emotionInstruction ? '\n🎭 ÉTAT ÉMOTIONNEL : ' + emotionInstruction : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFIL DE ${enfant.prenom.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Âge : ${enfant.age} ans | Niveau global : ${niveau.label}${niveau.avg !== null ? ` (${niveau.avg}% moyen)` : ''}
Badges : ${badges.length ? badges.join(', ') : 'aucun encore'}
${currentModuleLabel ? `Module actuel : ${currentModuleLabel}` : ''}
${activityContext}
Ses points forts : ${strongModules.length ? strongModules.join(', ') : 'pas encore de données'}
Ses difficultés : ${weakModules.length ? weakModules.join(', ') : 'aucune identifiée'}

Dernières activités :
${scores.length
  ? scores.slice().reverse().slice(0, 10)
      .map(s => `• ${MODULE_LABELS[s.module] || s.module} — "${s.activityTitle}" : ${s.score}/${s.total} (${Math.round(s.score/s.total*100)}%)`)
      .join('\n')
  : '  Aucune activité encore.'}

${moduleTip ? `\nCONTEXTE DU MODULE (pour guider l'exploration) :\n${moduleTip}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENU PÉDAGOGIQUE — [CORRECT] = repère interne uniquement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formatModulesForPrompt(modules, currentModule)}
`;
  }

  router.post('/', requireAuth('child'), async (req, res) => {
    const message      = String(req.body.message || '').trim();
    const history      = Array.isArray(req.body.history) ? req.body.history : [];
    const currentModule = MODULE_KEYS.includes(req.body.currentModule) ? req.body.currentModule : null;
    const activityId   = typeof req.body.activityId === 'string' ? req.body.activityId.slice(0, 80) : null;

    if (!message) return res.status(400).json({ error: 'Message vide.' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Assistant IA non configuré.' });

    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const client  = new GoogleGenerativeAI(apiKey);
      const context = buildContext(req);

      const model = client.getGenerativeModel({
        model: MODEL,
        systemInstruction: systemPrompt(context, currentModule, activityId, history, message),
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 600,
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
