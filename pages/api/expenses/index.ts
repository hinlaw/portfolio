import { withApiHandler } from '@/lib/api/server/route-handler';
import { ExpenseService } from '@/lib/services/expense.service';
import {
  getExpensesQuerySchema,
  createExpenseBodySchema,
} from '@/lib/schemas/expense.schema';

export default withApiHandler({
  GET: async (req, res) => {
    const filters = getExpensesQuerySchema.parse(req.query);
    const result = await ExpenseService.getExpenses(filters);
    res.status(200).json(result);
  },
  POST: async (req, res) => {
    const body = createExpenseBodySchema.parse(req.body);
    const result = await ExpenseService.createExpense(body);
    res.status(201).json(result);
  },
});
