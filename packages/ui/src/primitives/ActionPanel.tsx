import * as React from 'react';
import { cn } from '../util/cn';

export function ActionPanel(props: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'ghost-card relative flex flex-col gap-3 overflow-hidden p-4',
        props.onClick ? 'cursor-pointer hover:opacity-95' : null,
        props.className
      )}
      onClick={props.onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-white/90">
            {props.title}
          </div>
          {props.description ? (
            <div className="mt-2 text-[13px] text-white/60">{props.description}</div>
          ) : null}
        </div>
        {props.actions ? <div className="flex shrink-0 items-center gap-2">{props.actions}</div> : null}
      </div>
      {props.children ? <div className="text-[12px] text-white/70">{props.children}</div> : null}
    </section>
  );
}
