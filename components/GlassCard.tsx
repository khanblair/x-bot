'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${hover ? 'hover:scale-[1.02] hover:shadow-2xl' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
