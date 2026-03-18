import { withApiHandler } from '@/api/server/route-handler';
import { WorkspaceService } from '@/services/workspace.service';
import { updateWorkspaceBodySchema } from '@/schemas/workspace.schema';

const DEFAULT_OWNER_ID = 'default';

export default withApiHandler({
  GET: async (req, res) => {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing workspace id' });
    }
    const workspace = await WorkspaceService.getWorkspaceById(id, DEFAULT_OWNER_ID);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    res.status(200).json(workspace);
  },
  PATCH: async (req, res) => {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing workspace id' });
    }
    const body = updateWorkspaceBodySchema.parse(req.body);
    const workspace = await WorkspaceService.updateWorkspace(
      id,
      body,
      DEFAULT_OWNER_ID
    );
    res.status(200).json(workspace);
  },
  DELETE: async (req, res) => {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing workspace id' });
    }
    await WorkspaceService.deleteWorkspace(id, DEFAULT_OWNER_ID);
    res.status(204).end();
  },
});
