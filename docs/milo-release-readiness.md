# Etat de prelivraison Milo

Ce document consigne les controles effectues avant la livraison. Il distingue
les preuves concernant Milo des blocages qui appartiennent au projet partage.
Il ne remplace pas le smoke test de production dans
`docs/milo-production-smoke-test.md`.

## Perimetre verifie

- Integration : PR 28 fusionnee dans `main` via le commit `08b5b19`
- Pull request : https://github.com/blackminette/reseau-femme-et-citoyenne/pull/28
- Correctif de chargement du widget : `d49f368 fix(milo): charger le widget dans l'espace enfant`
- Correctif de controle d'origine : `3dac33c fix(milo): securiser la verification d'origine`
- Aucun fichier d'environnement ou secret n'est suivi par Git.
- L origine publique de production doit etre renseignee cote serveur dans
  `MILO_TRUSTED_ORIGIN` avant la mise en ligne.

## Resultats confirmes localement

| Controle | Commande ou parcours | Resultat |
| --- | --- | --- |
| Tests Milo | `npx tsx tests/milo-runtime.test.ts` | OK |
| Typage | `npx tsc --noEmit --pretty false` | OK |
| Schema Prisma | `npx prisma validate` avec les variables locales en memoire | OK |
| Client Prisma | `npx prisma generate` avec les variables locales en memoire | OK |
| Build production | `npx next build` avec les variables locales en memoire | OK |
| Lint cible Milo | `npx eslint src/lib/milo src/app/api/ai-chat src/components/MiloWidgetLoader.tsx src/app/(dashboard-enfant)/layout.tsx public/ai-widget.js` | OK |
| Diff Git | `git diff --check` | OK |

Le test navigateur avec un compte enfant a confirme que le bouton Milo se
charge dans l'espace enfant, qu'un message peut etre envoye et qu'une reponse
pedagogique de secours s'affiche lorsque Gemini est indisponible. Aucune erreur
console n'a ete observee pendant ce parcours.

Les controles HTTP sans session ont donne les statuts attendus :

- `POST /api/ai-chat` : `401` ;
- la meme route avec une origine etrangere : `403` ;
- `GET /api/ai-chat/revision` : `401` ;
- `POST /api/ai-chat/revision/done` : `401`.

Les tests unitaires couvrent notamment la persistance courte dans
`sessionStorage`, l'assainissement des messages, les donnees invalides, le
matching de la bibliotheque, les garde-fous pedagogiques, les limites de debit
et les erreurs Gemini `429` et `503`. Ils couvrent aussi le rejet d'une origine
forgee via `x-forwarded-host` et d'une requete navigateur `cross-site` sans
en-tete `Origin`.

## Etat de l integration

La PR 28 est fusionnee dans `main` via `08b5b19`. Ses deux executions de CI
"Tests et build Milo" sont en succes. Toute correction ulterieure doit etre
proposee dans une nouvelle branche et une nouvelle pull request, sans
reecrire l historique de la branche deja fusionnee.

## Problemes externes a traiter avant une livraison globale

### Migration Prisma non appliquee

`prisma migrate status` indique que la migration
`20260630120000_ajout_progression_formation` n'est pas appliquee sur la base
Supabase configuree localement. Elle cree `ProgressionFormation` pour l'espace
formation adulte. Son commit d'origine est :

`be805b1 chore(formation): finalise le backend (migration Prisma + auth propre)`.

Milo ne lit ni n'ecrit cette table. La migration doit etre validee et appliquee
par le responsable de la base partagee, sur une sauvegarde ou un environnement
de recette, avant la livraison du site complet. Ne pas lancer `prisma migrate
deploy` seul sur la base partagee.

### Lint global

Le lint de l'ensemble du depot retourne actuellement `287` erreurs et `120`
avertissements. Aucun fichier Milo ne fait partie des fichiers en erreur. Ce
resultat empeche toutefois de declarer le depot entier valide par lint.

### Dependances

`npm audit --omit=dev --audit-level=moderate` remonte cinq vulnerabilites
moderees dans des dependances du projet. Ne pas utiliser `npm audit fix --force`
pendant la stabilisation : la proposition implique des changements majeurs non
valides.

## Decision de livraison

Milo est integre dans `main`. La mise en production doit encore respecter le
smoke test de production et recevoir les validations de l'equipe sur la
migration Prisma et sur le lint global. Aucun tag de version ne doit etre cree
avant ces validations.

## Retour arriere

La PR Milo ne contient pas de migration. En cas de regression, redeployer le
dernier commit valide ou revertir le merge de la PR 28 depuis `main`, puis
verifier `/login`, `/enfant`, `/enfant/assistant` et `/api/ai-chat` selon la
procedure de `docs/milo-production-smoke-test.md`. Cette operation doit etre
validee par le responsable de l integration.
