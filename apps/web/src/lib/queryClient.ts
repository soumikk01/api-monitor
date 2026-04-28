import { QueryClient } from '@tanstack/react-query';

/**
 * Singleton QueryClient — shared across the entire app.
 * - staleTime: 5 min for project/service metadata (rarely changes)
 * - gcTime: 10 min (keep in memory after unmount)
 * - retry: 1 (don't hammer the server on auth errors)
 * - retryDelay: exponential back-off, max 10s
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,           // 5 minutes — use cache before refetching
      gcTime: 10 * 60 * 1000,             // 10 minutes — keep in memory after unmount
      retry: 1,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
      refetchOnWindowFocus: false,         // don't spam API on tab switch
      refetchOnMount: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
