import * as React from 'react';
import { cn } from '../util/cn';

export function Heading(props: {
  children: React.ReactNode;
  size?: 'xl' | 'lg' | 'md' | 'sm';
  className?: string;
}) {
  const sizeClass = {
    xl: 'text-[28px] md:text-[32px]',
    lg: 'text-[22px] md:text-[26px]',
    md: 'text-[18px] md:text-[20px]',
    sm: 'text-[14px] md:text-[16px]',
  }[props.size ?? 'lg'];

  return (
    <h2
      className={cn(
        'font-black uppercase tracking-[0.2em] text-white/90',
        sizeClass,
        props.className
      )}
    >
      {props.children}
    </h2>
  );
}

export function Kicker(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('text-[11px] uppercase tracking-[0.22em] text-white/60', props.className)}>
      {props.children}
    </div>
  );
}

export function BodyText(props: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-[13px] text-white/65', props.className)}>{props.children}</p>;
}

export function Caption(props: { children: React.ReactNode; className?: string }) {
  return <span className={cn('text-[11px] text-white/45', props.className)}>{props.children}</span>;
}
