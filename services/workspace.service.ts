import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/lib/errors';
import type {
  CreateWorkspaceBody,
  UpdateWorkspaceBody,
} from '@/schemas/workspace.schema';

const DEFAULT_OWNER_ID = 'default';

export interface WorkspaceDTO {
  id: string;
  name: string;
  base_currency: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

function prismaToDTO(row: {
  id: string;
  name: string;
  baseCurrency: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}): WorkspaceDTO {
  return {
    id: row.id,
    name: row.name,
    base_currency: row.baseCurrency,
    owner_id: row.ownerId,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

export class WorkspaceService {
  static async getWorkspaces(ownerId: string = DEFAULT_OWNER_ID): Promise<WorkspaceDTO[]> {
    const rows = await prisma.workspace.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(prismaToDTO);
  }

  /**
   * Ensure at least one workspace exists for the owner.
   * If none exist, creates a default "Personal" (USD) workspace.
   * Migrates any expenses with null workspaceId to that workspace.
   */
  static async ensureDefaultWorkspace(ownerId: string = DEFAULT_OWNER_ID): Promise<WorkspaceDTO> {
    let existing = await prisma.workspace.findFirst({
      where: { ownerId },
    });
    if (!existing) {
      existing = await prisma.workspace.create({
        data: {
          name: 'Personal',
          baseCurrency: 'USD',
          ownerId,
        },
      });
    }
    // Migrate orphan expenses (workspaceId null) to this workspace (one-time)
    const orphanCount = await prisma.expense.count({ where: { workspaceId: null } });
    if (orphanCount > 0) {
      await prisma.expense.updateMany({
        where: { workspaceId: null },
        data: { workspaceId: existing.id },
      });
    }
    return prismaToDTO(existing);
  }

  static async createWorkspace(
    body: CreateWorkspaceBody,
    ownerId: string = DEFAULT_OWNER_ID
  ): Promise<WorkspaceDTO> {
    const row = await prisma.workspace.create({
      data: {
        name: body.name,
        baseCurrency: body.base_currency,
        ownerId,
      },
    });
    return prismaToDTO(row);
  }

  static async getWorkspaceById(
    id: string,
    ownerId: string = DEFAULT_OWNER_ID
  ): Promise<WorkspaceDTO | null> {
    const row = await prisma.workspace.findFirst({
      where: { id, ownerId },
    });
    return row ? prismaToDTO(row) : null;
  }

  static async updateWorkspace(
    id: string,
    body: UpdateWorkspaceBody,
    ownerId: string = DEFAULT_OWNER_ID
  ): Promise<WorkspaceDTO> {
    const exists = await prisma.workspace.findFirst({
      where: { id, ownerId },
    });
    if (!exists) {
      throw new NotFoundError('Workspace not found');
    }

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.base_currency !== undefined) data.baseCurrency = body.base_currency;

    if (Object.keys(data).length === 0) {
      return prismaToDTO(exists);
    }

    const row = await prisma.workspace.update({
      where: { id },
      data,
    });
    return prismaToDTO(row);
  }

  static async deleteWorkspace(
    id: string,
    ownerId: string = DEFAULT_OWNER_ID
  ): Promise<void> {
    const exists = await prisma.workspace.findFirst({
      where: { id, ownerId },
    });
    if (!exists) {
      throw new NotFoundError('Workspace not found');
    }

    await prisma.workspace.delete({
      where: { id },
    });
  }
}
