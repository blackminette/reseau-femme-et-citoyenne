# IONOS / Codex - Questions et réponses

Contexte de ce document :
- périmètre actuel : **chatbot Milo uniquement** ;
- pas de déploiement ;
- pas d’accès IONOS complet ;
- pas de modification DNS ;
- pas de lecture de `.env` réel ;
- les réponses ci-dessous sont limitées à ce qui est **vérifiable maintenant**.

## Réponses directes aux 20 questions prioritaires

1. **Codex est-il utilisé en Web, CLI, IDE ou autre ?**  
   Réponse : **Codex desktop avec accès shell local et outils de vérification**.

2. **Codex a-t-il accès au repo GitHub complet ?**  
   Réponse : **Oui, au dépôt ouvert dans le workspace local**.

3. **Codex peut-il exécuter des commandes shell ?**  
   Réponse : **Oui**.

4. **Codex peut-il utiliser Internet / réseau ?**  
   Réponse : **Oui, via les outils de navigation et de recherche disponibles**.

5. **Codex peut-il utiliser MCP ?**  
   Réponse : **Oui si un serveur MCP est configuré, mais ce n’est pas nécessaire pour l’audit actuel**.

6. **Quel est le nom exact du produit IONOS dans “Hébergement” ?**  
   Réponse : **Non vérifié à ce stade**.

7. **Est-ce un VPS / Cloud Server / hébergement web / domaine seul / builder ?**  
   Réponse : **Non vérifié à ce stade**.

8. **Y a-t-il SSH ?**  
   Réponse : **Non confirmé**.

9. **Y a-t-il SFTP ?**  
   Réponse : **Non confirmé**.

10. **Node.js est-il supporté ?**  
    Réponse : **Non confirmé**.

11. **Peut-on lancer un processus permanent ?**  
    Réponse : **Non confirmé**.

12. **Peut-on définir des variables d’environnement ?**  
    Réponse : **Non confirmé**.

13. **Quel domaine ou sous-domaine doit pointer vers AtelierKids ?**  
    Réponse : **Non décidé / non vérifié**.

14. **Les emails du domaine sont-ils utilisés ?**  
    Réponse : **Non vérifié**.

15. **Le backend Milo doit-il être déployé ou seulement le frontend ?**  
    Réponse : **Pour le chatbot Milo, il faut au minimum le backend IA + le widget/assistant**.

16. **La base SQLite doit-elle être utilisée en production ?**  
   Réponse : **Non. Le runtime Next de Milo ne depend pas de SQLite ; la memoire longue doit etre definie avec un modele partage et valide.**

17. **Qui valide les changements DNS ?**  
    Réponse : **Un humain responsable uniquement**.

18. **Veux-tu que Codex lise seulement IONOS ou qu’il modifie aussi ?**  
    Réponse : **Lecture d’abord ; modification seulement avec périmètre limité et validation humaine**.

19. **As-tu accès à un token API IONOS ou seulement au dashboard ?**  
    Réponse : **Dashboard confirmé ; token API non confirmé**.

20. **Johanna autorise-t-elle explicitement un accès technique limité, ou seulement ton accès humain au dashboard ?**  
    Réponse : **Non confirmé**.

## Réponses d’orientation par grand thème

### 1. Objectif exact
Pour le chatbot Milo uniquement :
- l’objectif vérifié est de **préparer un audit de déploiement** ;
- aucun déploiement n’a été lancé ;
- aucun accès IONOS complet n’a été demandé ;
- aucune DNS n’a été modifiée.

### 2. Produit IONOS exact
État actuel :
- le compte IONOS existe et l’interface est accessible ;
- le type exact du produit d’hébergement n’a pas été prouvé ;
- il faut ouvrir la rubrique **Hébergement** pour identifier l’offre réelle.

### 3. Accès technique souhaité
Position retenue :
- accès complet au compte IONOS : **non** ;
- accès limité pour lecture / déploiement technique : **à définir** ;
- priorité au **moindre privilège**.

### 4. Backend Milo
État vérifié :
- `src/app/api/ai-chat/route.ts` expose `POST /api/ai-chat` dans Next.js ;
- `GEMINI_API_KEY` et `GEMINI_MODEL` sont lus uniquement cote serveur ;
- la session Supabase et le role Prisma `ENFANT` sont verifies ;
- la bibliotheque locale est interrogee avant Gemini ;
- le backend gere les erreurs, le quota et l'absence de cle avec une reponse de secours.

### 5. Front assistant
État vérifié :
- `public/ai-widget.js` existe ;
- `public/assistant.html` existe ;
- le widget appelle `/api/ai-chat` ;
- le mode autonome et le mode flottant sont présents ;
- l’historique est protégé contre un JSON invalide.

### 6. Documentation Milo
État vérifié :
- `docs/ia-milo.md` existe ;
- il decrit le runtime Next, le widget, les garde-fous et les limites de memoire.

### 7. Module Napoléon
État vérifié dans cette copie du workspace :
- aucun code source Napoléon n’a été trouvé dans les dossiers disponibles ;
- le module Napoléon ne peut donc pas être audité ici sur la base de code réelle ;
- il faut le bon dépôt ou le bon chemin local pour faire cet audit.

## Ce qui est certain aujourd’hui
- Milo backend : route Next presente et compilee, avec authentification enfant et fallback.
- Assistant front : present, charge dans l'espace enfant et accessible via `assistant.html`.
- Déploiement : non fait.
- IONOS exact : non identifié.
- Napoléon source : absente dans cette copie du workspace.

## Ce qu’il faut vérifier ensuite
1. le produit IONOS exact dans `Hébergement` ;
2. le support SSH / SFTP / Node.js ;
3. le besoin réel : chatbot seul ou site complet ;
4. le bon dépôt contenant réellement le module Napoléon ;
5. la stratégie de déploiement minimale pour Milo.
