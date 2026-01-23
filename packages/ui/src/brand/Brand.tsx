import * as React from 'react';
import { cn } from '../util/cn';

/**
 * Minimal branding: small mark + wordmark. No image assets.
 * Accent color is driven by CSS variable --g-accent.
 */
export function BrandMark(props: { className?: string; label?: string }) {
  return (
    <div
      className={cn('ghost-brand-mark', props.className)}
      aria-label={props.label ?? 'Ghostodon'}
      title={props.label ?? 'Ghostodon'}
    >
      <svg className="ghost-brand-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 9a6 6 0 1 1 12 0v9l-3-2-3 2-3-2-3 2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="11" r="1.2" fill="currentColor" />
        <circle cx="14" cy="11" r="1.2" fill="currentColor" />
      </svg>
    </div>
  );
}

export function Wordmark(props: { className?: string; small?: boolean }) {
  return (
    <div
      className={cn(
        'ghost-wordmark',
        props.small ? 'ghost-wordmark--sm' : 'ghost-wordmark--md',
        props.className
      )}
    >
      <span className="text-white/80">GHOST</span>
      <span className="text-[rgba(var(--g-accent),0.95)]">ODON</span>
    </div>
  );
}

export function BrandLockup(props: { className?: string; subtitle?: string }) {
  return (
    <div className={cn('flex items-center gap-2', props.className)}>
      <BrandMark />
      <div className="leading-tight">
        <Wordmark />
        {props.subtitle ? <div className="ghost-subtitle">{props.subtitle}</div> : null}
      </div>
    </div>
  );
}
