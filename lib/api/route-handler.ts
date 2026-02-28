import type { NextApiRequest, NextApiResponse } from 'next';

export type ApiRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void> | void;

export interface ApiHandlers {
  GET?: ApiRouteHandler;
  POST?: ApiRouteHandler;
  PATCH?: ApiRouteHandler;
  PUT?: ApiRouteHandler;
  DELETE?: ApiRouteHandler;
}

/**
 * Wraps API route handlers with unified method dispatch and error handling.
 */
export function withApiHandler(
  handlers: ApiHandlers,
  options?: { allowHeaders?: string[] }
): ApiRouteHandler {
  const allowHeaders =
    options?.allowHeaders ??
    Object.keys(handlers).filter((k) => handlers[k as keyof ApiHandlers]);
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const handler = req.method ? handlers[req.method as keyof ApiHandlers] : undefined;
    if (!handler) {
      res.setHeader('Allow', allowHeaders);
      return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.error(`API ${req.method} ${req.url}:`, error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  };
}
