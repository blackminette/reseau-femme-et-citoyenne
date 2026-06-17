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
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
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
    const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
    
    const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Redirect authenticated users away from auth routes
    if (user && isAuthRoute) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    if (!user) {
        if (isPrivateRoute) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return response;
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
        console.warn("[Middleware] Accès refusé : Profil non trouvé pour l'ID", user.id);
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // ... (rest of the middleware)
    
    if (userRole) {
        console.log(`[Middleware] Debug: User ${user.id} has role ${userRole}. Current path: ${pathname}`);
        
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
            console.log(`[Middleware] Debug: Redirecting non-admin from admin path`);
            return redirectUserToDefaultDashboard(userRole, url);
        }

        if (isPrivateRoute) {
            console.log(`[Middleware] Debug: Checking private route ${pathname} for user role ${userRole}`);
            if (userRole === 'PARTENAIRE' && !pathname.startsWith('/partenaire')) {
                url.pathname = '/partenaire';
                return NextResponse.redirect(url);
            }
            if (userRole === 'INTERVENANT' && !pathname.startsWith('/intervenant')) {
                url.pathname = '/intervenant';
                return NextResponse.redirect(url);
            }
            if (userRole === 'MEMBRE' && !pathname.startsWith('/membre')) {
                console.log(`[Middleware] Debug: Redirecting member to /membre`);
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
