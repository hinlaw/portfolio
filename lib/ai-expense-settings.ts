import type { ReceiptLanguageOption } from '@/schemas/ai-expense-settings.schema';

export type { ReceiptLanguageOption };

export interface AiExpenseSettingsResponse {
  receipt_language: string;
  preferences?: Record<string, unknown>;
}

export async function fetchAiExpenseSettings(): Promise<AiExpenseSettingsResponse> {
  const res = await fetch('/api/ai-expense/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateAiExpenseSettings(body: {
  receipt_language?: ReceiptLanguageOption;
  preferences?: Record<string, unknown>;
}): Promise<AiExpenseSettingsResponse> {
  const res = await fetch('/api/ai-expense/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

/** Fallback when API unavailable (SSR or before fetch). Use fallbackLocale for default. */
export function getDefaultReceiptLanguage(fallbackLocale: string): ReceiptLanguageOption {
  return ['en', 'zh', 'zh_HK'].includes(fallbackLocale)
    ? (fallbackLocale as ReceiptLanguageOption)
    : 'en';
}
