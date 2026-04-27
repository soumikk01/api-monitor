'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { authStorage } from '@/lib/fetchWithAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard — wraps every protected dashboard page.
 *
 * ## Hydration-safe approach
 *
 * `localStorage` is only available in the browser. Reading it synchronously
 * on the first render causes a server/client HTML mismatch because the server
 * always sees `false` while the client sees the real token state.
 *
 * Fix: start with `mounted = false` so both server and client render the same
 * initial output (nothing). After the first client-side paint, `useEffect`
 * fires, we read localStorage, and we decide whether to show children or
 * redirect — all without any mismatch.
 *
 * This means there is a single frame of blank screen on first load, which is
 * invisible in practice because Next.js streaming and the browser paint happen
 * together. Every *subsequent* navigation within the session is instant because
 * the component is already mounted and the second useEffect below fires
 * synchronously with the stored token.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, user } = useAuth();

  // Must be false on first render so server and client HTML match.
  // Updated to the real value in useEffect (client-only).
  const [hasToken, setHasToken] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHasToken(authStorage.hasSession());
    setMounted(true);
  }, []);

  // Redirect when auth resolves with no session
  useEffect(() => {
    if (!mounted) return;
    if (!isLoading && !user && !hasToken) {
      window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL ?? 'http://localhost:3001'}/login`;
    }
  }, [mounted, isLoading, user, hasToken]);

  // ── Before mount: render nothing (matches SSR output perfectly) ──────────
  if (!mounted) return null;

  // ── No token + still loading: redirect is pending, show nothing ──────────
  if (!hasToken && isLoading) return null;

  // ── Auth confirmed failed: redirect already firing ───────────────────────
  if (!isLoading && !user && !hasToken) return null;

  // ── Token exists or auth check still running: render children ───────────
  // Pages render their own skeleton/shimmer while their data loads.
  return <>{children}</>;
}
