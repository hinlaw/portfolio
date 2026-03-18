import { prisma } from '@/lib/prisma';
import type { ReceiptLanguageOption } from '@/schemas/ai-expense-settings.schema';

const DEFAULT_OWNER_ID = 'default';

export class AiExpenseSettingsService {
  static async getSettings(ownerId: string = DEFAULT_OWNER_ID) {
    const row = await prisma.aiExpenseSettings.findUnique({
      where: { ownerId },
    });
    const receiptLanguage = (row?.receiptLanguage ?? 'en') as ReceiptLanguageOption;
    const preferences = (row?.preferences as Record<string, unknown>) ?? {};
    const base_currency = preferences.base_currency as string | undefined;
    return { receipt_language: receiptLanguage, base_currency, preferences };
  }

  static async updateSettings(
    body: {
      receipt_language?: ReceiptLanguageOption;
      base_currency?: string;
      preferences?: Record<string, unknown>;
    },
    ownerId: string = DEFAULT_OWNER_ID
  ) {
    const data: Record<string, unknown> = {};
    if (body.receipt_language !== undefined) {
      data.receiptLanguage = body.receipt_language;
    }

    // Base currency: only set on first time, then locked forever
    if (body.base_currency !== undefined) {
      const existing = await prisma.aiExpenseSettings.findUnique({
        where: { ownerId },
      });
      const existingPrefs = (existing?.preferences as Record<string, unknown>) ?? {};
      if (existingPrefs.base_currency != null && existingPrefs.base_currency !== '') {
        // Already set - locked, ignore update
      } else {
        // First-time set - merge into preferences (preserve any other prefs from body)
        const restPrefs = (body.preferences ?? existingPrefs) as Record<string, unknown>;
        data.preferences = { ...restPrefs, base_currency: body.base_currency };
      }
    }

    if (body.preferences !== undefined && !('preferences' in data)) {
      data.preferences = body.preferences;
    }

    if (Object.keys(data).length === 0) {
      return this.getSettings(ownerId);
    }

    const row = await prisma.aiExpenseSettings.upsert({
      where: { ownerId },
      create: {
        ownerId,
        receiptLanguage: body.receipt_language ?? 'en',
        preferences: ((data.preferences ?? body.preferences ?? {}) as object),
      },
      update: data,
    });
    const receiptLanguage = (row.receiptLanguage ?? 'en') as ReceiptLanguageOption;
    const preferences = (row.preferences as Record<string, unknown>) ?? {};
    const base_currency = preferences.base_currency as string | undefined;
    return { receipt_language: receiptLanguage, base_currency, preferences };
  }
}
