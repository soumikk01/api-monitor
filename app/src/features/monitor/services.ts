// Monitor service — fetch API endpoint statuses from backend

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

function getToken(): string {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') ?? '' : '';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects() {
  const res = await fetch(`${API}/projects`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json() as Promise<{ id: string; name: string; description?: string; createdAt: string }[]>;
}

export async function createProject(name: string, description?: string) {
  const res = await fetch(`${API}/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json() as Promise<{ id: string; name: string }>;
}

// ─── History ─────────────────────────────────────────────────────────────────

export async function getHistory(projectId: string, page = 1, limit = 50) {
  const params = new URLSearchParams({ projectId, page: String(page), limit: String(limit) });
  const res = await fetch(`${API}/history?${params}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json() as Promise<{
    data: {
      id: string; method: string; url: string; host: string; path: string;
      statusCode?: number; latency: number; status: string; createdAt: string;
    }[];
    meta: { total: number; page: number; totalPages: number };
  }>;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getAnalyticsSummary(projectId: string, range = '24h') {
  const res = await fetch(`${API}/analytics/summary?projectId=${projectId}&range=${range}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json() as Promise<{
    total: number; errorRate: number; successRate: number; avgLatency: number;
  }>;
}

export async function getEndpointBreakdown(projectId: string) {
  const res = await fetch(`${API}/analytics/endpoints?projectId=${projectId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch endpoint analytics');
  return res.json() as Promise<{ endpoint: string; count: number; errorRate: number; avgLatency: number }[]>;
}

// ─── CLI Command ──────────────────────────────────────────────────────────────

export async function getCliCommand() {
  const res = await fetch(`${API}/users/me/command`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch CLI command');
  return res.json() as Promise<{ command: string; token: string; instructions: string }>;
}
