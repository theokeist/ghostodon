import * as React from 'react';
import { cn } from '../util/cn';

export function MediaCard(props: {
  title: string;
  description?: string;
  imageUrl: string;
  meta?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'ghost-card relative flex h-full flex-col overflow-hidden',
        props.onClick ? 'cursor-pointer hover:opacity-95' : null,
        props.className
      )}
      onClick={props.onClick}
    >
      <div className="h-40 w-full overflow-hidden border-b border-white/10">
        <img src={props.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-[12px] font-black uppercase tracking-[0.18em] text-white/90">
          {props.title}
        </div>
        {props.description ? <div className="text-[12px] text-white/60">{props.description}</div> : null}
        {props.meta ? <div className="text-[11px] text-white/40">{props.meta}</div> : null}
      </div>
    </article>
  );
}
