import { z } from 'zod';

export const receiptLanguageSchema = z.enum(['en', 'zh', 'zh_HK', 'receipt']);

export type ReceiptLanguageOption = z.infer<typeof receiptLanguageSchema>;

/** Base currency options - once set, cannot be changed */
export const baseCurrencySchema = z.enum(['USD', 'CNY', 'HKD']);

export type BaseCurrencyOption = z.infer<typeof baseCurrencySchema>;

/** Schema for PATCH /api/ai-expense/settings body */
export const updateAiExpenseSettingsBodySchema = z.object({
  receipt_language: receiptLanguageSchema.optional(),
  base_currency: baseCurrencySchema.optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateAiExpenseSettingsBody = z.infer<
  typeof updateAiExpenseSettingsBodySchema
>;

export interface AiExpenseSettingsDTO {
  receipt_language: string;
  base_currency?: string;
  preferences?: Record<string, unknown>;
}
