'use client';
import { authStorage } from '@/lib/fetchWithAuth';
import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

function getToken(): string {
  return typeof window !== 'undefined' ? authStorage.getAccessToken() ?? '' : '';
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(path: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const url = path.startsWith('http') ? path : `${API}${path}`;

  const execute = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const token = getToken();
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options?.headers ?? {}),
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText })) as { message?: string };
        throw new Error(err.message ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as T;
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const msg = (err as Error).message;
      setState({ data: null, loading: false, error: msg });
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    void execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { ...state, refetch: execute };
}

/**
 * One-off authenticated request (POST/PUT/DELETE).
 * Returns a function you call imperatively.
 */
export function useApi() {
  const request = useCallback(async <T>(
    path: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
    body?: unknown,
  ): Promise<T> => {
    const token = getToken();
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = await res.json() as T & { message?: string };
    if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);
    return data;
  }, []);

  return { request };
}
