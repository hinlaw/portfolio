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
    return { receipt_language: receiptLanguage, preferences };
  }

  static async updateSettings(
    body: { receipt_language?: ReceiptLanguageOption; preferences?: Record<string, unknown> },
    ownerId: string = DEFAULT_OWNER_ID
  ) {
    const data: Record<string, unknown> = {};
    if (body.receipt_language !== undefined) {
      data.receiptLanguage = body.receipt_language;
    }
    if (body.preferences !== undefined) {
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
        preferences: (body.preferences ?? {}) as object,
      },
      update: data,
    });
    const receiptLanguage = (row.receiptLanguage ?? 'en') as ReceiptLanguageOption;
    const preferences = (row.preferences as Record<string, unknown>) ?? {};
    return { receipt_language: receiptLanguage, preferences };
  }
}
