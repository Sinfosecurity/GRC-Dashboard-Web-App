import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // Max requests per window
  skipSuccessfulRequests: false,
};

// Security headers configuration
const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'off',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';",
};

// Rate limiting function
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs;
  
  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitStore.delete(key);
    }
  }
  
  const key = `rate_limit:${ip}`;
  const current = rateLimitStore.get(key);
  
  if (!current) {
    rateLimitStore.set(key, { count: 1, resetTime: now });
    return true;
  }
  
  if (current.resetTime < windowStart) {
    rateLimitStore.set(key, { count: 1, resetTime: now });
    return true;
  }
  
  if (current.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
}

// Authentication check
function isAuthenticated(request: NextRequest): boolean {
  const authToken = request.cookies.get('auth-token');
  const authed = request.cookies.get('authed');
  
  return !!(authToken?.value || authed?.value);
}

// API route protection
function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/vendors',
  '/risks',
  '/controls',
  '/evidence',
  '/policies',
  '/audits',
  '/settings',
  '/tasks',
  '/reports',
  '/analytics'
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/signin',
  '/pricing',
  '/contact'
];

// Check if route is protected
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/static');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // Apply security headers to all responses
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Rate limiting for API routes
  if (isApiRoute(pathname)) {
    if (!rateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000).toString(),
            ...SECURITY_HEADERS
          }
        }
      );
    }
  }
  
  // Authentication checks
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated(request)) {
      // Redirect to sign-in page
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  // Redirect authenticated users away from sign-in page
  if (pathname === '/signin' && isAuthenticated(request)) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  
  // Add CORS headers for API routes
  if (isApiRoute(pathname)) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        ...SECURITY_HEADERS
      }
    });
  }
  
  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};