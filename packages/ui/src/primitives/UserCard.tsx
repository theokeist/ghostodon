import * as React from 'react';
import { cn } from '../util/cn';

export function UserCard(props: {
  name: string;
  handle?: string;
  avatarUrl?: string;
  summary?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'ghost-card relative flex flex-col gap-3 overflow-hidden p-4 text-left',
        props.onClick ? 'cursor-pointer hover:opacity-95' : null,
        props.className
      )}
      onClick={props.onClick}
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-[var(--g-radius)] border border-white/15 bg-black/30">
          {props.avatarUrl ? (
            <img src={props.avatarUrl} alt="" className="h-full w-full rounded-[var(--g-radius)] object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-black uppercase tracking-[0.16em] text-white/90 truncate">
            {props.name}
          </div>
          {props.handle ? <div className="text-[12px] text-white/55 truncate">@{props.handle}</div> : null}
          {props.summary ? <div className="mt-2 text-[12px] text-white/60">{props.summary}</div> : null}
        </div>
      </div>
      {props.actions ? <div className="flex flex-wrap items-center gap-2">{props.actions}</div> : null}
    </article>
  );
}
