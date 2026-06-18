// * src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UserRole } from '@/types/auth';

// Route sur laquelle le middleware s'applique (toutes les routes privees)
export const config = {
    matcher: [
        '/membre/:path*',
        '/admin/:path*',
        '/enfant/:path*',
        '/intervenant/:path*',
        '/benevole/:path*',
        '/partenaire/:path*',
    ],
};

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    // Initialisation du client Supabase pour gerer les cookies de session
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

    // Recuperation de l'utilisateur connecte
    const { data: { user } } = await supabase.auth.getUser();
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Detection des routes privees (/admin, /membre...)
    const privateRoutes = ['/partenaire', '/membre', '/etudiant', '/intervenant', '/enfant', '/admin'];
    const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

    // Si non connecte et tente d'aller sur une page privee -> Redirection /login
    if (!user) {
        if (isPrivateRoute) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return response;
    }

    // Si deja connecte et tente d'aller sur /login -> Redirection vers l'accueil
    if (pathname === '/login') {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Recuperation du role de l'utilisateur dans la table Prisma
    let userRole: UserRole | null = null;

    if (user.email) {
        const { data: profile, error } = await supabase
            .from('Utilisateur') // Nom de ta table Prisma
            .select('role')
            .eq('email', user.email)
            .single();

        if (!error && profile) {
            userRole = profile.role as UserRole;
        }
    }

    // Securite : bloque l'acces si l'utilisateur n'a aucun role enregistre en base
    if (!userRole && isPrivateRoute) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Gestion des acces selon le role (RBAC)
    if (userRole) {
        // Interdit l'acces a /admin si l'utilisateur n'est pas ADMIN
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
            return redirectUserToDefaultDashboard(userRole, url);
        }

        // Redirige l'utilisateur vers son propre espace s'il s'est trompe d'URL
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
        }
    }

    return response;
}

// Fonction utilitaire pour renvoyer un utilisateur vers son tableau de bord par defaut
function redirectUserToDefaultDashboard(role: UserRole | 'INTERVENANTE', url: URL) {
    switch (role) {
        case 'ADMIN': url.pathname = '/admin'; break;
        case 'PARTENAIRE': url.pathname = '/partenaire'; break;
        case 'ETUDIANT': url.pathname = '/etudiant'; break;
        case 'INTERVENANT': url.pathname = '/intervenant'; break;
        case 'INTERVENANTE': url.pathname = '/intervenant'; break;
        case 'BENEVOLE': url.pathname = '/benevole'; break;
        case 'MEMBRE': url.pathname = '/membre'; break;
        case 'ENFANT': url.pathname = '/enfant'; break;
        default: url.pathname = '/';
    }
    return NextResponse.redirect(url);
}
