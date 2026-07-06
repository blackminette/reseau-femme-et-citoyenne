# Milo / assistant IA

Ce document résume le fonctionnement actuel de l'assistant IA de l'espace enfant.

## Vue d'ensemble

- `public/ai-widget.js` charge le widget Milo sur les pages enfants.
- `public/assistant.html` ouvre Milo en mode plein écran.
- `server/routes/ai-chat.js` reçoit les messages de l'enfant et interroge Gemini.
- `server/ai-chat-utils.js` normalise les données lues côté serveur.

## Comportement important

- Le widget peut fonctionner en mode flottant ou en mode autonome.
- L'historique est stocké dans `sessionStorage` avec une lecture protégée contre le JSON invalide.
- Si les données du stockage local sont corrompues, l'assistant repart avec un historique vide.
- La route serveur reconstruit le contexte de l'enfant à partir des scores, badges et contenus du module actif.

## Points de vigilance

- Ne pas remettre de dépendance implicite vers des helpers absents.
- Ne pas stocker de données sensibles dans le front.
- Garder les messages courts, clairs et adaptés à un enfant.
- Vérifier le comportement après recharge de page et avec un `sessionStorage` vide ou invalide.

## Vérifications utiles

- charger l'espace enfant ;
- ouvrir Milo en mode flottant ;
- ouvrir Milo via `assistant.html` ;
- envoyer une bonne réponse ;
- envoyer une mauvaise réponse ;
- recharger la page ;
- vider `sessionStorage` ;
- injecter un JSON invalide dans `sessionStorage`.
