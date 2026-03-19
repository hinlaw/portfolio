export type ReceiptLanguageOption = 'en' | 'zh' | 'zh_HK' | 'receipt';

export interface WorkspaceDTO {
  id: string;
  name: string;
  base_currency: string;
  receipt_language: ReceiptLanguageOption;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  base_currency?: 'USD' | 'CNY' | 'HKD';
  receipt_language?: ReceiptLanguageOption;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  base_currency?: 'USD' | 'CNY' | 'HKD';
  receipt_language?: ReceiptLanguageOption;
}
