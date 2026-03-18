/**
 * Mock API implementations for Jest tests.
 * Provides realistic test data for UI components when real API is unavailable.
 */
import {
  ExpenseDTO,
  ApiExpenseCreateRequest,
  ApiExpenseUpdateRequest,
  ExpenseStatisticItem,
  Response,
} from '@/api/types/expense';

// In-memory store for test data
const mockExpenses: ExpenseDTO[] = [
  {
    id: 'exp-1',
    merchant: 'Starbucks',
    amount: 45.5,
    date: Math.floor(Date.now() / 1000) - 86400 * 2,
    currency: 'USD',
    description: 'Morning coffee',
  },
  {
    id: 'exp-2',
    merchant: 'Grocery Store',
    amount: 128.99,
    date: Math.floor(Date.now() / 1000) - 86400,
    currency: 'USD',
    description: 'Weekly groceries',
  },
  {
    id: 'exp-3',
    merchant: 'Restaurant',
    amount: 89.0,
    date: Math.floor(Date.now() / 1000),
    currency: 'USD',
    description: 'Dinner with friends',
  },
];

let expenses = [...mockExpenses];

export function resetMockExpenses() {
  expenses = [...mockExpenses];
}

export const listExpenses = jest.fn(
  async (params: {
    workspace_id: string;
    page?: number;
    size?: number;
    keyword?: string;
    from_date?: number;
    to_date?: number;
    min_amount?: number;
    max_amount?: number;
    field?: string;
    asc?: number;
  }): Promise<Response<ExpenseDTO[]>> => {
    const page = params?.page ?? 1;
    const size = params?.size ?? 10;
    const start = (page - 1) * size;
    const filtered = expenses.slice(start, start + size);
    return {
      data: filtered,
      page: {
        total: expenses.length,
        page,
        size,
      },
    };
  }
);

export const getExpense = jest.fn(async (id: string): Promise<ExpenseDTO | null> => {
  return expenses.find((e) => e.id === id) ?? null;
});

export const deleteExpense = jest.fn(async (id: string): Promise<void> => {
  expenses = expenses.filter((e) => e.id !== id);
});

export const updateExpense = jest.fn(
  async (id: string, data: ApiExpenseUpdateRequest): Promise<ExpenseDTO> => {
    const idx = expenses.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Expense not found');
    const updated: ExpenseDTO = {
      ...expenses[idx],
      ...data,
      id: expenses[idx].id,
    };
    expenses[idx] = updated;
    return updated;
  }
);

export const createExpense = jest.fn(
  async (data: ApiExpenseCreateRequest): Promise<ExpenseDTO> => {
    const newExpense: ExpenseDTO = {
      id: `exp-${Date.now()}`,
      merchant: data.merchant ?? null,
      amount: data.amount ?? 0,
      original_amount: data.original_amount,
      date: data.date ?? Math.floor(Date.now() / 1000),
      currency: data.currency,
      exchange_rate: data.exchange_rate,
      media: data.media,
      description: data.description,
      workspace_id: data.workspace_id,
    };
    expenses.push(newExpense);
    return newExpense;
  }
);

export const scanExpenseReceipt = jest.fn(
  async (_media: string[]): Promise<Partial<ExpenseDTO>> => {
    return {
      merchant: 'AI Scanned Merchant',
      amount: 50.0,
      date: Math.floor(Date.now() / 1000),
      description: 'Mock scanned receipt',
    };
  }
);

export const getExpenseStatistics = jest.fn(
  async (
    _workspaceId: string,
    _fromTimestamp: number,
    _toTimestamp: number,
    _rangeType: 'day' | 'month' | 'quarter'
  ): Promise<{ data: ExpenseStatisticItem[] }> => {
    const items: ExpenseStatisticItem[] = [
      { date: '2025-02-01', amount: 150, count: 3, transactions: 3 },
      { date: '2025-02-02', amount: 89, count: 1, transactions: 1 },
      { date: '2025-02-03', amount: 45.5, count: 1, transactions: 1 },
    ];
    return { data: items };
  }
);

export const getSupportCurrency = jest.fn(
  async (): Promise<Array<{ code: string; name: string; symbol?: string }>> => {
    return [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
      { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$' },
    ];
  }
);

export const getExchangeRate = jest.fn(
  async (_from: string, _to: string): Promise<{ rate: number }> => {
    return { rate: 1.0 };
  }
);
