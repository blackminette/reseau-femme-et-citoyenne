
# Sitemap

## 1. Accès Public (Non authentifié)

| URL | Rôle Fonctionnel | Données / Spécification | Composant |
| :--- | :--- | :--- | :--- |
| `/` | Accueil / Vitrine | Contenu statique | `app/(app-avec-header)/page.tsx` |
| `/a-propos` | Histoire et équipe | Contenu statique | `app/(app-avec-header)/a-propos/page.tsx` |
| `/ateliers` | Liste des activités | `prisma.workshop.findMany()` | `app/(app-avec-header)/ateliers/page.tsx` |
| `/ateliers/[id]` | Fiche détaillée | `prisma.workshop.findUnique()` | `app/(app-avec-header)/ateliers/[id]/page.tsx` |
| `/contact` | Formulaire de contact | Formulaire public | `app/(app-avec-header)/contact/page.tsx` |
| `/signup` | Inscription | Session Supabase | `app/(app-avec-header)/signup/page.tsx` |
| `/login` | Connexion | Session Supabase / NextAuth | `app/(app-avec-header)/login/page.tsx` |

## 2. Accès Privé (Authentifié selon rôle)

| URL | Rôle | Espace | Composant |
| :--- | :--- | :--- | :--- |
| `/membre` | MEMBRE | Espace Parent | `app/(app-avec-header)/(dashboard)/membre/page.tsx` |
| `/partenaire` | PARTENAIRE | Espace Entreprise | `app/(app-avec-header)/(dashboard)/partenaire/page.tsx` |
| `/intervenant` | INTERVENANT | Espace Animateur | `app/(app-avec-header)/(dashboard)/intervenant/page.tsx` |
| `/etudiant` | ETUDIANT | Tableau de bord apprentissage | `app/(app-avec-header)/(dashboard)/etudiant/page.tsx` |
| `/enfant` | ENFANT | Espace ludique | `app/(app-avec-header)/(dashboard)/enfant/page.tsx` |
| `/admin` | ADMIN | Console souveraine | `app/admin/page.tsx` |

---
*Note : Les routes privées sont protégées par le fichier `middleware.ts` à la racine de `src/`.*