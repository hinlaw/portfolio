import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { prismaToDTO, timestampToDate } from '@/lib/api-helpers';
import { withApiHandler } from '@/lib/api/route-handler';
import type { ApiExpenseUpdateRequest } from '@/types/expense';

export default withApiHandler({
  GET: async (req, res) => {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing expense id' });
    }
    const row = await prisma.expense.findUnique({ where: { id } });
    if (!row) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json(prismaToDTO(row));
  },
  PATCH: async (req, res) => {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing expense id' });
    }
    const body = req.body as ApiExpenseUpdateRequest;
    const exists = await prisma.expense.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ error: 'Expense not found' });
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

    res.status(200).json(prismaToDTO(updated));
  },
  DELETE: async (req, res) => {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing expense id' });
    }
    try {
      await prisma.expense.delete({ where: { id } });
      res.status(204).end();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        return res.status(404).json({ error: 'Expense not found' });
      }
      throw error;
    }
  },
});
