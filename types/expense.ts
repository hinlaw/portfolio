// Expense types - migrated from @/apis/accounting/models

export interface ExpenseDTO {
  id: string;
  merchant: string | null;
  amount: number;
  original_amount?: number;
  date: Date | string;
  currency?: string;
  media?: string[];
  description?: string;
  remark?: string;
  workspace_id?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  category?: string;
  tags?: string[];
}

export interface ApiExpenseCreateRequest {
  merchant?: string;
  amount: number;
  original_amount?: number;
  date: string; // ISO date string
  currency?: string;
  media?: string[];
  description?: string;
  remark?: string;
  workspace_id?: string;
}

export interface ApiExpenseUpdateRequest {
  merchant?: string;
  amount?: number;
  original_amount?: number;
  date?: string; // ISO date string
  currency?: string;
  media?: string[];
  description?: string;
  remark?: string;
}

export interface ExpenseStatisticItem {
  date: string;
  amount: number;
  count?: number;
}

export interface WorkspaceDTO {
  id: string;
  name: string;
  currency?: {
    code: string;
    symbol?: string;
  };
}

export interface Response<T> {
  data: T;
  page?: {
    total: number;
    page: number;
    size: number;
  };
  message?: string;
}
