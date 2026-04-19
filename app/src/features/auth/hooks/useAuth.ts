import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  sdkToken: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      void Promise.resolve().then(() => setState(s => ({ ...s, isLoading: false })));
      return;
    }
    // Validate token by fetching user profile
    fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (!r.ok) throw new Error('Token expired');
        return r.json() as Promise<AuthUser>;
      })
      .then(user => {
        setState({ user, accessToken: token, isAuthenticated: true, isLoading: false });
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json() as { accessToken?: string; refreshToken?: string; message?: string };
    if (!res.ok) throw new Error(data.message ?? 'Login failed');

    // FIX: Validate tokens exist before storing
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    if (!accessToken) throw new Error('Server did not return an access token');

    localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

    // FIX: Check /users/me response before using it
    const userRes = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) throw new Error('Failed to load user profile after login');
    const user = await userRes.json() as AuthUser;

    setState({ user, accessToken, isAuthenticated: true, isLoading: false });
    return user;
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json() as { accessToken?: string; refreshToken?: string; message?: string };
    if (!res.ok) throw new Error(data.message ?? 'Registration failed');

    // FIX: Validate tokens exist before storing
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    if (!accessToken) throw new Error('Server did not return an access token');

    localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    // Clear any stale project from a previous session
    localStorage.removeItem('activeProjectId');

    // FIX: Check /users/me response before using it
    const userRes = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) throw new Error('Failed to load user profile after registration');
    const user = await userRes.json() as AuthUser;

    setState({ user, accessToken, isAuthenticated: true, isLoading: false });
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('activeProjectId'); // clear stale project selection
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  const getCliCommand = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${API}/users/me/command`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // FIX: Throw on HTTP errors instead of silently returning error body
    if (!res.ok) throw new Error('Failed to fetch CLI command');
    return res.json() as Promise<{ command: string; token: string; instructions: string }>;
  }, []);

  return { ...state, login, register, logout, getCliCommand };
}
