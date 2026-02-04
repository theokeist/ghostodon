import * as React from 'react';
import { cn } from '../util/cn';

export function Skeleton(props: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--g-radius)] border border-white/10 bg-white/5',
        props.className
      )}
    />
  );
}
