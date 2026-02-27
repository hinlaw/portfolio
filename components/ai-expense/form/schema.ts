import { z } from 'zod';

export const createExpenseSchema = (t: (key: string) => string) => {
    return z.object({
        date: z.string().min(1, t('date is required')),
        merchant: z.string().min(1, t('merchant is required')),
        amount: z.number().min(0, t('amount must be non-negative')),
        description: z.string().optional(),
    });
};

export type ExpenseFormData = {
    date: string;
    merchant: string;
    amount: number;
    description?: string;
};
