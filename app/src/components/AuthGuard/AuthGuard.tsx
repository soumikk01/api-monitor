'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard — wraps every protected dashboard page.
 *
 * Auth tokens are stored in sessionStorage (per-tab).
 * A new browser tab has an empty sessionStorage, so useAuth returns user=null,
 * and AuthGuard immediately redirects to /login — requiring fresh login per tab.
 *
 * Refreshing the same tab keeps the session alive (sessionStorage persists on F5).
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  // Auth check in progress — render nothing (page shows its own skeleton)
  if (isLoading) return null;

  // Not authenticated — redirect is firing, show nothing to avoid flash
  if (!user) return null;

  return <>{children}</>;
}
