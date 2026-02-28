import { prisma } from '@/lib/prisma';
import { prismaToDTO, timestampToDate } from '@/lib/services/expense-mappers';
import { NotFoundError } from '@/lib/errors';
import type { ExpenseDTO } from '@/types/expense';
import type {
  GetExpensesQuery,
  CreateExpenseBody,
  UpdateExpenseBody,
  GetStatisticsQuery,
} from '@/lib/schemas/expense.schema';

export class ExpenseService {
  static async getExpenses(
    filters: GetExpensesQuery
  ): Promise<{
    data: ExpenseDTO[];
    page: { total: number; page: number; size: number };
  }> {
    const { page, size, keyword, from_date, to_date, min_amount, max_amount, field, asc } =
      filters;

    const where: Record<string, unknown> = {};
    if (keyword) {
      where.OR = [
        { merchant: { contains: keyword, mode: 'insensitive' as const } },
        { description: { contains: keyword, mode: 'insensitive' as const } },
      ];
    }
    const hasFrom = from_date !== undefined && !Number.isNaN(from_date);
    const hasTo = to_date !== undefined && !Number.isNaN(to_date);
    if (hasFrom || hasTo) {
      where.date = {};
      if (hasFrom) (where.date as Record<string, unknown>).gte = timestampToDate(from_date);
      if (hasTo) (where.date as Record<string, unknown>).lte = timestampToDate(to_date);
    }
    const hasMin = min_amount !== undefined && !Number.isNaN(min_amount);
    const hasMax = max_amount !== undefined && !Number.isNaN(max_amount);
    if (hasMin || hasMax) {
      where.amount = {};
      if (hasMin) (where.amount as Record<string, unknown>).gte = min_amount;
      if (hasMax) (where.amount as Record<string, unknown>).lte = max_amount;
    }

    const orderBy: Record<string, string> = { [field]: asc ? 'asc' : 'desc' };

    const [items, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy,
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      data: items.map(prismaToDTO),
      page: { total, page, size },
    };
  }

  static async createExpense(body: CreateExpenseBody): Promise<ExpenseDTO> {
    const dateStr = body.date
      ? timestampToDate(body.date)
      : timestampToDate(Math.floor(Date.now() / 1000));
    const imageUrl =
      Array.isArray(body.media) && body.media.length > 0 ? body.media[0] : '';

    const created = await prisma.expense.create({
      data: {
        merchant: body.merchant ?? null,
        amount: body.amount ?? 0,
        originalAmount: body.original_amount ?? null,
        date: dateStr,
        currency: body.currency ?? 'USD',
        exchangeRate: body.exchange_rate ?? 1,
        imageUrl: imageUrl || null,
        description: body.description ?? null,
        workspaceId: body.workspace_id ?? null,
      },
    });

    return prismaToDTO(created);
  }

  static async getExpenseById(id: string): Promise<ExpenseDTO | null> {
    const row = await prisma.expense.findUnique({ where: { id } });
    return row ? prismaToDTO(row) : null;
  }

  static async updateExpense(id: string, body: UpdateExpenseBody): Promise<ExpenseDTO> {
    const exists = await prisma.expense.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundError('Expense not found');
    }

    const data: Record<string, unknown> = {};
    if (body.merchant !== undefined) data.merchant = body.merchant ?? null;
    if (body.amount !== undefined) data.amount = body.amount ?? 0;
    if (body.original_amount !== undefined) data.originalAmount = body.original_amount ?? null;
    if (body.date !== undefined) data.date = timestampToDate(body.date);
    if (body.currency !== undefined) data.currency = body.currency ?? 'USD';
    if (body.exchange_rate !== undefined) data.exchangeRate = body.exchange_rate ?? 1;
    if (body.media !== undefined)
      data.imageUrl = Array.isArray(body.media) && body.media[0] ? body.media[0] : null;
    if (body.description !== undefined) data.description = body.description ?? null;

    const updated = await prisma.expense.update({
      where: { id },
      data,
    });

    return prismaToDTO(updated);
  }

  static async deleteExpense(id: string): Promise<void> {
    try {
      await prisma.expense.delete({ where: { id } });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new NotFoundError('Expense not found');
      }
      throw error;
    }
  }

  static async getStatistics(
    filters: GetStatisticsQuery
  ): Promise<{ data: Array<{ date: string; amount: number; count: number; transactions: number }> }> {
    const { from_date, to_date, range_type } = filters;
    const fromDate = timestampToDate(from_date);
    const toDate = timestampToDate(to_date);

    const expenses = await prisma.expense.findMany({
      where: {
        date: { gte: fromDate, lte: toDate },
      },
      select: { date: true, amount: true },
    });

    const groupBy: Record<string, { amount: number; count: number }> = {};
    for (const e of expenses) {
      if (!e.date) continue;
      let key: string;
      if (range_type === 'day') {
        key = e.date;
      } else if (range_type === 'month') {
        key = e.date.slice(0, 7);
      } else {
        const [y, m] = e.date.split('-').map(Number);
        const q = Math.ceil(m / 3);
        key = `${y}-Q${q}`;
      }
      if (!groupBy[key]) groupBy[key] = { amount: 0, count: 0 };
      groupBy[key].amount += e.amount ?? 0;
      groupBy[key].count += 1;
    }

    const data = Object.entries(groupBy)
      .map(([date, { amount, count }]) => ({
        date,
        amount: Math.round(amount * 100) / 100,
        count,
        transactions: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { data };
  }
}
