// API stub functions - temporary placeholders until real API is implemented
import { ExpenseDTO, ApiExpenseCreateRequest, ApiExpenseUpdateRequest, ExpenseStatisticItem, Response } from '@/types/expense';

// Stub for listExpenses
export async function listExpenses(params?: {
  page?: number;
  size?: number;
  keyword?: string;
  from_date?: string;
  to_date?: string;
  min_amount?: number;
  max_amount?: number;
  field?: string;
  asc?: number;
}): Promise<Response<ExpenseDTO[]>> {
  // Return empty list for now
  return {
    data: [],
    page: {
      total: 0,
      page: params?.page || 1,
      size: params?.size || 10,
    },
  };
}

// Stub for getExpense
export async function getExpense(id: string): Promise<ExpenseDTO | null> {
  return null;
}

// Stub for deleteExpense
export async function deleteExpense(id: string): Promise<void> {
  // No-op
}

// Stub for updateExpense
export async function updateExpense(id: string, data: ApiExpenseUpdateRequest): Promise<ExpenseDTO> {
  const now = Math.floor(Date.now() / 1000);
  return {
    id,
    merchant: data.merchant ?? null,
    amount: data.amount ?? 0,
    original_amount: data.original_amount,
    date: data.date ?? now,
    currency: data.currency,
    exchange_rate: data.exchange_rate,
    media: data.media,
    description: data.description,
  };
}

// Stub for createExpense
export async function createExpense(data: ApiExpenseCreateRequest): Promise<ExpenseDTO> {
  const now = Math.floor(Date.now() / 1000);
  return {
    id: `stub-${Date.now()}`,
    merchant: data.merchant ?? null,
    amount: data.amount ?? 0,
    original_amount: data.original_amount,
    date: data.date ?? now,
    currency: data.currency,
    exchange_rate: data.exchange_rate,
    media: data.media,
    description: data.description,
    workspace_id: data.workspace_id,
  };
}

// Stub for createExpenseAiJob - accepts base64 media strings
export async function createExpenseAiJob(media: string[]): Promise<{ job_id: string }> {
  return { job_id: `stub-job-${Date.now()}` };
}

// Stub for getExpenseAiJob
export async function getExpenseAiJob(jobId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: ExpenseDTO;
  error?: string;
}> {
  return { status: 'pending' };
}

// Stub for getExpenseStatistics
export async function getExpenseStatistics(params: {
  from_date: string;
  to_date: string;
  range_type: 'day' | 'month' | 'quarter';
}): Promise<ExpenseStatisticItem[]> {
  return [];
}

// Stub for getSupportCurrency
export async function getSupportCurrency(): Promise<Array<{ code: string; name: string; symbol?: string }>> {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$' },
  ];
}

// Stub for getExchangeRate
export async function getExchangeRate(from: string, to: string): Promise<{ rate: number }> {
  // Return 1.0 as default (no conversion)
  return { rate: 1.0 };
}
