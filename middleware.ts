import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Redirect to sign-in if no token
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Verify session
  const session = getSession(token);
  if (!session) {
    // Clear invalid token and redirect
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  // Add user info to headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', session.user.id);
  requestHeaders.set('x-user-email', session.user.email);
  requestHeaders.set('x-user-role', session.user.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
