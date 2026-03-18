import { z } from 'zod';

export const receiptLanguageSchema = z.enum(['en', 'zh', 'zh_HK', 'receipt']);

export type ReceiptLanguageOption = z.infer<typeof receiptLanguageSchema>;

/** Schema for PATCH /api/ai-expense/settings body */
export const updateAiExpenseSettingsBodySchema = z.object({
  receipt_language: receiptLanguageSchema.optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateAiExpenseSettingsBody = z.infer<
  typeof updateAiExpenseSettingsBodySchema
>;

export interface AiExpenseSettingsDTO {
  receipt_language: string;
  preferences?: Record<string, unknown>;
}
