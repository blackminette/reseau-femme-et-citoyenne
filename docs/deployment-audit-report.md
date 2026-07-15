# Rapport d'audit du moteur Milo

Date de l'audit : 15 juillet 2026
Perimetre : uniquement Milo dans l'application Next.js.

Ce rapport ne valide et ne modifie ni Napoleon, ni le compte IONOS, ni le DNS,
ni la messagerie, ni les identifiants de production, ni les zones hors sujet.

## Decision

Milo est valide sur l'environnement local connecte et sur la CI de sa branche,
et pret pour une revue humaine dans la pull request 28. Le depot n'est pas
declare pret pour une livraison en production : le lint global echoue hors du
perimetre Milo et la cible de deploiement n'a pas ete validee dans cet audit.

## Etat Git

- Branche : `feat/milo-runtime-next`
- Arbre de travail : propre
- Base : au controle du 15 juillet 2026, la branche ne comporte aucun commit en
  retard sur `origin/main`; elle contient ses propres commits Milo en attente
  de fusion. La pull request est propre, sans conflit Git.
- Etat local : propre et synchronise avec `origin/feat/milo-runtime-next` au
  moment de cet audit (`0` commit en avance et `0` en retard sur la branche
  distante).
- Pull request : `https://github.com/blackminette/reseau-femme-et-citoyenne/pull/28`
- Etat de la pull request : ouverte, non brouillon, `MERGEABLE`, avec un etat
  de fusion `CLEAN`.
- Controles GitHub : le workflow `Validation Milo` est vert sur le push de la
  branche et sur la PR 28.

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
| Build de production | `npm run build` avec les variables locales chargees uniquement en memoire | Reussi localement : compilation, typage et generation de 55/55 pages |
| CI GitHub | Workflow `Validation Milo` sur le commit `0f6c440` | Deux jobs verts : `https://github.com/blackminette/reseau-femme-et-citoyenne/actions/runs/29436790003` et `https://github.com/blackminette/reseau-femme-et-citoyenne/actions/runs/29436794525` |
| API sans session | `POST /api/ai-chat` sans session | Retourne 401 |
| Page de connexion locale | Navigateur sur `http://127.0.0.1:3010/login` avec variables de test | Chargee ; formulaire present ; aucune erreur console |
| Route assistant sans session | Navigateur sur `http://127.0.0.1:3010/assistant.html` | Redirection vers `/login` apres la redirection intermediaire `/enfant/assistant` |
| Origine web etrangere | `POST /api/ai-chat` avec une origine externe | Retourne 403 |
| API sans session | `POST /api/ai-chat` avec une origine locale | Retourne 401 |
| Connexion enfant reelle | Compte enfant Supabase dans le navigateur local | Reussie ; acces a `/enfant` et bouton Milo visibles |
| Requete de discussion | Question pedagogique envoyee avec une session enfant reelle | Reussie ; `POST /api/ai-chat` retourne `200` et la reponse est affichee |
| Secours Gemini reel | Cle Gemini invalide uniquement dans un processus Next.js de test | Reussie ; Gemini retourne `400`, Milo affiche le secours et le champ reste utilisable |
| Historique vide et invalide | `sessionStorage` vide, puis valeur `{invalid-json`, rechargement navigateur | Reussi ; widget charge et reste utilisable, sans historique corrompu |
| Console navigateur | Parcours Milo local et navigateur de developpement | Aucune erreur Milo observee; un `favicon.ico` absent est sans impact sur Milo |
| Secours et limitation de debit | Couverts par `tests/milo-runtime.test.ts` | Reussi pour erreurs fournisseur simulees et retour `429` apres le seuil |
| Cible de production | `curl.exe` vers `https://reseau-femme-et-citoyenne.fr` | Bloquee avant HTTP : `Could not resolve host`, statut `000` |
| Audit DNS IONOS en lecture seule | `node tools/ionos/ionos-hosting-readonly.js` (`GET /zones`) | Bloque par IONOS : `401 Unauthorized`; aucune zone ni aucun enregistrement n'a ete lu |
| Integration avec `origin/main` | Fusion locale puis controle CI de la PR | Conflits auth resolus ; CI push et PR vertes |

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

`npm run lint` remonte 287 erreurs et 120 avertissements dans le depot. Les
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

La CI de la branche et de la PR est validee. Il reste la revue humaine, la
decision de l'equipe sur le lint global, la disponibilite des variables reelles
et la validation du responsable du deploiement avant livraison.
