import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  lastLogin: Date;
}

export interface Session {
  user: User;
  expires: Date;
  token: string;
}

// In-memory session store (in production, use Redis or database)
const sessions = new Map<string, Session>();

export function createSession(user: User): Session {
  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  const session: Session = {
    user,
    expires,
    token
  };
  
  sessions.set(token, session);
  return session;
}

export function getSession(token: string): Session | null {
  const session = sessions.get(token);
  if (!session || session.expires < new Date()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) return null;
  
  const session = getSession(token);
  return session?.user || null;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });
}
