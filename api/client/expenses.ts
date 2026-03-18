import { apiRequest } from './axios';
import { buildQuery } from './utils';
import type {
  ExpenseDTO,
  ApiExpenseCreateRequest,
  ApiExpenseUpdateRequest,
  ExpenseStatisticItem,
  Response,
} from '@/api/types/expense';
import type { PaginatedResponse } from './types';

export interface ListExpensesParams {
  page?: number;
  size?: number;
  keyword?: string;
  from_date?: number;
  to_date?: number;
  min_amount?: number;
  max_amount?: number;
  field?: string;
  asc?: number;
}

export async function listExpenses(
  params?: ListExpensesParams
): Promise<Response<ExpenseDTO[]>> {
  const q = buildQuery({
    page: params?.page,
    size: params?.size,
    keyword: params?.keyword,
    from_date: params?.from_date,
    to_date: params?.to_date,
    min_amount: params?.min_amount,
    max_amount: params?.max_amount,
    field: params?.field ?? 'date',
    asc: params?.asc ?? 0,
  });
  const path = q ? `/api/expenses?${q}` : '/api/expenses';
  const res = await apiRequest<PaginatedResponse<ExpenseDTO>>(path);
  return {
    data: res.data ?? [],
    page: res.page ?? { total: 0, page: 1, size: 10 },
  };
}

export async function getExpense(id: string): Promise<ExpenseDTO | null> {
  try {
    return await apiRequest<ExpenseDTO>(
      `/api/expenses/${encodeURIComponent(id)}`
    );
  } catch {
    return null;
  }
}

export async function createExpense(
  data: ApiExpenseCreateRequest
): Promise<ExpenseDTO> {
  return apiRequest<ExpenseDTO>('/api/expenses', {
    method: 'POST',
    data,
  });
}

export async function updateExpense(
  id: string,
  data: ApiExpenseUpdateRequest
): Promise<ExpenseDTO> {
  return apiRequest<ExpenseDTO>(
    `/api/expenses/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      data,
    }
  );
}

export async function deleteExpense(id: string): Promise<void> {
  await apiRequest<void>(`/api/expenses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/** AI receipt scanning - synchronous OpenRouter vision API */
export async function scanExpenseReceipt(
  media: string[],
  options?: { locale?: string; useReceiptLanguage?: boolean }
): Promise<Partial<ExpenseDTO>> {
  return apiRequest<Partial<ExpenseDTO>>('/api/expenses/ai/scan', {
    method: 'POST',
    data: {
      media,
      locale: options?.locale,
      useReceiptLanguage: options?.useReceiptLanguage,
    },
  });
}

/** Returns { data: ExpenseStatisticItem[] } - unified format */
export async function getExpenseStatistics(
  fromTimestamp: number,
  toTimestamp: number,
  rangeType: 'day' | 'month' | 'quarter'
): Promise<{ data: ExpenseStatisticItem[] }> {
  const q = buildQuery({
    from_date: fromTimestamp,
    to_date: toTimestamp,
    range_type: rangeType,
  });
  const res = await apiRequest<{ data: ExpenseStatisticItem[] }>(
    `/api/expenses/statistics?${q}`
  );
  const items = (res.data ?? []).map((item) => ({
    ...item,
    transactions: item.transactions ?? item.count ?? 0,
  }));
  return { data: items };
}

export async function getSupportCurrency(): Promise<
  Array<{ code: string; name: string; symbol?: string }>
> {
  return apiRequest('/api/currencies');
}

export async function getExchangeRate(
  from: string,
  to: string
): Promise<{ rate: number }> {
  const q = buildQuery({ from, to });
  return apiRequest<{ rate: number }>(`/api/exchange-rate?${q}`);
}
