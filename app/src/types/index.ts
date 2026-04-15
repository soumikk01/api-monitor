export type ApiStatus = 'up' | 'down' | 'degraded' | 'unknown';
export type Theme = 'light' | 'cyberpunk';
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; }
