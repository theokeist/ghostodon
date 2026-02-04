import * as React from 'react';
import { cn } from '../util/cn';

type CardTone = 'default' | 'success' | 'warning' | 'danger';

const toneMap: Record<CardTone, string> = {
  default: 'rgba(var(--g-accent), 0.75)',
  success: 'rgba(96, 255, 204, 0.85)',
  warning: 'rgba(255, 198, 93, 0.9)',
  danger: 'rgba(255, 110, 110, 0.9)',
};

export function InfoCard(props: {
  title: string;
  content: React.ReactNode;
  status?: string;
  tone?: CardTone;
  hoverTone?: CardTone;
  className?: string;
  onClick?: () => void;
}) {
  const tone = props.tone ?? 'default';
  const hover = props.hoverTone ?? tone;
  const accent = toneMap[tone];
  const hoverAccent = toneMap[hover];

  return (
    <article
      className={cn(
        'ghost-card relative flex h-full flex-col gap-2 overflow-hidden p-4 text-left transition',
        props.onClick ? 'cursor-pointer hover:opacity-95' : null,
        props.className
      )}
      style={{
        borderColor: accent,
        boxShadow: `0 0 0 1px rgba(0,0,0,0.5) inset, 10px 10px 0 rgba(0,0,0,0.45)`,
      }}
      onClick={props.onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = hoverAccent;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = accent;
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] font-black uppercase tracking-[0.18em] text-white/90">
          {props.title}
        </div>
        {props.status ? (
          <span
            className="rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
            style={{ color: accent, border: `1px solid ${accent}` }}
          >
            {props.status}
          </span>
        ) : null}
      </div>
      <div className="text-[12px] text-white/65">{props.content}</div>
    </article>
  );
}
