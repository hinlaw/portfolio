import { withApiHandler } from '@/api/server/route-handler';
import { ExpenseService } from '@/services/expense.service';
import {
  getExpenseByIdParamsSchema,
  updateExpenseBodySchema,
} from '@/schemas/expense.schema';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

export default withApiHandler({
  GET: async (req, res) => {
    const { id } = getExpenseByIdParamsSchema.parse({ id: req.query.id });
    const result = await ExpenseService.getExpenseById(id);
    if (!result) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(200).json(result);
  },
  PATCH: async (req, res) => {
    const { id } = getExpenseByIdParamsSchema.parse({ id: req.query.id });
    const body = updateExpenseBodySchema.parse(req.body);
    const result = await ExpenseService.updateExpense(id, body);
    res.status(200).json(result);
  },
  DELETE: async (req, res) => {
    const { id } = getExpenseByIdParamsSchema.parse({ id: req.query.id });
    await ExpenseService.deleteExpense(id);
    res.status(204).end();
  },
});
