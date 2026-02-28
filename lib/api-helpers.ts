/**
 * Helpers to convert between Prisma Expense model and ExpenseDTO
 */
import type { Expense } from './generated/prisma';
import type { ExpenseDTO } from '@/types/expense';

/** Prisma date (YYYY-MM-DD) to Unix timestamp (seconds) */
export function dateToTimestamp(dateStr: string | null): number {
  if (!dateStr) return Math.floor(Date.now() / 1000);
  const d = new Date(dateStr + 'T00:00:00Z');
  return Math.floor(d.getTime() / 1000);
}

/** Unix timestamp to Prisma date (YYYY-MM-DD) */
export function timestampToDate(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toISOString().slice(0, 10);
}

export function prismaToDTO(row: Expense): ExpenseDTO {
  return {
    id: row.id,
    merchant: row.merchant,
    amount: row.amount ?? 0,
    original_amount: row.originalAmount ?? undefined,
    date: dateToTimestamp(row.date),
    currency: row.currency ?? undefined,
    exchange_rate: row.exchangeRate ?? undefined,
    media: row.imageUrl ? [row.imageUrl] : undefined,
    description: row.description ?? undefined,
    workspace_id: row.workspaceId ?? undefined,
  };
}
