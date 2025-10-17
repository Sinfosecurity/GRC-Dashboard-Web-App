import { NextRequest, NextResponse } from 'next/server';
import { createSession, setAuthCookie } from '@/lib/auth';
import { emailSchema, sanitizeInput, rateLimit } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(clientIP, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate and sanitize email
    const sanitizedEmail = sanitizeInput(email);
    const validationResult = emailSchema.safeParse(sanitizedEmail);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    // Create user (in production, fetch from database)
    const user = {
      id: `user_${Date.now()}`,
      email: sanitizedEmail,
      name: sanitizedEmail.split('@')[0],
      role: 'user' as const,
      lastLogin: new Date()
    };

    // Create session
    const session = createSession(user);

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    // Set auth cookie
    setAuthCookie(response, session.token);

    return response;

  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
