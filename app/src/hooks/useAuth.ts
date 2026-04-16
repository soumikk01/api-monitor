'use client';
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

    localStorage.setItem('access_token', data.accessToken!);
    localStorage.setItem('refresh_token', data.refreshToken!);

    // Load user profile
    const userRes = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
    const user = await userRes.json() as AuthUser;

    setState({ user, accessToken: data.accessToken!, isAuthenticated: true, isLoading: false });
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

    localStorage.setItem('access_token', data.accessToken!);
    localStorage.setItem('refresh_token', data.refreshToken!);

    const userRes = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
    const user = await userRes.json() as AuthUser;

    setState({ user, accessToken: data.accessToken!, isAuthenticated: true, isLoading: false });
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  const getCliCommand = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${API}/users/me/command`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json() as Promise<{ command: string; token: string; instructions: string }>;
  }, []);

  return { ...state, login, register, logout, getCliCommand };
}
