import * as React from 'react';
import { cn } from '../util/cn';

export function AvatarButton(props: {
  src: string;
  alt?: string;
  label?: string;
  meta?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        'ghost-card relative flex items-center gap-3 overflow-hidden px-3 py-2 text-left',
        props.onClick ? 'cursor-pointer hover:opacity-95' : null,
        props.className
      )}
      onClick={props.onClick}
    >
      <img
        src={props.src}
        alt={props.alt ?? ''}
        className="h-10 w-10 rounded-[var(--g-radius)] border border-white/15 bg-black/30 object-cover"
        loading="lazy"
      />
      <div className="min-w-0">
        <div className="text-[12px] font-black uppercase tracking-[0.16em] text-white/85 truncate">
          {props.label ?? 'User'}
        </div>
        {props.meta ? <div className="text-[11px] text-white/45 truncate">{props.meta}</div> : null}
      </div>
    </button>
  );
}
