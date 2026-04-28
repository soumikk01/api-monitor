'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { type ReactNode } from 'react';

/**
 * Client-side providers wrapper.
 * - ThemeProvider: 4 themes (light / dark / dark-blue / system), no flash on load
 * - QueryClientProvider: React Query cache
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      themes={['light', 'dark', 'dark-blue']}
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
