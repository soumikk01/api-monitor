export interface Endpoint { id: string; url: string; status: 'up' | 'down' | 'degraded'; latency: number; }
