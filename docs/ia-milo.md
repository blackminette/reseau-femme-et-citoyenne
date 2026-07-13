# Milo / assistant IA

## Runtime actif

Milo est execute par le serveur Next.js. Le prototype Express et SQLite sous
`server/` reste une archive de travail, mais ne constitue plus le chemin
d'execution de l'application Next.

- `src/app/(dashboard-enfant)/layout.tsx` charge le widget dans l'espace enfant.
- `public/ai-widget.js` fournit le panneau flottant, le mode plein ecran et la
  memoire courte de navigateur.
- `public/assistant.html` charge le meme widget en plein ecran.
- `src/app/api/ai-chat/route.ts` recoit les messages et repond a `POST /api/ai-chat`.
- `src/lib/milo/` contient la validation, l'authentification, le matching, les
  garde-fous, Gemini et le fallback.

## Flux de traitement

1. La route verifie la session Supabase et exige un profil Prisma de role `ENFANT`.
   Il n'existe aucun fallback vers un autre compte enfant.
2. La requete est bornee et nettoyee : message, historique et contexte de question.
   Un indice de bonne reponse envoye par le navigateur est ignore.
3. Sur les routes Next, Milo resout le parcours depuis l'activite ou le module
   publie en base. Une query string ne decide donc pas seule de la bibliotheque
   pedagogique utilisee.
4. Un garde-fou traite les demandes de reponse directe et les propos agressifs
   avant toute bibliotheque ou appel IA.
5. Milo cherche ensuite une reponse dans la bibliotheque locale de Wael avant
   tout appel IA.
6. Pour les autres demandes, la route appelle Gemini cote serveur avec
   `GEMINI_API_KEY`.
7. Une erreur Gemini, un quota epuise, un timeout ou une cle absente produit une
   reponse pedagogique de secours. Le widget reste utilisable.

## Donnees et securite

- `GEMINI_API_KEY` est une variable serveur. Elle ne doit jamais porter le prefixe
  `NEXT_PUBLIC_` et ne doit jamais etre commitee.
- Le prompt ne recoit que le prenom de l'enfant et la question utile. Il ne recoit
  ni nom complet, ni email, ni mot de passe, ni bonne reponse du quiz.
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
- ouvrir Milo depuis une page enfant et depuis `/assistant.html` ;
- demander une definition connue de la bibliotheque ;
- demander une aide hors bibliotheque ;
- tester sans cle Gemini ou avec un quota limite ;
- vider puis corrompre `sessionStorage` ;
- verifier qu'aucune erreur console ni requete 404 vers `/api/ai-chat` ne subsiste.
