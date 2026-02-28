import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { prismaToDTO, timestampToDate } from '@/lib/api-helpers';
import { withApiHandler } from '@/lib/api/route-handler';
import type { ApiExpenseCreateRequest } from '@/types/expense';

export default withApiHandler({
  GET: async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const size = Math.min(50, Math.max(1, Number(req.query.size) || 10));
    const keyword = (req.query.keyword as string)?.trim();
    const fromDate = req.query.from_date ? Number(req.query.from_date) : undefined;
    const toDate = req.query.to_date ? Number(req.query.to_date) : undefined;
    const minAmount = req.query.min_amount ? Number(req.query.min_amount) : undefined;
    const maxAmount = req.query.max_amount ? Number(req.query.max_amount) : undefined;
    const field = (req.query.field as string) || 'date';
    const asc = Number(req.query.asc) === 1;

    const where: Record<string, unknown> = {};
    if (keyword) {
      where.OR = [
        { merchant: { contains: keyword, mode: 'insensitive' as const } },
        { description: { contains: keyword, mode: 'insensitive' as const } },
      ];
    }
    const hasFrom = fromDate !== undefined && !Number.isNaN(fromDate);
    const hasTo = toDate !== undefined && !Number.isNaN(toDate);
    if (hasFrom || hasTo) {
      where.date = {};
      if (hasFrom) (where.date as Record<string, unknown>).gte = timestampToDate(fromDate);
      if (hasTo) (where.date as Record<string, unknown>).lte = timestampToDate(toDate);
    }
    const hasMin = minAmount !== undefined && !Number.isNaN(minAmount);
    const hasMax = maxAmount !== undefined && !Number.isNaN(maxAmount);
    if (hasMin || hasMax) {
      where.amount = {};
      if (hasMin) (where.amount as Record<string, unknown>).gte = minAmount;
      if (hasMax) (where.amount as Record<string, unknown>).lte = maxAmount;
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

    res.status(200).json({
      data: items.map(prismaToDTO),
      page: { total, page, size },
    });
  },
  POST: async (req, res) => {
    const body = req.body as ApiExpenseCreateRequest;
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

    res.status(201).json(prismaToDTO(created));
  },
});
