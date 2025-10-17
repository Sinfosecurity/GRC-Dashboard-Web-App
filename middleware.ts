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

  // For demo purposes, allow access to dashboard without strict auth
  // In production, you would check for auth token here
  const token = request.cookies.get('auth-token')?.value;

  // If no token, let the client-side AuthGuard handle the redirect
  if (!token) {
    return NextResponse.next();
  }

  // Verify session if token exists
  const session = getSession(token);
  if (!session) {
    // Clear invalid token but still allow access (client-side will handle)
    const response = NextResponse.next();
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
