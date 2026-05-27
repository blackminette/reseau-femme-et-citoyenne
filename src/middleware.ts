// * src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UserRole } from '@/types/auth';

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
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

    const { data: { session } } = await supabase.auth.getSession();
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Liste des routes privées qui demandent une connexion obligatoire
    const privateRoutes = ['/partenaire', '/membre', '/etudiant', '/intervenant', '/enfant', '/admin'];
    const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

    // Si l'utilisateur n'est pas connecté
    if (!session) {
        // Si la route demandée est privée -> Redirection vers /login
        if (isPrivateRoute) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return response;
    }

    // Évite les boucles infinies : Si on est connecté et qu'on essaie d'aller sur /login, on passe
    if (pathname === '/login') {
        return response;
    }

    // RÉCUPÉRATION DU RÔLE
    const userRole = session.user.user_metadata?.role as UserRole;

    // CARTOGRAPHIE DES STRATÉGIES DE REDIRECTION (RBAC STRICT)

    // REGLE 1 : Protection de l'espace Administrateur
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        return redirectUserToDefaultDashboard(userRole, url);
    }

    // REGLE 2 : Cloisonnement strict des espaces de rôles
    // Si l'utilisateur tente d'accéder à l'espace d'un AUTRE rôle, on le redirige vers le sien.
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
    }

    return response;
}

function redirectUserToDefaultDashboard(role: UserRole, url: URL) {
    switch (role) {
        case 'ADMIN':
            url.pathname = '/admin';
            break;
        case 'PARTENAIRE':
            url.pathname = '/partenaire';
            break;
        case 'ETUDIANT':
            url.pathname = '/etudiant';
            break;
        case 'INTERVENANT':
            url.pathname = '/intervenant';
            break;
        case 'MEMBRE':
            url.pathname = '/membre';
            break;
        case 'ENFANT':
            url.pathname = '/enfant';
            break;
        default:
            url.pathname = '/';
    }
    return NextResponse.redirect(url);
}