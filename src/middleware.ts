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
        // On tente de récupérer le rôle via l'API Supabase
        // Note: On utilise l'ID (UUID) qui est plus sûr
        const { data: profile, error: roleError } = await supabase
            .from('Utilisateur')
            .select('role')
            .eq('id', user.id)
            .single();

        if (roleError) {
            console.error("[Middleware] Erreur API Supabase (table Utilisateur):", roleError.message);
            
            // Tentative de repli si la table est en minuscules dans Postgres
            const { data: profileRetry, error: retryError } = await supabase
                .from('utilisateur')
                .select('role')
                .eq('id', user.id)
                .single();
                
            if (!retryError && profileRetry) {
                userRole = profileRetry.role as UserRole;
            } else if (retryError) {
                console.error("[Middleware] Erreur API Supabase (table utilisateur):", retryError.message);
            }
        } else if (profile) {
            userRole = profile.role as UserRole;
        }
    }

    if (!userRole && isPrivateRoute) {
        console.warn("[Middleware] Accès refusé : Profil non trouvé pour l'ID", user.id);
        url.pathname = '/login';
        return NextResponse.redirect(url);
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
