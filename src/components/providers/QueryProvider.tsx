'use client';

import * as React from 'react';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5분 동안 신선한 데이터로 간주
            gcTime: 1000 * 60 * 30, // 30분 동안 가비지 컬렉션 보관
            refetchOnWindowFocus: false, // 탭 전환 시 불필요한 재요청 방지 (Firestore 비용 절감)
            retry: 1,
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
