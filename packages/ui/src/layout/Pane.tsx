import * as React from 'react';
import { cn } from '../util/cn';

export function Pane(props: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={cn(
        // Styling is driven by CSS tokens in the app (apps/web/src/styles/index.css)
        // so UI can be themed without changing components.
        'ghost-frame ghost-noise flex h-full flex-col overflow-hidden',
        props.className
      )}
    >
      {props.children}
    </section>
  );
}

export function PaneHeader(props: {
  title: string;
  right?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="ghost-pane-header">
      <div className="ghost-pane-head-left">
        <div className="ghost-pane-title">{props.title}</div>
        {props.subtitle ? <div className="ghost-pane-subtitle">{props.subtitle}</div> : null}
      </div>
      <div className="ghost-pane-head-right">{props.right}</div>
    </header>
  );
}

export function PaneBody(props: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('ghost-pane-body', props.className)}>
      {props.children}
    </div>
  );
}
