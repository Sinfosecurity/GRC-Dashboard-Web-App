import { z } from 'zod';

// Email validation schema
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')
  .max(255, 'Email is too long');

// User validation schema
export const userSchema = z.object({
  email: emailSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  role: z.enum(['admin', 'user', 'viewer']).default('user')
});

// API request validation
export const apiRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  path: z.string(),
  headers: z.record(z.string()).optional(),
  body: z.any().optional()
});

// Risk validation schema
export const riskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Title is required'),
  owner: z.string().min(1, 'Owner is required'),
  inherent: z.number().min(0).max(100),
  residual: z.number().min(0).max(100),
  status: z.enum(['Open', 'Mitigating', 'Closed']),
  tags: z.array(z.string()).optional()
});

// Vendor validation schema
export const vendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  score: z.number().min(0).max(100),
  tier: z.number().min(1).max(5),
  redFlags: z.number().min(0)
});

// Audit validation schema
export const auditSchema = z.object({
  name: z.string().min(1, 'Audit name is required'),
  due: z.string().datetime('Invalid date format'),
  status: z.enum(['Planning', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'])
});

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitMap.get(key);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  return true;
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

// Email validation helper
export function isValidEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}
