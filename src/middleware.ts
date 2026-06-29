// * src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UserRole } from '@/types/auth';

// Route sur laquelle le middleware s'applique
export const config = {
    matcher: [
        '/membre/:path*',
        '/admin/:path*',
        '/enfant/:path*',
        '/intervenant/:path*',
        '/benevole/:path*',
        '/partenaire/:path*',
        '/premiere-connexion/:path*',
    ],
};

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    // Initialisation du client Supabase
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll(); },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request: { headers: request.headers } });
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                },
            },
        }
    );

    // Récupération de l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Détection des routes privées
    const privateRoutes = ['/partenaire', '/membre', '/etudiant', '/intervenant', '/enfant', '/admin', '/benevole'];
    const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

    // Si non connecté et tente d'aller sur une page privée -> Redirection /login
    if (!user) {
        if (isPrivateRoute || pathname.startsWith('/premiere-connexion')) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return response;
    }

    // Récupération du rôle et du statut d'activation dans la table Prisma
    let userRole: UserRole | null = null;
    let isActive = true; // Actif par défaut par sécurité

    if (user.email) {
        const { data: profile, error } = await supabase
            .from('Utilisateur')
            .select('role, isActive')
            .eq('email', user.email)
            .single();

        if (!error && profile) {
            userRole = profile.role as UserRole;
            isActive = profile.isActive;
        }
    }

    // BLOCAGE SI LE COMPTE EST DÉSACTIVÉ
    if (!isActive) {
        url.pathname = '/login';
        url.searchParams.set('error', 'disabled');

        // Supprime les cookies de session pour déconnecter proprement l'utilisateur
        const logoutResponse = NextResponse.redirect(url);
        logoutResponse.cookies.delete('sb-access-token');
        logoutResponse.cookies.delete('sb-refresh-token');

        return logoutResponse;
    }

    // FORCE LA MODIFICATION DU MOT DE PASSE À LA PREMIÈRE CONNEXION
    const doitChanger = user.user_metadata?.doitChangerMotDePasse === true;
    if (doitChanger) {
        // Redirige vers la page dédiée si l'utilisateur essaie d'aller ailleurs
        if (!pathname.startsWith('/premiere-connexion')) {
            url.pathname = '/premiere-connexion';
            return NextResponse.redirect(url);
        }
        // S'il est déjà sur /premiere-connexion, on le laisse charger la page
        return response;
    }

    // Si le mot de passe est déjà changé, interdit l'accès à la page de configuration initiale
    if (pathname.startsWith('/premiere-connexion') && !doitChanger) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Si déjà connecté et tente d'aller sur /login -> Redirection vers l'accueil
    if (pathname === '/login') {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Sécurité : Bloque l'accès si l'utilisateur n'a aucun rôle enregistré en base
    if (!userRole && isPrivateRoute) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Gestion des accès selon le rôle (RBAC)
    if (userRole) {
        // Interdit l'accès à /admin si l'utilisateur n'est pas ADMIN
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
            return redirectUserToDefaultDashboard(userRole, url);
        }

        // Redirige de force l'utilisateur vers son propre espace s'il s'est trompé d'URL
        if (isPrivateRoute) {
            if (userRole === 'PARTENAIRE' && !pathname.startsWith('/partenaire')) {
                url.pathname = '/partenaire';
                return NextResponse.redirect(url);
            }
            if (userRole === 'ETUDIANT' && !pathname.startsWith('/etudiant')) {
                url.pathname = '/etudiant';
                return NextResponse.redirect(url);
            }
            if (userRole === 'INTERVENANT' && !pathname.startsWith('/intervenant')) {
                url.pathname = '/intervenant';
                return NextResponse.redirect(url);
            }
            if (userRole === 'MEMBRE' && !pathname.startsWith('/membre')) {
                url.pathname = '/membre';
                return NextResponse.redirect(url);
            }
            if (userRole === 'ENFANT' && !pathname.startsWith('/enfant')) {
                url.pathname = '/enfant';
                return NextResponse.redirect(url);
            }
            if (userRole === 'ADMIN' && !pathname.startsWith('/admin')) {
                url.pathname = '/admin';
                return NextResponse.redirect(url);
            }
            if (userRole === 'BENEVOLE' && !pathname.startsWith('/benevole')) {
                url.pathname = '/benevole';
                return NextResponse.redirect(url);
            }
        }
    }

    return response;
}

// Fonction utilitaire pour renvoyer un utilisateur vers son tableau de bord par défaut
function redirectUserToDefaultDashboard(role: UserRole, url: URL) {
    switch (role) {
        case 'ADMIN': url.pathname = '/admin'; break;
        case 'PARTENAIRE': url.pathname = '/partenaire'; break;
        case 'ETUDIANT': url.pathname = '/etudiant'; break;
        case 'INTERVENANT': url.pathname = '/intervenant'; break;
        case 'BENEVOLE': url.pathname = '/benevole'; break;
        case 'MEMBRE': url.pathname = '/membre'; break;
        case 'ENFANT': url.pathname = '/enfant'; break;
        default: url.pathname = '/';
    }
    return NextResponse.redirect(url);
}