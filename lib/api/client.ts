import { getBaseUrl } from './utils';
import type { ApiError } from './types';

/** Unified fetch wrapper with base URL, error handling, JSON */
export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const base = getBaseUrl();
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(err.error || `API error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
