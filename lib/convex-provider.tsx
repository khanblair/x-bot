'use client';

import { ReactNode } from 'react';
import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexProvider({ children }: { children: ReactNode }) {
  return (
    <BaseConvexProvider client={convex}>
      {children}
    </BaseConvexProvider>
  );
}
