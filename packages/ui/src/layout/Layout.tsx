import * as React from 'react';
import { cn } from '../util/cn';

export function Container(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex h-full w-full flex-col', props.className)}>
      {props.children}
    </div>
  );
}

export function Row(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex w-full flex-1 gap-3', props.className)}>{props.children}</div>
  );
}

export function Column(props: {
  children: React.ReactNode;
  className?: string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  resizable?: boolean;
  collapsed?: boolean;
}) {
  const style: React.CSSProperties = {
    width: props.width,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    resize: props.resizable ? 'horizontal' : undefined,
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-auto',
        props.resizable ? 'overflow-auto' : null,
        props.collapsed ? 'w-0 min-w-0 max-w-0 overflow-hidden border-0 p-0' : null,
        props.className
      )}
      style={style}
    >
      {props.children}
    </div>
  );
}
