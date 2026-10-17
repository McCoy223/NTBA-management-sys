// Clerk configuration and key helpers
const STORAGE_KEY = 'ntba.clerk_publishable_key';

export function isValidClerkKey(key: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();

  // Reject placeholder values commonly found in template envs
  if (
    trimmed.includes('your_clerk') ||
    trimmed.includes('your-clerk') ||
    trimmed.includes('placeholder') ||
    trimmed.includes('example') ||
    trimmed.includes('xxx') ||
    trimmed.includes('<') ||
    trimmed.includes('>') ||
    trimmed.endsWith('_here')
  ) {
    return false;
  }

  // Must follow the format pk_test_<base64> or pk_live_<base64>
  const parts = trimmed.split('_');
  if (parts.length !== 3) return false;
  const [prefix, envType, encodedPart] = parts;
  if (prefix !== 'pk' || (envType !== 'test' && envType !== 'live') || !encodedPart) {
    return false;
  }

  // Verify the base64 encoded frontend-api host part
  try {
    const raw = encodedPart.endsWith('$') ? encodedPart.slice(0, -1) : encodedPart;
    if (!/^[A-Za-z0-9+/=]+$/.test(raw)) return false;
    const decoded = typeof atob === 'function' ? atob(raw) : Buffer.from(raw, 'base64').toString('utf-8');
    if (!decoded || !decoded.includes('.') || decoded.length < 3) return false;
    return true;
  } catch {
    return false;
  }
}

export function getClerkPublishableKey(): string {
  // 1. Check Vite env
  const envKey = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '').trim();
  if (envKey && isValidClerkKey(envKey)) {
    return envKey;
  }

  // 2. Check localStorage
  try {
    const saved = (localStorage.getItem(STORAGE_KEY) || '').trim();
    if (saved && isValidClerkKey(saved)) {
      return saved;
    }
  } catch {}

  return '';
}

export function saveClerkPublishableKey(key: string): void {
  try {
    if (isValidClerkKey(key)) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export function clearClerkPublishableKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

