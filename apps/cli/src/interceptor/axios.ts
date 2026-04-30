import axios from 'axios';
import { startSender } from './sender';
import { getQueue, CapturedEvent } from './queue';

const SEND_EVERY_MS = 500;

export function patchAxios() {
  // Request interceptor — record start time
  axios.interceptors.request.use((config) => {
    (config as unknown as Record<string, unknown>)['_monitorStart'] = Date.now();
    return config;
  });

  // Response interceptor — build event and queue it
  axios.interceptors.response.use(
    (response) => {
      const start: number =
        (response.config as unknown as Record<string, unknown>)['_monitorStart'] as number ??
        Date.now();
      const end = Date.now();

      // Parse URL for query params
      let queryParams: Record<string, string> | undefined;
      try {
        const url = new URL(response.config.url ?? '', response.config.baseURL);
        const params: Record<string, string> = {};
        url.searchParams.forEach((v, k) => { params[k] = v; });
        if (Object.keys(params).length) queryParams = params;
      } catch { /* ignore */ }

      const event: CapturedEvent = {
        method: response.config.method?.toUpperCase() ?? 'GET',
        url: response.config.url ?? '',
        requestHeaders: response.config.headers as Record<string, string>,
        requestBody: response.config.data,
        queryParams,
        statusCode: response.status,
        statusText: response.statusText,
        responseHeaders: response.headers as Record<string, string>,
        responseBody: response.data,
        responseSize: JSON.stringify(response.data).length,
        latency: end - start,
        startedAt: new Date(start).toISOString(),
        endedAt: new Date(end).toISOString(),
      };
      getQueue().push(event);
      return response;
    },
    (error) => {
      if (error.config) {
        const start: number =
          (error.config as unknown as Record<string, unknown>)['_monitorStart'] as number ??
          Date.now();
        const end = Date.now();
        const event: CapturedEvent = {
          method: error.config.method?.toUpperCase() ?? 'GET',
          url: error.config.url ?? '',
          requestHeaders: error.config.headers,
          requestBody: error.config.data,
          statusCode: error.response?.status,
          statusText: error.response?.statusText,
          responseHeaders: error.response?.headers,
          responseBody: error.response?.data,
          latency: end - start,
          startedAt: new Date(start).toISOString(),
          endedAt: new Date(end).toISOString(),
        };
        getQueue().push(event);
      }
      return Promise.reject(error as unknown);
    },
  );

  console.log('[apio] ✅ Axios interceptor active');
  startSender(SEND_EVERY_MS);
}
