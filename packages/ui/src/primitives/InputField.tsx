import * as React from 'react';
import { cn } from '../util/cn';

export function InputField(props: {
  label: string;
  hint?: string;
  error?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}) {
  return (
    <label className={cn('flex flex-col gap-2 text-left', props.className)}>
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">{props.label}</span>
      <input className="ghost-input" {...props.inputProps} />
      {props.hint ? <span className="text-[11px] text-white/45">{props.hint}</span> : null}
      {props.error ? <span className="text-[11px] text-red-200">{props.error}</span> : null}
    </label>
  );
}
