// * src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UserRole } from '@/types/auth';

// Route sur laquelle le middleware s'applique (toutes les routes sauf fichiers statiques et API)
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|logo.ico|logo.webp|ai-widget.js).*)',
    ],
};

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    // Initialisation du client Supabase pour gérer les cookies de session
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
    let user = null;
    try {
        const { data } = await supabase.auth.getUser();
        user = data?.user || null;
    } catch (e) {
        console.warn("[Middleware] Échec de la récupération de l'utilisateur (réseau/DNS déconnecté) :", e);
    }
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Détection des routes privées (/admin, /membre...)
    const privateRoutes = ['/partenaire', '/membre', '/etudiant', '/intervenant', '/enfant', '/admin', '/benevole'];
    const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

    // Si non connecté et tente d'aller sur une page privée -> Redirection /login
    if (!user) {
        if (pathname === '/assistant.html') {
            url.pathname = '/enfant/assistant';
            return NextResponse.redirect(url);
        }
        if (isPrivateRoute) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return response;
    }

    // Si déjà connecté et tente d'aller sur /login -> Redirection vers son dashboard
    if (pathname === '/login') {
        // On récupère d'abord le rôle
        let userRole: UserRole | null = null;
        if (user.email) {
            try {
                const { data: profile } = await supabase
                    .from('Utilisateur')
                    .select('role')
                    .eq('email', user.email)
                    .single();
                if (profile) {
                    userRole = profile.role as UserRole;
                }
            } catch (e) {
                console.warn("[Middleware] Échec de la récupération du rôle", e);
            }
        }
        if (userRole) {
            return redirectUserToDefaultDashboard(userRole, url);
        }
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    if (pathname === '/assistant.html') {
        url.pathname = '/enfant/assistant';
        return NextResponse.redirect(url);
    }

    // Récupération du rôle de l'utilisateur dans la table Prisma
    let userRole: UserRole | null = null;

    if (user.email) {
        try {
            const { data: profile, error } = await supabase
                .from('Utilisateur') // Nom de ta table Prisma
                .select('role')
                .eq('email', user.email)
                .single();

            if (!error && profile) {
                userRole = profile.role as UserRole;
            }
        } catch (e) {
            console.warn("[Middleware] Échec de la récupération du rôle utilisateur (réseau/DNS déconnecté) :", e);
        }
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
        if (userRole === 'ENFANT') {
            if (!pathname.startsWith('/enfant') && !pathname.startsWith('/api') && !pathname.startsWith('/_next') && pathname !== '/favicon.ico') {
                url.pathname = '/enfant';
                return NextResponse.redirect(url);
            }
        }

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
