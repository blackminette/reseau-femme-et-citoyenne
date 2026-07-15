# Rapport d'audit du moteur Milo

Date de l'audit : 15 juillet 2026
Perimetre : uniquement Milo dans l'application Next.js.

Ce rapport ne valide et ne modifie ni Napoleon, ni le compte IONOS, ni le DNS,
ni la messagerie, ni les identifiants de production, ni les zones hors sujet.

## Decision

Milo est valide sur l'environnement local et pret pour une revue humaine dans la
pull request 28. Le depot n'est pas declare pret pour une livraison en
production : aucune verification CI n'est remontee, le lint global echoue hors
du perimetre Milo et la cible de deploiement n'a pas ete validee dans cet audit.

## Etat Git

- Branche : `feat/milo-runtime-next`
- Arbre de travail : propre
- Base : `origin/main` est un ancetre de la branche.
- Etat local : un commit d'avance sur `origin/feat/milo-runtime-next`.
- Pull request : `https://github.com/blackminette/reseau-femme-et-citoyenne/pull/28`
- Etat de la pull request : ouverte, non brouillon, fusionnable, sans conflit.
- Controles GitHub : aucun n'est remonte ; cela ne signifie pas que la CI est verte.

## Implementation verifiee

- `src/app/api/ai-chat/route.ts` est le point d'entree serveur Next.js actif.
- Milo exige une session Supabase et un profil Prisma de role `ENFANT`.
- Un fournisseur d'identite indisponible renvoie une erreur au lieu de selectionner
  un autre compte enfant.
- Le corps de la requete est limite a 16 Ko pendant la lecture du flux reel.
- L'origine de la requete est verifiee avant l'authentification et l'appel Gemini
  lorsqu'un en-tete `Origin` est present.
- Le parcours et le contexte de l'activite publies sont resolus depuis la base.
- Le contexte du cours ou de l'exercice conserve les reperes pedagogiques et la
  formulation de la question, mais exclut les choix et `reponseCorrecte`.
- Le widget navigateur envoie seulement le texte de la question, jamais les choix
  ni l'index de la bonne reponse.
- La bibliotheque locale est consultee avant Gemini.
- Une configuration Gemini absente, un quota atteint, un delai depasse ou une
  panne du fournisseur utilisent une reponse pedagogique de secours.
- `GEMINI_API_KEY` est lue uniquement cote serveur.
- L'historique de session est filtre et stocke dans `sessionStorage` ; un JSON
  invalide est ignore sans faire planter le widget.
- Les objets d'erreur bruts Supabase, base et contexte ne sont plus ecrits par
  les utilitaires Milo. La correction est dans le commit `2ced584`.

## Preuves de validation

| Verification | Commande ou scenario | Resultat |
| --- | --- | --- |
| Dependances | `npm ci` | Reussi ; installation depuis le fichier de verrouillage terminee |
| Client Prisma | `npx prisma generate` avec l'environnement local charge uniquement en memoire | Reussi |
| Tests unitaires/runtime Milo | `npx tsx tests/milo-runtime.test.ts` | Reussi |
| Lint Milo | `npx eslint src/lib/milo` | Reussi |
| TypeScript | `npx tsc --noEmit --pretty false` | Reussi |
| Proprete du diff | `git diff --check` | Reussi |
| Build de production | `npm run build` avec l'environnement local charge uniquement en memoire | Reussi ; 55/55 pages statiques generees |
| API sans session | `POST /api/ai-chat` sans session | Retourne 401 |
| Connexion enfant reelle | Navigateur sur `http://localhost:3017/login` | Authentification Supabase reussie ; profil enfant retrouve |
| Page assistant | Navigateur sur `http://localhost:3017/enfant/assistant` | Chargee correctement |
| Requete de discussion | Message navigateur `Bonjour Milo` | `POST /api/ai-chat 200` ; reponse affichee |
| Console navigateur | Apres le parcours local reussi | Aucune erreur remontee |
| Secours et limitation de debit | Couverts par `tests/milo-runtime.test.ts` | Reussi avec des reponses fournisseur simulees |

## Revue de securite

- Aucun fichier `.env` n'est suivi par Git.
- Aucune cle API, aucun jeton, fichier de base ou journal local n'est suivi par
  la branche Milo.
- La cle Gemini privee n'est pas exposee par une variable `NEXT_PUBLIC_*`.
- L'autorisation serveur est verifiee independamment de l'interface cliente.
- La taille, l'origine, la session et le role enfant sont controles cote serveur.
- Les reponses d'erreur sont generiques ; le statut du fournisseur n'est pas
  renvoye au navigateur.
- Le widget echappe le texte de l'assistant avant d'afficher son sous-ensemble
  Markdown limite.
- `npm audit --omit=dev` signale cinq vulnerabilites moderees. La correction forcee
  proposerait une mise a jour majeure de Next.js ou Prisma et n'a pas ete executee.

## Problemes restants

### Majeur : aucun resultat CI remonte

Aucun workflow n'est present dans `.github/workflows` et la PR 28 ne remonte
aucun controle. Un responsable doit valider la branche ou l'equipe doit fournir
un travail CI avant de declarer la porte de livraison verte.

### Majeur : le lint global n'est pas vert

`npm run lint` remonte 272 erreurs et 120 avertissements dans le depot. Les
erreurs concernent notamment des fichiers hors Milo. Ils n'ont pas ete modifies
pendant cet audit ; l'equipe doit decider de les corriger separement ou de les
accepter explicitement comme dette d'integration preexistante.

### Modere : limitation de debit en memoire

La limite est propre a chaque processus Node.js. Un deploiement multi-instance
necessite un limiteur partage, par exemple une base ou un autre stockage central
valide par l'equipe.

### Modere : persistance des revisions volontairement absente

Les routes de revision authentifient l'enfant mais ne renvoient aucune revision
partagee tant qu'un modele de donnees et des regles d'acces n'ont pas ete valides.

### Porte de livraison ouverte

Aucun deploiement de production, configuration IONOS, test de fumee apres
deploiement ou repetition de retour arriere n'a ete realise. Ces actions exigent
le responsable du deploiement et les identifiants de production de l'equipe.

## Retour arriere

Avant la fusion, conserver la derniere revision connue comme fonctionnelle de
`main`. Si Milo provoque une regression apres la fusion, revertir la plage de
commits de la PR Milo ou le commit de fusion, puis redeployer la revision
precedente. Ne pas utiliser de push force sur la branche partagee. Cette evolution
ne contient aucune migration de base.

## Recommandation

Ne pas fusionner silencieusement. Envoyer la PR 28 en revue humaine avec ce
rapport, faire valider la CI et le responsable du deploiement, puis seulement
pousser le commit local en attente et fusionner selon le processus convenu.
