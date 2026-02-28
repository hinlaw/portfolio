import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { timestampToDate } from '@/lib/api-helpers';
import { withApiHandler } from '@/lib/api/route-handler';

export default withApiHandler({
  GET: async (req, res) => {
    const fromTs = Number(req.query.from_date);
    const toTs = Number(req.query.to_date);
    const rangeType = (req.query.range_type as 'day' | 'month' | 'quarter') || 'day';

    if (!fromTs || !toTs || Number.isNaN(fromTs) || Number.isNaN(toTs)) {
      return res.status(400).json({ error: 'from_date and to_date required' });
    }

    const fromDate = timestampToDate(fromTs);
    const toDate = timestampToDate(toTs);

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
      if (rangeType === 'day') {
        key = e.date;
      } else if (rangeType === 'month') {
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

    res.status(200).json({ data });
  },
});
