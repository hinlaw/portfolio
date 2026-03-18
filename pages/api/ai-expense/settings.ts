import { withApiHandler } from '@/api/server/route-handler';
import { AiExpenseSettingsService } from '@/services/ai-expense-settings.service';
import {
  updateAiExpenseSettingsBodySchema,
  type ReceiptLanguageOption,
} from '@/schemas/ai-expense-settings.schema';

const DEFAULT_OWNER_ID = 'default';

export default withApiHandler({
  GET: async (_req, res) => {
    const result = await AiExpenseSettingsService.getSettings(DEFAULT_OWNER_ID);
    res.status(200).json(result);
  },
  PATCH: async (req, res) => {
    const body = updateAiExpenseSettingsBodySchema.parse(req.body);
    const result = await AiExpenseSettingsService.updateSettings(
      {
        receipt_language: body.receipt_language as ReceiptLanguageOption | undefined,
        preferences: body.preferences,
      },
      DEFAULT_OWNER_ID
    );
    res.status(200).json(result);
  },
});
