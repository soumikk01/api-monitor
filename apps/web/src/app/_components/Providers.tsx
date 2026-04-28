'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { type ReactNode } from 'react';

/**
 * Client-side providers wrapper.
 * Wraps the entire app so any component can use useQuery/useMutation.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
