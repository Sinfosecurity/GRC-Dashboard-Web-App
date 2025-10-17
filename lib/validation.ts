// Advanced validation utilities for GRC Atlas

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'url' | 'date' | 'boolean';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

// Enhanced rate limiting with different tiers
const rateLimitStore = new Map<string, { count: number; resetTime: number; tier: string }>();

export function rateLimit(
  clientIP: string, 
  maxRequests: number = 100, 
  windowMs: number = 15 * 60 * 1000,
  tier: 'free' | 'premium' | 'enterprise' = 'free'
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitStore.delete(key);
    }
  }
  
  const key = `rate_limit:${clientIP}:${tier}`;
  const current = rateLimitStore.get(key);
  
  if (!current) {
    rateLimitStore.set(key, { count: 1, resetTime: now, tier });
    return true;
  }
  
  if (current.resetTime < windowStart) {
    rateLimitStore.set(key, { count: 1, resetTime: now, tier });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Phone number validation
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Date validation
export function isValidDate(date: string): boolean {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}

// Risk score validation
export function isValidRiskScore(score: number): boolean {
  return score >= 0 && score <= 100 && Number.isInteger(score);
}

// Vendor tier validation
export function isValidVendorTier(tier: number): boolean {
  return tier >= 1 && tier <= 3 && Number.isInteger(tier);
}

// Priority validation
export function isValidPriority(priority: string): boolean {
  const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
  return validPriorities.includes(priority);
}

// Status validation
export function isValidStatus(status: string, type: 'vendor' | 'task' | 'evidence' | 'policy'): boolean {
  const statusMap = {
    vendor: ['Active', 'Inactive', 'Under Review', 'Suspended'],
    task: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    evidence: ['Pending', 'Under Review', 'Approved', 'Rejected'],
    policy: ['Draft', 'Active', 'Under Review', 'Archived']
  };
  
  return statusMap[type].includes(status);
}

// Comprehensive validation function
export function validateData(data: Record<string, any>, rules: ValidationRule[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  for (const rule of rules) {
    const value = data[rule.field];
    
    // Required field check
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${rule.field} is required`);
      continue;
    }
    
    // Skip validation if field is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Type validation
    if (rule.type) {
      const typeError = validateType(value, rule.type, rule.field);
      if (typeError) {
        errors.push(typeError);
        continue;
      }
    }
    
    // String length validation
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters long`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${rule.field} must be no more than ${rule.maxLength} characters long`);
      }
    }
    
    // Number range validation
    if (rule.type === 'number' && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push(`${rule.field} must be at least ${rule.min}`);
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push(`${rule.field} must be no more than ${rule.max}`);
      }
    }
    
    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        errors.push(`${rule.field} format is invalid`);
      }
    }
    
    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Type validation helper
function validateType(value: any, type: string, field: string): string | null {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return `${field} must be a string`;
      }
      break;
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return `${field} must be a number`;
      }
      break;
    case 'email':
      if (!isValidEmail(value)) {
        return `${field} must be a valid email address`;
      }
      break;
    case 'url':
      if (!isValidUrl(value)) {
        return `${field} must be a valid URL`;
      }
      break;
    case 'date':
      if (!isValidDate(value)) {
        return `${field} must be a valid date`;
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        return `${field} must be a boolean`;
      }
      break;
  }
  return null;
}

// Sanitization functions
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    return '';
  }
}

// Data validation schemas
export const vendorValidationRules: ValidationRule[] = [
  { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 100 },
  { field: 'legalName', required: true, type: 'string', minLength: 2, maxLength: 200 },
  { field: 'website', required: true, type: 'url' },
  { field: 'industry', required: true, type: 'string', minLength: 2, maxLength: 50 },
  { field: 'score', required: true, type: 'number', min: 0, max: 100, custom: (value) => isValidRiskScore(value) ? null : 'Score must be between 0 and 100' },
  { field: 'tier', required: true, type: 'number', min: 1, max: 3, custom: (value) => isValidVendorTier(value) ? null : 'Tier must be between 1 and 3' },
  { field: 'criticality', required: true, type: 'string', custom: (value) => ['Low', 'Medium', 'High', 'Critical'].includes(value) ? null : 'Criticality must be Low, Medium, High, or Critical' }
];

export const taskValidationRules: ValidationRule[] = [
  { field: 'title', required: true, type: 'string', minLength: 5, maxLength: 200 },
  { field: 'description', required: true, type: 'string', minLength: 10, maxLength: 1000 },
  { field: 'priority', required: true, type: 'string', custom: (value) => isValidPriority(value) ? null : 'Priority must be Low, Medium, High, or Critical' },
  { field: 'assigneeId', required: true, type: 'string', minLength: 1 },
  { field: 'vendorId', required: true, type: 'string', minLength: 1 },
  { field: 'dueDate', required: true, type: 'date' }
];

export const evidenceValidationRules: ValidationRule[] = [
  { field: 'name', required: true, type: 'string', minLength: 5, maxLength: 200 },
  { field: 'type', required: true, type: 'string', minLength: 2, maxLength: 20 },
  { field: 'vendorId', required: true, type: 'string', minLength: 1 },
  { field: 'controlId', required: true, type: 'string', minLength: 1 }
];

// Input sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return sanitizeString(input);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      if (typeof value === 'string') {
        if (key === 'email') {
          sanitized[key] = sanitizeEmail(value);
        } else if (key === 'website' || key === 'url') {
          sanitized[key] = sanitizeUrl(value);
        } else {
          sanitized[key] = sanitizeString(value);
        }
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
  
  return input;
}

// Export validation utilities
export const ValidationUtils = {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isValidDate,
  isValidRiskScore,
  isValidVendorTier,
  isValidPriority,
  isValidStatus,
  validateData,
  sanitizeInput,
  sanitizeString,
  sanitizeEmail,
  sanitizeUrl
};