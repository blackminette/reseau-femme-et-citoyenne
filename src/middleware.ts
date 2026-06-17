// * src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { UserRole } from '@/types/auth';

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

    const { data: { user } } = await supabase.auth.getUser();
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    const privateRoutes = ['/partenaire', '/membre', '/etudiant', '/intervenant', '/enfant', '/admin'];
    const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

    if (!user) {
        if (isPrivateRoute) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return response;
    }

    if (pathname === '/login') {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    let userRole: UserRole | null = null;

    if (user.id) {
        // La table s'appelle "Utilisateur" dans Postgres (PascalCase)
        const { data: profiles, error: roleError } = await supabase
            .from('Utilisateur')
            .select('role')
            .eq('id', user.id);

        if (roleError) {
            console.error("[Middleware] Erreur accès table Utilisateur:", roleError.message);
        } else if (profiles && profiles.length > 0) {
            userRole = profiles[0].role as UserRole;
        }
    }

    if (!userRole && isPrivateRoute) {
        console.warn("[Middleware] !!! ACCÈS AUTORISÉ PAR DÉFAUT (Profil non trouvé pour l'ID)", user.id);
        // On laisse passer malgré l'absence de rôle pour vous permettre d'accéder au dashboard (DEBUG)
        return response; 
    }

    if (userRole) {
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
            return redirectUserToDefaultDashboard(userRole, url);
        }

        if (isPrivateRoute) {
            if (userRole === 'PARTENAIRE' && !pathname.startsWith('/partenaire')) {
                url.pathname = '/partenaire';
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

function redirectUserToDefaultDashboard(role: UserRole, url: URL) {
    switch (role) {
        case 'ADMIN': url.pathname = '/admin'; break;
        case 'PARTENAIRE': url.pathname = '/partenaire'; break;
        case 'INTERVENANT': url.pathname = '/intervenant'; break;
        case 'BENEVOLE': url.pathname = '/benevole'; break;
        case 'MEMBRE': url.pathname = '/membre'; break;
        case 'ENFANT': url.pathname = '/enfant'; break;
        default: url.pathname = '/';
    }
    return NextResponse.redirect(url);
}
