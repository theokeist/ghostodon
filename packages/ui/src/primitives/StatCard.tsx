import * as React from 'react';
import { cn } from '../util/cn';

export function StatCard(props: {
  label: string;
  value: string;
  helper?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
  className?: string;
}) {
  const tone = props.tone ?? 'default';
  const toneMap: Record<typeof tone, string> = {
    default: 'rgba(var(--g-accent), 0.8)',
    success: 'rgba(96, 255, 204, 0.9)',
    warning: 'rgba(255, 198, 93, 0.9)',
    danger: 'rgba(255, 110, 110, 0.9)',
  };
  const accent = toneMap[tone];

  return (
    <div
      className={cn(
        'ghost-card relative flex flex-col gap-2 overflow-hidden p-3',
        props.onClick ? 'cursor-pointer hover:opacity-95' : null,
        props.className
      )}
      style={{ borderColor: accent }}
      onClick={props.onClick}
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">{props.label}</div>
      <div className="text-[18px] font-black text-white/90">{props.value}</div>
      {props.helper ? <div className="text-[11px] text-white/45">{props.helper}</div> : null}
    </div>
  );
}
