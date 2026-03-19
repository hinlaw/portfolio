import { z } from 'zod';

export const baseCurrencySchema = z.enum(['USD', 'CNY', 'HKD']);

export type BaseCurrencyOption = z.infer<typeof baseCurrencySchema>;

export const receiptLanguageSchema = z.enum(['en', 'zh', 'zh_HK', 'receipt']);

export type ReceiptLanguageOption = z.infer<typeof receiptLanguageSchema>;

/** Schema for POST /api/workspaces body (create) */
export const createWorkspaceBodySchema = z.object({
  name: z.string().min(1).max(100),
  base_currency: baseCurrencySchema.default('USD'),
  receipt_language: receiptLanguageSchema.optional(),
});

export type CreateWorkspaceBody = z.infer<typeof createWorkspaceBodySchema>;

/** Schema for PATCH /api/workspaces/[id] body (update) */
export const updateWorkspaceBodySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  base_currency: baseCurrencySchema.optional(),
  receipt_language: receiptLanguageSchema.optional(),
});

export type UpdateWorkspaceBody = z.infer<typeof updateWorkspaceBodySchema>;
