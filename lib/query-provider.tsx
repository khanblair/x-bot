'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000, // 2 minutes - increased to reduce API calls
            gcTime: 15 * 60 * 1000, // 15 minutes - longer cache retention
            refetchOnWindowFocus: false, // Prevent refetch on window focus
            refetchOnMount: false, // Don't refetch if data exists
            retry: 1, // Only retry once to save API calls
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
