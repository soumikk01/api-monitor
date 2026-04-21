import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth, ensureValidToken, authStorage } from '@/lib/fetchWithAuth';

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

  // ── On mount: restore session from sessionStorage (per-tab) ───────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // ensureValidToken reads from sessionStorage — empty in a new tab
      const validToken = await ensureValidToken();

      if (!validToken) {
        if (!cancelled) {
          setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        }
        return;
      }

      try {
        const res = await fetch(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${validToken}` },
        });
        if (!res.ok) throw new Error('Failed to load profile');
        const user = await res.json() as AuthUser;
        if (!cancelled) {
          setState({ user, accessToken: validToken, isAuthenticated: true, isLoading: false });
        }
      } catch {
        if (!cancelled) {
          authStorage.clear();
          setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json() as {
      accessToken?: string;
      refreshToken?: string;
      message?: string;
    };
    if (!res.ok) throw new Error(data.message ?? 'Login failed');

    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    if (!accessToken) throw new Error('Server did not return an access token');

    // Store in sessionStorage — isolated to this tab only
    authStorage.setAccessToken(accessToken);
    if (refreshToken) authStorage.setRefreshToken(refreshToken);

    const userRes = await fetchWithAuth(`${API}/users/me`);
    if (!userRes.ok) throw new Error('Failed to load user profile after login');
    const user = await userRes.json() as AuthUser;

    setState({ user, accessToken, isAuthenticated: true, isLoading: false });
    return user;
  }, []);

  // ── Register ───────────────────────────────────────────────────────────
  const register = useCallback(async (email: string, password: string, name?: string) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json() as {
      accessToken?: string;
      refreshToken?: string;
      message?: string;
    };
    if (!res.ok) throw new Error(data.message ?? 'Registration failed');

    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    if (!accessToken) throw new Error('Server did not return an access token');

    authStorage.setAccessToken(accessToken);
    if (refreshToken) authStorage.setRefreshToken(refreshToken);

    const userRes = await fetchWithAuth(`${API}/users/me`);
    if (!userRes.ok) throw new Error('Failed to load user profile after registration');
    const user = await userRes.json() as AuthUser;

    setState({ user, accessToken, isAuthenticated: true, isLoading: false });
    return user;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    authStorage.clear();
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  // ── Get CLI command (uses auto-refresh) ───────────────────────────────
  const getCliCommand = useCallback(async () => {
    const res = await fetchWithAuth(`${API}/users/me/command`);
    if (!res.ok) throw new Error('Failed to fetch CLI command');
    return res.json() as Promise<{ command: string; token: string; instructions: string }>;
  }, []);

  return { ...state, login, register, logout, getCliCommand };
}
