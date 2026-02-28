import { withApiHandler } from '@/lib/api/route-handler';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$' },
];

export default withApiHandler({
  GET: async (_req, res) => res.status(200).json(CURRENCIES),
});
