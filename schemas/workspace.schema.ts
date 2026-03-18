import { z } from 'zod';

export const baseCurrencySchema = z.enum(['USD', 'CNY', 'HKD']);

export type BaseCurrencyOption = z.infer<typeof baseCurrencySchema>;

/** Schema for POST /api/workspaces body (create) */
export const createWorkspaceBodySchema = z.object({
  name: z.string().min(1).max(100),
  base_currency: baseCurrencySchema.default('USD'),
});

export type CreateWorkspaceBody = z.infer<typeof createWorkspaceBodySchema>;

/** Schema for PATCH /api/workspaces/[id] body (update) */
export const updateWorkspaceBodySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  base_currency: baseCurrencySchema.optional(),
});

export type UpdateWorkspaceBody = z.infer<typeof updateWorkspaceBodySchema>;
