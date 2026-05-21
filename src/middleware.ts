// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UserRole } from '@/types/auth'; // On importe le type créé à l'étape précédente

/**
 * Configuration du filtrage des routes.
 * Le middleware ne doit s'exécuter que sur les pages de l'application,
 * pas sur les fichiers statiques (images, polices) ni sur les fonctions internes de Next.js.
 */
export const config = {
    matcher: [
        /*
         * Match toutes les routes sauf :
         * - api (les API ont leurs propres vérifications ou guards dédiés)
         * - _next/static (fichiers statiques)
         * - _next/image (optimisation d'images Next.js)
         * - favicon.ico, sitemap.xml, robots.txt (fichiers publics)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};

export async function middleware(request: NextRequest) {
    // 1. Initialisation de la réponse par défaut (on laisse passer la requête au départ)
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 2. Initialisation du client Supabase adapté au Middleware Next.js
    // Cette configuration permet de lire et d'écrire les cookies de session automatiquement.
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 3. Récupération de la session de l'utilisateur connecté
    const { data: { session } } = await supabase.auth.getSession();

    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // 4. CAS GÉNÉRAL : Si l'utilisateur n'est pas connecté
    if (!session) {
        // Si la route demande une connexion (ex: dashboards) et qu'il est anonyme -> Redirection vers /login
        // On laisse l'accès libre à la page d'accueil "/", à l'inscription et à la page étudiant spéciale.
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return response;
    }

    // 5. RÉCUPÉRATION DU RÔLE (Depuis les métadonnées de Supabase Auth)
    // Ton collègue va configurer Supabase pour stocker le rôle dans les user_metadata lors de la connexion.
    const userRole = session.user.user_metadata?.role as UserRole;

    // 6. CARTOGRAPHIE DES STRATÉGIES DE REDIRECTION (RBAC STRICT)

    // REGLE 1 : Protection de l'espace Administrateur
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        // Si quelqu'un d'autre qu'un Admin tente d'entrer, on le renvoie vers son dashboard par défaut
        return redirectUserToDefaultDashboard(userRole, url);
    }

    // REGLE 2 : Protection des dossiers spécifiques par rôle dans les Dashboards
    if (pathname.startsWith('/dashboard')) {

        // Un partenaire ne peut aller QUE dans /dashboard/partenaire
        if (userRole === 'PARTENAIRE' && !pathname.startsWith('/dashboard/partenaire')) {
            url.pathname = '/dashboard/partenaire';
            return NextResponse.redirect(url);
        }

        // Un étudiant ne peut aller QUE dans /dashboard/etudiant
        if (userRole === 'ETUDIANT' && !pathname.startsWith('/dashboard/etudiant')) {
            url.pathname = '/dashboard/etudiant';
            return NextResponse.redirect(url);
        }

        // Un intervenant ne peut aller QUE dans /dashboard/intervenant
        if (userRole === 'INTERVENANT' && !pathname.startsWith('/dashboard/intervenant')) {
            url.pathname = '/dashboard/intervenant';
            return NextResponse.redirect(url);
        }

        // Un membre (parent) ne peut aller QUE dans /dashboard/membre
        if (userRole === 'MEMBRE' && !pathname.startsWith('/dashboard/membre')) {
            url.pathname = '/dashboard/membre';
            return NextResponse.redirect(url);
        }

        // Un enfant ne peut aller QUE dans /dashboard/enfant
        if (userRole === 'ENFANT' && !pathname.startsWith('/dashboard/enfant')) {
            url.pathname = '/dashboard/enfant';
            return NextResponse.redirect(url);
        }
    }

    // Si toutes les vérifications passent, l'utilisateur accède à la page demandée
    return response;
}

/**
 * Fonction utilitaire pour rediriger un utilisateur fraudeur ou égaré
 * vers la racine de son propre espace de travail légitime.
 */
function redirectUserToDefaultDashboard(role: UserRole, url: URL) {
    switch (role) {
        case 'ADMIN':
            url.pathname = '/admin';
            break;
        case 'PARTENAIRE':
            url.pathname = '/dashboard/partenaire';
            break;
        case 'ETUDIANT':
            url.pathname = '/dashboard/etudiant';
            break;
        case 'INTERVENANT':
            url.pathname = '/dashboard/intervenant';
            break;
        case 'MEMBRE':
            url.pathname = '/dashboard/membre';
            break;
        case 'ENFANT':
            url.pathname = '/dashboard/enfant';
            break;
        default:
            url.pathname = '/';
    }
    return NextResponse.redirect(url);
}