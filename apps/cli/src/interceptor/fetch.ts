import { startSender } from './sender';
import { getQueue, CapturedEvent } from './queue';

const SEND_EVERY_MS = 500;

/**
 * Patches the global fetch to capture all HTTP calls.
 * Must be called after patchAxios so the queue is already initialized.
 */
export function patchFetch() {
  const originalFetch = globalThis.fetch;
  if (!originalFetch) {
    console.warn('[apio] fetch not available, skipping fetch patch');
    return;
  }

  globalThis.fetch = async function (
    input: string | Request | URL,
    init?: RequestInit,
  ): Promise<Response> {
    const start = Date.now();
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : (input as Request).url;
    const method = (init?.method ?? 'GET').toUpperCase();

    let requestBody: unknown = undefined;
    try {
      if (init?.body && typeof init.body === 'string') {
        requestBody = JSON.parse(init.body);
      }
    } catch { /* not JSON, skip */ }

    try {
      const response = await originalFetch(input, init);
      const end = Date.now();

      // Clone so we can read body without consuming the real stream
      const cloned = response.clone();
      let responseBody: unknown = undefined;
      let responseSize = 0;
      try {
        const text = await cloned.text();
        responseSize = text.length;
        responseBody = JSON.parse(text);
      } catch { /* not JSON */ }

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((v, k) => { responseHeaders[k] = v; });

      const event: CapturedEvent = {
        method,
        url,
        requestHeaders: init?.headers as Record<string, string>,
        requestBody,
        statusCode: response.status,
        statusText: response.statusText,
        responseHeaders,
        responseBody,
        responseSize,
        latency: end - start,
        startedAt: new Date(start).toISOString(),
        endedAt: new Date(end).toISOString(),
      };
      getQueue().push(event);

      return response;
    } catch (err) {
      const end = Date.now();
      const event: CapturedEvent = {
        method,
        url,
        requestHeaders: init?.headers as Record<string, string>,
        requestBody,
        latency: end - start,
        startedAt: new Date(start).toISOString(),
        endedAt: new Date(end).toISOString(),
      };
      getQueue().push(event);
      throw err;
    }
  };

  console.log('[apio] ✅ Fetch interceptor active');
  startSender(SEND_EVERY_MS);
}
