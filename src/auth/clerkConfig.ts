// Clerk configuration and key helpers
const STORAGE_KEY = 'ntba.clerk_publishable_key';

/**
 * Validates a Clerk Publishable Key using official Clerk specification:
 * 1. Must start with pk_test_ or pk_live_
 * 2. Cannot contain placeholder markers (e.g. your_, placeholder, here)
 * 3. Has 3 parts delimited by underscore: [pk, test|live, base64_domain$]
 * 4. The 3rd part base64-decodes to a string ending with $ and containing a domain dot
 */
export function isValidClerkKey(key: string | undefined | null): boolean {
  if (!key) return false;
  const trimmed = key.trim();

  // Reject empty or typical placeholder strings
  if (
    trimmed.length < 20 ||
    trimmed.includes('your_') ||
    trimmed.includes('placeholder') ||
    trimmed.includes('your-key') ||
    trimmed.includes('your_publishable_key') ||
    trimmed.includes('your_clerk_publishable_key_here') ||
    trimmed.endsWith('_here')
  ) {
    return false;
  }

  // Check prefix
  if (!trimmed.startsWith('pk_test_') && !trimmed.startsWith('pk_live_')) {
    return false;
  }

  const parts = trimmed.split('_');
  if (parts.length !== 3) {
    return false;
  }

  const encodedPart = parts[2];
  if (!encodedPart) {
    return false;
  }

  try {
    // Decode base64 frontend API endpoint
    const decoded = typeof atob === 'function'
      ? atob(encodedPart)
      : Buffer.from(encodedPart, 'base64').toString('utf-8');

    // Official Clerk validation: ends with '$', no other '$', and contains '.' (domain)
    if (!decoded.endsWith('$')) {
      return false;
    }
    const withoutDollar = decoded.slice(0, -1);
    if (withoutDollar.includes('$') || !withoutDollar.includes('.')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const DEFAULT_CLERK_PUBLISHABLE_KEY = 'pk_test_Y2FyaW5nLXJvb3N0ZXItMjI3Mi5jbGVyay5hY2NvdW50cy5kZXYk';

export function getClerkPublishableKey(): string {
  // 1. Check if user explicitly disconnected Clerk
  try {
    const saved = (localStorage.getItem(STORAGE_KEY) || '').trim();
    if (saved === 'disabled') {
      return '';
    }
    if (saved && isValidClerkKey(saved)) {
      return saved;
    }
    if (saved && !isValidClerkKey(saved)) {
      // Purge invalid placeholder key from storage
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}

  // 2. Check Vite env
  try {
    const envKey = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '').trim();
    if (isValidClerkKey(envKey)) {
      return envKey;
    }
  } catch {}

  // 3. Fall back to user's configured active Clerk key
  if (isValidClerkKey(DEFAULT_CLERK_PUBLISHABLE_KEY)) {
    return DEFAULT_CLERK_PUBLISHABLE_KEY;
  }

  return '';
}

export function saveClerkPublishableKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch {}
}

export function clearClerkPublishableKey(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'disabled');
  } catch {}
}

