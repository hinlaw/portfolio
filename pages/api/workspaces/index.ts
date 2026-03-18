import { withApiHandler } from '@/api/server/route-handler';
import { WorkspaceService } from '@/services/workspace.service';
import { createWorkspaceBodySchema } from '@/schemas/workspace.schema';

const DEFAULT_OWNER_ID = 'default';

export default withApiHandler({
  GET: async (_req, res) => {
    await WorkspaceService.ensureDefaultWorkspace(DEFAULT_OWNER_ID);
    const workspaces = await WorkspaceService.getWorkspaces(DEFAULT_OWNER_ID);
    res.status(200).json(workspaces);
  },
  POST: async (req, res) => {
    const body = createWorkspaceBodySchema.parse(req.body);
    const workspace = await WorkspaceService.createWorkspace(body, DEFAULT_OWNER_ID);
    res.status(201).json(workspace);
  },
});
