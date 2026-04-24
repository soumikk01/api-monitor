// ── Shared TypeScript types used across apps/web, apps/auth, apps/docs ────────

export interface User {
  id: string;
  email: string;
  name?: string;
  sdkToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type ApiCallStatus = 'SUCCESS' | 'CLIENT_ERROR' | 'SERVER_ERROR' | 'PENDING';

export interface ApiCall {
  id: string;
  projectId: string;
  userId: string;
  environmentId?: string;
  method: string;
  url: string;
  host: string;
  path: string;
  requestHeaders?: Record<string, unknown>;
  requestBody?: unknown;
  queryParams?: Record<string, unknown>;
  statusCode?: number;
  statusText?: string;
  responseHeaders?: Record<string, unknown>;
  responseBody?: unknown;
  responseSize?: number;
  latency: number;
  startedAt: string;
  endedAt: string;
  status: ApiCallStatus;
  sdkVersion?: string;
  hostname?: string;
  createdAt: string;
}

export interface ApiStats {
  total: number;
  errorRate: number;    // percentage 0–100
  avgLatency: number;   // milliseconds
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
