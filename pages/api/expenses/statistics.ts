import { withApiHandler } from '@/api/server/route-handler';
import { ExpenseService } from '@/lib/services/expense.service';
import { getStatisticsQuerySchema } from '@/lib/schemas/expense.schema';

export default withApiHandler({
  GET: async (req, res) => {
    const filters = getStatisticsQuerySchema.parse(req.query);
    const result = await ExpenseService.getStatistics(filters);
    res.status(200).json(result);
  },
});
