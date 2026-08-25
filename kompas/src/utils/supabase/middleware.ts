import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Do not run Supabase code on static files to reduce execution time
    if (
        request.nextUrl.pathname.startsWith('/_next/static') ||
        request.nextUrl.pathname.startsWith('/_next/image') ||
        request.nextUrl.pathname.endsWith('.ico')
    ) {
        return supabaseResponse;
    }

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const authRoutes = ['/login', '/register', '/forgot-password'];
        if (user && authRoutes.includes(request.nextUrl.pathname)) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/dashboard';
            return NextResponse.redirect(redirectUrl);
        }

        const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
        const isLiveHostRoute = request.nextUrl.pathname.startsWith('/live/host');

        if (!user && (isDashboardRoute || isLiveHostRoute)) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/login';
            redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    } catch (e) {
        const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
        const isLiveHostRoute = request.nextUrl.pathname.startsWith('/live/host');
        if (isDashboardRoute || isLiveHostRoute) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/login';
            redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    return supabaseResponse;
}
