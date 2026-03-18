export interface WorkspaceDTO {
  id: string;
  name: string;
  base_currency: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  base_currency?: 'USD' | 'CNY' | 'HKD';
}

export interface UpdateWorkspaceRequest {
  name?: string;
  base_currency?: 'USD' | 'CNY' | 'HKD';
}
