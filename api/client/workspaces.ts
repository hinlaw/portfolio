import { apiRequest } from './axios';
import type {
  WorkspaceDTO,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '@/api/types/workspace';

export async function listWorkspaces(): Promise<WorkspaceDTO[]> {
  return apiRequest<WorkspaceDTO[]>('/api/workspaces');
}

export async function getWorkspace(id: string): Promise<WorkspaceDTO | null> {
  try {
    return await apiRequest<WorkspaceDTO>(`/api/workspaces/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

export async function createWorkspace(data: CreateWorkspaceRequest): Promise<WorkspaceDTO> {
  return apiRequest<WorkspaceDTO>('/api/workspaces', {
    method: 'POST',
    data,
  });
}

export async function updateWorkspace(
  id: string,
  data: UpdateWorkspaceRequest
): Promise<WorkspaceDTO> {
  return apiRequest<WorkspaceDTO>(`/api/workspaces/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteWorkspace(id: string): Promise<void> {
  await apiRequest<void>(`/api/workspaces/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
