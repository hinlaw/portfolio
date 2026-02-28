/** Base URL for API requests (empty for same-origin, or env for SSR) */
export function getBaseUrl(): string {
  return typeof window !== 'undefined'
    ? ''
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/** Build query string from params, omitting undefined and null */
export function buildQuery(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (entries.length === 0) return '';
  const q = new URLSearchParams();
  for (const [k, v] of entries) {
    q.set(k, String(v));
  }
  return q.toString();
}
