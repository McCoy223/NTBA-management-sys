// Clerk configuration and key helpers
const STORAGE_KEY = 'ntba.clerk_publishable_key';

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

export function isValidClerkKey(key: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  return (
    (trimmed.startsWith('pk_test_') || trimmed.startsWith('pk_live_')) &&
    trimmed.length > 20
  );
}

export function saveClerkPublishableKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch {}
}

export function clearClerkPublishableKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
