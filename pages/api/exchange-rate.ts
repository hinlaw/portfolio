import { withApiHandler } from '@/lib/api/route-handler';

const RATES: Record<string, number> = {
  USD: 1,
  CNY: 0.14,
  HKD: 0.128,
};

export default withApiHandler({
  GET: async (req, res) => {
    const from = (req.query.from as string) || 'USD';
    const to = (req.query.to as string) || 'USD';
    const rate = (RATES[to] ?? 1) / (RATES[from] ?? 1);
    res.status(200).json({ rate });
  },
});
