import { getSupabaseAdmin, SUPABASE_STORAGE_BUCKET } from './supabase';

const DATA_URL_PREFIX = 'data:';
const BASE64_PREFIX = 'base64,';

/** Check if a string is a base64 data URL (e.g. data:image/jpeg;base64,...) */
function isBase64DataUrl(value: string): boolean {
  return (
    typeof value === 'string' &&
    value.startsWith(DATA_URL_PREFIX) &&
    value.includes(BASE64_PREFIX)
  );
}

/** Extract mime type and raw base64 from data URL */
function parseDataUrl(
  dataUrl: string
): { mimeType: string; base64: string } | null {
  const semi = dataUrl.indexOf(';');
  const comma = dataUrl.indexOf(',');
  if (semi === -1 || comma === -1 || comma < semi) return null;
  const mimeType = dataUrl.slice(DATA_URL_PREFIX.length, semi).trim();
  const base64 = dataUrl.slice(comma + 1);
  if (!mimeType || !base64) return null;
  return { mimeType, base64 };
}

/** Get file extension from mime type */
function mimeToExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
  };
  return map[mimeType] ?? 'bin';
}

/**
 * Upload base64 data URL to Supabase Storage and return public URL.
 * Returns null if Supabase is not configured or upload fails.
 */
export async function uploadBase64ToStorage(
  dataUrl: string,
  pathPrefix: string
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  if (!isBase64DataUrl(dataUrl)) return null;

  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  const { mimeType, base64 } = parsed;
  const buffer = Buffer.from(base64, 'base64');
  const ext = mimeToExtension(mimeType);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const path = `${pathPrefix}/${fileName}`;

  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(path, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    console.error('[storage-upload] Upload failed:', error);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
  return publicUrl;
}

/**
 * Process media array: upload base64 items to Storage, keep existing URLs as-is.
 * Returns array of URLs (first one used for imageUrl in schema).
 * When Supabase is not configured, base64 items are returned as-is (fallback).
 */
export async function processMediaForStorage(
  media: string[],
  pathPrefix: string
): Promise<string[]> {
  if (!media || media.length === 0) return [];

  const supabase = getSupabaseAdmin();
  const results: string[] = [];

  for (const item of media) {
    if (isBase64DataUrl(item)) {
      if (supabase) {
        const url = await uploadBase64ToStorage(item, pathPrefix);
        if (url) results.push(url);
      } else {
        // Supabase not configured: keep base64 for backward compat (display still works)
        results.push(item);
      }
    } else if (typeof item === 'string' && (item.startsWith('http') || item.startsWith('data:'))) {
      results.push(item);
    }
  }
  return results;
}
