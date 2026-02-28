import { z } from 'zod';

/** Coerce query string to number, default to fallback if invalid/empty */
const queryNumber = (fallback: number) =>
  z
    .union([z.string(), z.number()])
    .transform((v) => (v === '' || v === undefined ? fallback : Number(v)))
    .pipe(z.number().finite());

/** Coerce query string to optional number */
const queryOptionalNumber = () =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === '' || v === undefined) return undefined;
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    });

const orderFieldSchema = z.enum(['date', 'amount', 'merchant']).default('date');
const rangeTypeSchema = z.enum(['day', 'month', 'quarter']).default('day');

/** Schema for GET /api/expenses query params */
export const getExpensesQuerySchema = z.object({
  page: queryNumber(1).pipe(z.number().min(1)),
  size: queryNumber(10).pipe(z.number().min(1).max(50)),
  keyword: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (typeof v === 'string' ? v : v?.[0] ?? '')?.trim() || undefined),
  from_date: queryOptionalNumber(),
  to_date: queryOptionalNumber(),
  min_amount: queryOptionalNumber(),
  max_amount: queryOptionalNumber(),
  field: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => {
      const s = typeof v === 'string' ? v : v?.[0];
      const parsed = orderFieldSchema.safeParse(s);
      return parsed.success ? parsed.data : 'date';
    }),
  asc: z
    .union([z.string(), z.number(), z.boolean()])
    .optional()
    .transform((v) => Number(v) === 1 || v === '1' || v === true),
});

export type GetExpensesQuery = z.infer<typeof getExpensesQuerySchema>;

/** Schema for POST /api/expenses body (create) */
export const createExpenseBodySchema = z.object({
  merchant: z.string().optional(),
  amount: z.coerce.number().min(0),
  original_amount: z.coerce.number().optional(),
  date: z.coerce.number().int().nonnegative().optional(),
  currency: z.string().default('USD'),
  exchange_rate: z.coerce.number().positive().default(1),
  media: z.array(z.string()).optional(),
  description: z.string().optional(),
  workspace_id: z.string().optional(),
});

export type CreateExpenseBody = z.infer<typeof createExpenseBodySchema>;

/** Schema for PATCH /api/expenses/[id] body (update) */
export const updateExpenseBodySchema = z.object({
  merchant: z.string().nullable().optional(),
  amount: z.coerce.number().min(0).optional(),
  original_amount: z.coerce.number().nullable().optional(),
  date: z.coerce.number().int().nonnegative().optional(),
  currency: z.string().optional(),
  exchange_rate: z.coerce.number().positive().optional(),
  media: z.array(z.string()).optional(),
  description: z.string().nullable().optional(),
});

export type UpdateExpenseBody = z.infer<typeof updateExpenseBodySchema>;

/** Schema for GET /api/expenses/[id] - just needs id (from req.query) */
export const getExpenseByIdParamsSchema = z.object({
  id: z.string().min(1, 'Missing expense id'),
});

/** Schema for GET /api/expenses/statistics query params */
export const getStatisticsQuerySchema = z.object({
  from_date: z.preprocess(
    (v) => (Array.isArray(v) ? v[0] : v),
    z.union([z.string(), z.number()]).transform((x) => Number(x)).pipe(z.number().finite())
  ),
  to_date: z.preprocess(
    (v) => (Array.isArray(v) ? v[0] : v),
    z.union([z.string(), z.number()]).transform((x) => Number(x)).pipe(z.number().finite())
  ),
  range_type: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => {
      const s = typeof v === 'string' ? v : v?.[0];
      const parsed = rangeTypeSchema.safeParse(s);
      return parsed.success ? parsed.data : 'day';
    }),
});

export type GetStatisticsQuery = z.infer<typeof getStatisticsQuerySchema>;
