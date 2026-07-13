# Milo / assistant IA

## Runtime actif

Milo est execute par le serveur Next.js. Le prototype Express et SQLite sous
`server/` reste une archive de travail, mais ne constitue plus le chemin
d'execution de l'application Next.

- `src/app/(dashboard-enfant)/layout.tsx` charge le widget dans l'espace enfant.
- `public/ai-widget.js` fournit le panneau flottant, le mode plein ecran et la
  memoire courte de navigateur.
- `/assistant.html` redirige vers `/enfant/assistant`, une route protegee qui
  charge le meme widget en plein ecran.
- `src/app/api/ai-chat/route.ts` recoit les messages et repond a `POST /api/ai-chat`.
- `src/lib/milo/` contient la validation, l'authentification, le matching, les
  garde-fous, Gemini et le fallback.

## Flux de traitement

1. La route verifie la session Supabase et exige un profil Prisma de role `ENFANT`.
   Il n'existe aucun fallback vers un autre compte enfant.
2. La route verifie la session avant de lire le JSON et borne la lecture reelle du
   corps HTTP a 16 Ko, y compris si `Content-Length` est absent ou incorrect. La
   requete est ensuite nettoyee : message,
   historique et contexte de question. Le widget transmet uniquement le texte de
   la consigne : ni les choix ni un indice de bonne reponse ne quittent le
   navigateur.
3. Sur les routes Next, Milo resout le parcours depuis l'activite ou le module
   publie en base. Pour une activite, il extrait aussi des reperes courts du JSON
   admin (`Cours.contenu` ou `Exercice.contenu`). Les choix et `reponseCorrecte`
   sont exclus de ce contexte. Une query string ne decide donc pas seule de la
   bibliotheque pedagogique utilisee.
4. Un garde-fou traite les demandes de reponse directe et les propos agressifs
   avant toute bibliotheque ou appel IA, y compris les demandes du type
   "reponds par A" ou "A ou B".
5. Milo cherche ensuite une reponse dans la bibliotheque locale de Wael avant
   tout appel IA.
6. Pour les autres demandes, la route appelle Gemini cote serveur avec
   `GEMINI_API_KEY`.
7. Une erreur Gemini, un quota epuise, un timeout ou une cle absente produit une
   reponse pedagogique de secours. Le widget reste utilisable.
8. Une meme session enfant est limitee a 12 messages par minute sur une instance
   Node.js. Cette limite protege contre les boucles et les abus simples ; elle
   devra etre remplacee par un limiteur partage si le deploiement utilise plusieurs
   instances.

## Donnees et securite

- `GEMINI_API_KEY` est une variable serveur. Elle ne doit jamais porter le prefixe
  `NEXT_PUBLIC_` et ne doit jamais etre commitee.
- Le serveur ajoute seulement le prenom de l'enfant et le contexte pedagogique
  utile. Les adresses e-mail, numeros de telephone et secrets ecrits dans les
  messages ou les extraits de contenu sont masques avant l'appel Gemini. La
  detection automatique des noms complets n'est pas fiable : le deploiement doit
  donc aussi prevoir une information parentale et les conditions de traitement
  adaptees aux mineurs.
- `sessionStorage` ne conserve que l'historique de la session et des statistiques
  locales. Sa lecture est protegee contre un JSON vide ou invalide.
- Les endpoints `/api/ai-chat/revision` et `/api/ai-chat/revision/done` sont
  conserves pour le widget. Ils ne persisteront aucune revision tant qu'un modele
  de donnees partage et valide n'aura pas ete decide par l'equipe.

## Configuration requise

Variables du serveur deploiement :

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
```

## Verification manuelle

- se connecter avec un compte enfant ;
- ouvrir Milo depuis une page enfant et verifier que `/assistant.html` redirige
  vers `/enfant/assistant` ;
- ouvrir une lecon et un exercice publies, puis verifier que Milo utilise leurs
  reperes sans donner la reponse attendue ;
- demander une definition connue de la bibliotheque ;
- demander une aide hors bibliotheque ;
- tester sans cle Gemini ou avec un quota limite ;
- vider puis corrompre `sessionStorage` ;
- verifier qu'aucune erreur console ni requete 404 vers `/api/ai-chat` ne subsiste.
