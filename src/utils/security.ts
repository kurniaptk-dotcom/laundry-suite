/**
 * Security, Cryptography & Data Sanitization Utilities
 * Laundry Suite Multi-Tenant SaaS
 */

/**
 * Hash password with SHA-256 + Salt using native Web Crypto API
 * Safe for modern browsers and Node.js environments
 */
export async function hashPassword(password: string, salt: string = 'laundry-suite-salt-v1'): Promise<string> {
  const text = `${salt}:${password}:${salt}`;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback hash implementation if crypto.subtle is unavailable
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

/**
 * Sanitize user text inputs to prevent HTML/script injection
 */
export function sanitizeString(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

/**
 * Normalize Indonesian phone numbers to standard 08xx or +62 format
 */
export function sanitizePhoneNumber(phone: string | undefined | null): string {
  if (!phone) return '';
  const digitsOnly = phone.replace(/[^0-9+]/g, '');
  if (digitsOnly.startsWith('+62')) {
    return '0' + digitsOnly.slice(3);
  }
  if (digitsOnly.startsWith('62')) {
    return '0' + digitsOnly.slice(2);
  }
  return digitsOnly;
}

/**
 * Validate and sanitize monetary and quantity inputs
 * Prevents negative quantities, NaN, and runaway discount percentages
 */
export function sanitizeMoney(amount: any, fallback: number = 0): number {
  const num = Number(amount);
  if (isNaN(num) || num < 0 || !isFinite(num)) {
    return fallback;
  }
  return Math.round(num);
}

export function sanitizeDiscountPercentage(percent: any): number {
  const num = Number(percent);
  if (isNaN(num) || num < 0) return 0;
  if (num > 100) return 100;
  return num;
}
