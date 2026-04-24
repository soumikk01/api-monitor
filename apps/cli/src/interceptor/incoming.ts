/**
 * incoming.ts — Patches Node.js http.Server prototype to intercept
 * ALL incoming HTTP requests regardless of framework (Express, Fastify, Koa, etc.)
 *
 * Works by hooking Server.prototype.emit for 'request' events and
 * wrapping res.end to capture status code + latency.
 */
import * as http from 'http';
import { getQueue } from './queue';

let patched = false;

export function patchIncomingRequests(): void {
  if (patched) return;
  patched = true;

  const originalEmit = http.Server.prototype.emit as (
    ...args: Parameters<http.Server['emit']>
  ) => boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (http.Server.prototype as any).emit = function (
    event: string,
    req: http.IncomingMessage,
    res: http.ServerResponse,
    ...rest: unknown[]
  ) {
    if (event === 'request' && req && res) {
      const start    = Date.now();
      const method   = req.method ?? 'GET';
      const rawUrl   = req.url ?? '/';
      const host     = (req.headers.host ?? 'localhost').split(':')[0];
      const startedAt = new Date().toISOString();

      // Intercept res.end to grab status + latency
      const originalEnd = res.end.bind(res) as typeof res.end;
      // @ts-expect-error – monkey-patch
      res.end = function (...endArgs: Parameters<typeof res.end>) {
        const latency    = Date.now() - start;
        const statusCode = res.statusCode ?? 200;

        // Skip noise: internal health checks, favicon, socket.io polling
        if (
          !rawUrl.startsWith('/socket.io') &&
          !rawUrl.includes('favicon') &&
          !rawUrl.includes('_next')
        ) {
          getQueue().push({
            method,
            url: `http://${host}${rawUrl}`,
            latency,
            startedAt,
            endedAt: new Date().toISOString(),
            statusCode,
            statusText: statusCode >= 400 ? 'error' : 'success',
          });
        }

        res.end = originalEnd;
        return originalEnd(...endArgs);
      };
    }

    return originalEmit.apply(this, [event, req, res, ...rest]);
  };
}
