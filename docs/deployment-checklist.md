# Checklist de livraison de Milo

Perimetre : assistant Milo uniquement. Cette checklist ne realise aucun
deploiement et ne modifie ni DNS, ni messagerie, ni secret.

## Depot

- [x] Branche dediee basee sur la branche d'integration actuelle.
- [x] `git status --short --branch --untracked-files=all` est compris.
- [x] Seuls les fichiers Milo et sa documentation de livraison sont indexes.
- [x] Aucun `.env`, cle, jeton, journal ou base locale n'est indexe.
- [x] Le workflow GitHub `Validation Milo` est present et cible la PR et la branche Milo.

## Moteur Next.js

- [x] `src/app/api/ai-chat/route.ts` existe et gere `POST /api/ai-chat`.
- [x] La route verifie la session Supabase et le role Prisma `ENFANT`.
- [x] La route impose une limite de 16 Ko sur le flux reel, pas seulement sur `Content-Length`.
- [x] La route refuse l'acces si les services d'identite sont indisponibles.
- [x] La route resout le parcours enfant publie depuis l'activite ou le module.
- [x] La route utilise uniquement des extraits surs du JSON publie et exclut les choix et reponses.
- [x] Le widget envoie uniquement le texte de la question, jamais les choix ni l'index de reponse.
- [x] `GEMINI_API_KEY` reste cote serveur.
- [x] Cle absente, delai depasse et quota Gemini renvoient un secours sur.
- [x] La bibliotheque locale est consultee avant Gemini.
- [x] Le widget est charge par `src/app/(dashboard-enfant)/layout.tsx`.

## Comportement de l'interface

- [x] `/assistant.html` redirige vers la route protegee `/enfant/assistant`.
- [x] Une page enfant affiche le bouton flottant Milo.
- [x] Une question connue renvoie une reponse de la bibliotheque.
- [x] Une question inconnue atteint Gemini lorsqu'il est configure.
- [x] Un `sessionStorage` vide ou invalide ne fait pas planter le widget.
- [x] Les endpoints de compatibilite des revisions ne renvoient pas 404.

## Environnement de deploiement

- [ ] La cible execute les routes serveur Next.js et pas seulement des fichiers statiques.
- [x] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et `DATABASE_URL` sont configures localement.
- [x] `GEMINI_API_KEY` est configuree localement comme variable serveur privee.
- [x] `GEMINI_MODEL` est configure ou la valeur par defaut documentee est acceptee localement.
- [ ] `/enfant/assistant` et `/api/ai-chat` sont accessibles sur la cible de production.
- [x] Les journaux locaux peuvent etre consultes sans exposer de secret ni de donnee enfant.
- [x] La CI valide Prisma et le build sur une base PostgreSQL ephemere.

## Porte finale

- [x] Les tests unitaires passent.
- [x] ESLint passe sur les fichiers Milo.
- [x] `git diff --check` passe.
- [x] Le resultat du build est documente, y compris les blocages hors perimetre.
- [x] Le test navigateur utilise une vraie session enfant et un environnement local controle.
- [x] La CI GitHub est verte sur la PR 28.
- [ ] La validation humaine est enregistree avant le deploiement.
