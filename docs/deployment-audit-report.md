# Rapport d'audit du moteur Milo

Date de l'audit : 15 juillet 2026
Perimetre : uniquement Milo dans l'application Next.js.

Ce rapport ne valide et ne modifie ni Napoleon, ni le compte IONOS, ni le DNS,
ni la messagerie, ni les identifiants de production, ni les zones hors sujet.

## Decision

Milo est valide sur l'environnement local et sur la CI de sa branche, et pret
pour une revue humaine dans la pull request 28. Le depot n'est pas declare
pret pour une livraison en production : le lint global echoue hors du
perimetre Milo, le controle de fusion de la PR echoue sur une divergence auth
de `main` et la cible de deploiement n'a pas ete validee dans cet audit.

## Etat Git

- Branche : `feat/milo-runtime-next`
- Arbre de travail : propre
- Base : `origin/main` a avance depuis la derniere synchronisation de la
  branche ; la simulation `git merge-tree` est propre, sans conflit Git.
- Etat local : propre et synchronise avec `origin/feat/milo-runtime-next` au
  moment de cet audit (`0` commit en avance et `0` en retard sur la branche
  distante ; `1` commit en retard et `36` commits en avance sur `origin/main`).
- Pull request : `https://github.com/blackminette/reseau-femme-et-citoyenne/pull/28`
- Etat de la pull request : ouverte, non brouillon, sans conflit Git detecte,
  mais non validable tant que le controle de fusion echoue.
- Controles GitHub : le workflow est vert sur le push de la branche
  (`29420685630`) ; le controle de fusion de la PR echoue sur deux imports
  auth hors Milo (`29420690839`).

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
| CI GitHub | Workflow `Validation Milo` sur le push et la PR 28 | Push de la branche reussi ; controle PR bloque par deux imports auth hors Milo |
| API sans session | `POST /api/ai-chat` sans session | Retourne 401 |
| Connexion enfant reelle | Navigateur sur `http://127.0.0.1:3021/login` | Authentification Supabase reussie ; profil enfant retrouve |
| Page assistant | Navigateur sur `http://127.0.0.1:3021/enfant/assistant` | Chargee correctement |
| Requete de discussion | Question pedagogique envoyee dans le widget | Reponse de secours affichee ; parcours utilisable |
| Historique invalide | Valeur `{` forcee dans `sessionStorage`, puis rechargement | Espace enfant et widget toujours utilisables |
| Console navigateur | Apres rechargement du parcours local | Aucune nouvelle erreur applicative ; un `404` historique concerne seulement `favicon.ico` |
| Secours et limitation de debit | Couverts par `tests/milo-runtime.test.ts` | Reussi avec des reponses fournisseur simulees |
| Cible de production | `curl.exe` vers `https://reseau-femme-et-citoyenne.fr` | Bloquee avant HTTP : `Could not resolve host`, statut `000` |
| Audit DNS IONOS en lecture seule | `node tools/ionos/ionos-hosting-readonly.js` (`GET /zones`) | Bloque par IONOS : `401 Unauthorized`; aucune zone ni aucun enregistrement n'a ete lu |
| Integration avec `origin/main` | `git merge-tree --write-tree HEAD origin/main`, CI `29420690839` | Simulation Git propre ; controle TypeScript de la PR bloque hors Milo car `main` expose d'autres noms d'actions auth |

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
- `npm audit --omit=dev` signale cinq vulnerabilites moderees liees a
  `@hono/node-server`, `@prisma/dev`, `prisma`, `next` et `postcss`.
- `npm audit fix --dry-run --omit=dev` confirme que la correction automatique
  forcerait notamment Prisma `6.19.3` et Next.js `9.3.3`. Elle n'a pas ete
  executee car ces versions seraient incompatibles avec la branche actuelle.

## Problemes restants

### Majeur : le lint global n'est pas vert

`npm run lint` remonte 272 erreurs et 120 avertissements dans le depot. Les
erreurs concernent notamment des fichiers hors Milo. Ils n'ont pas ete modifies
pendant cet audit ; l'equipe doit decider de les corriger separement ou de les
accepter explicitement comme dette d'integration preexistante.

### Majeur : migrations et schema ne sont pas totalement alignes

Dans la base PostgreSQL ephemere, `prisma migrate deploy` termine mais le build
revele ensuite des colonnes attendues par le schema courant qui manquent dans
les migrations historiques, par exemple `Utilisateur.avatar` et
`Atelier.trancheAge`. La CI applique donc ensuite `prisma db push` uniquement
sur cette base jetable pour tester le build. Cela ne modifie aucune base de
production, mais l'equipe backend doit traiter cette divergence avant une
installation sur une base vide.

### Majeur : divergence auth introduite par `main`

Apres `git fetch origin`, `origin/main` est sur `1877959` et a remplace les
exports `forgotPasswordAction` et `resetPasswordAction` par
`submitForgotRequestAction` et `submitResetRequestAction`. Les composants
d'authentification presents dans la branche Milo importent encore les anciens
noms. Le job CI `29419731439` echoue donc avec deux erreurs TypeScript sur ces
imports, avant toute erreur Milo. Cette correction appartient a l'equipe auth
ou a l'integration de `main` ; elle n'a pas ete appliquee dans la PR Milo.

### Modere : limitation de debit en memoire

La limite est propre a chaque processus Node.js. Un deploiement multi-instance
necessite un limiteur partage, par exemple une base ou un autre stockage central
valide par l'equipe.

### Modere : persistance des revisions volontairement absente

Les routes de revision authentifient l'enfant mais ne renvoient aucune revision
partagee tant qu'un modele de donnees et des regles d'acces n'ont pas ete valides.

### Porte de livraison ouverte

Aucun deploiement de production ni test de fumee apres deploiement n'a ete
valide. Le domaine configure dans `src/app/sitemap.ts`,
`https://reseau-femme-et-citoyenne.fr`, ne se resout pas en DNS depuis
l'environnement de test : `curl.exe` retourne `Could not resolve host` et le
statut `000`. L'audit IONOS en lecture seule retourne aussi `401 Unauthorized`
sur `GET /zones`; aucune zone n'a donc pu etre inspectee. La configuration
IONOS, le type de cle API, le DNS et le retour arriere doivent etre verifies par
le responsable du deploiement avec les acces de production. Aucune tentative
d'ecriture n'a ete effectuee.

## Retour arriere

Avant la fusion, conserver la derniere revision connue comme fonctionnelle de
`main`. Si Milo provoque une regression apres la fusion, revertir la plage de
commits de la PR Milo ou le commit de fusion, puis redeployer la revision
precedente. Ne pas utiliser de push force sur la branche partagee. Cette evolution
ne contient aucune migration de base.

## Recommandation

Ne pas fusionner silencieusement. La CI de la branche est validee, mais le
controle de fusion de la PR est en echec. Il reste la correction ou la
validation par l'equipe auth, la revue humaine, la decision sur le lint global
et la validation du responsable du deploiement avant fusion et livraison.
