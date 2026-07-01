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
        '/premiere-connexion/:path*',
        '/login',
    ],
};

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    const url = request.nextUrl.clone();
    const pathname = url.pathname;

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

    const privateRoutes = ['/partenaire', '/membre', '/etudiant', '/intervenant', '/enfant', '/admin', '/benevole'];
    const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

    if (!user) {
        if (isPrivateRoute || pathname.startsWith('/premiere-connexion')) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return response;
    }

    let userRole: UserRole | null = null;
    let isActive = true;

    if (user.id) {
        const { data: profile, error } = await supabase
            .from("Utilisateur")
            .select('role, isActive')
            .eq('id', user.id)
            .single();

        if (!error && profile) {
            userRole = profile.role as UserRole;
            isActive = profile.isActive ?? true;
        }
    }

    if (!isActive) {
        url.pathname = '/login';
        url.searchParams.set('error', 'disabled');
        const logoutResponse = NextResponse.redirect(url);
        logoutResponse.cookies.delete('sb-access-token');
        logoutResponse.cookies.delete('sb-refresh-token');
        return logoutResponse;
    }

    const doitChanger = user.user_metadata?.doitChangerMotDePasse === true;
    if (doitChanger) {
        if (!pathname.startsWith('/premiere-connexion')) {
            url.pathname = '/premiere-connexion';
            return NextResponse.redirect(url);
        }
        return response;
    }

    if (pathname.startsWith('/premiere-connexion') && !doitChanger) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    if (pathname === '/login') {
        if (userRole) {
            return redirectUserToDefaultDashboard(userRole, url);
        }
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    if (!userRole && isPrivateRoute) {
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