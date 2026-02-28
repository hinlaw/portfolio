import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import { NotFoundError } from '@/lib/errors';

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

function formatZodError(error: ZodError): string {
  const issues = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
  return issues || 'Validation failed';
}

/**
 * Wraps API route handlers with unified method dispatch and error handling.
 * Returns 400 for Zod validation errors, 500 for other errors.
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
      if (error instanceof ZodError) {
        return res.status(400).json({ error: formatZodError(error) });
      }
      if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error(`API ${req.method} ${req.url}:`, error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  };
}
