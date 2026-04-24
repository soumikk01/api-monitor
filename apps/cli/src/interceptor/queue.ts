/**
 * Shared event queue — imported by both the interceptors and the sender.
 * Keeping it in its own file breaks the circular dependency:
 *   axios.ts → sender.ts → axios.ts  ❌
 *   axios.ts → queue.ts ✅   sender.ts → queue.ts ✅
 */
export interface CapturedEvent {
  method: string;
  url: string;
  requestHeaders?: Record<string, string>;
  requestBody?: unknown;
  queryParams?: Record<string, string>;
  statusCode?: number;
  statusText?: string;
  responseHeaders?: Record<string, string>;
  responseBody?: unknown;
  responseSize?: number;
  latency: number;
  startedAt: string;
  endedAt: string;
}

const queue: CapturedEvent[] = [];

export function getQueue(): CapturedEvent[] {
  return queue;
}
