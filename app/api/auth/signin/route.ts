import { NextRequest, NextResponse } from 'next/server';
import { createSession, setAuthCookie } from '@/lib/auth';
import { emailSchema, sanitizeInput, rateLimit } from '@/lib/validation';
import { findDemoUser, isDemoUser } from '@/lib/demo-users';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (more lenient for demo)
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(clientIP, 50, 15 * 60 * 1000)) { // 50 attempts per 15 minutes
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
    
    // Simple email validation using the pattern from emailSchema
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if it's a demo user
    const demoUser = findDemoUser(sanitizedEmail);
    
    // Create user (in production, fetch from database)
    const user = demoUser ? {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: demoUser.role,
      department: demoUser.department,
      avatar: demoUser.avatar,
      lastLogin: new Date()
    } : {
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
