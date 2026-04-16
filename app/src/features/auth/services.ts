// Auth service — API calls for login, register, logout
// Re-exports from the useAuth hook for convenience in non-React contexts

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json() as { accessToken?: string; refreshToken?: string; message?: string };
  if (!res.ok) throw new Error(data.message ?? 'Login failed');
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.accessToken!);
    if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
  }
  return data;
}

export async function register(email: string, password: string, name?: string) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json() as { accessToken?: string; refreshToken?: string; message?: string };
  if (!res.ok) throw new Error(data.message ?? 'Registration failed');
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.accessToken!);
    if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);
  }
  return data;
}

export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export async function refreshToken() {
  const rt = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  if (!rt) throw new Error('No refresh token');
  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: rt }),
  });
  const data = await res.json() as { accessToken?: string; message?: string };
  if (!res.ok) throw new Error(data.message ?? 'Token refresh failed');
  if (typeof window !== 'undefined') localStorage.setItem('access_token', data.accessToken!);
  return data;
}
