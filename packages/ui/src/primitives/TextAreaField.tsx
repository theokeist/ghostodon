import * as React from 'react';
import { cn } from '../util/cn';

export function TextAreaField(props: {
  label: string;
  hint?: string;
  error?: string;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  className?: string;
}) {
  return (
    <label className={cn('flex flex-col gap-2 text-left', props.className)}>
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">{props.label}</span>
      <textarea className="ghost-input min-h-[120px] resize-y" {...props.textareaProps} />
      {props.hint ? <span className="text-[11px] text-white/45">{props.hint}</span> : null}
      {props.error ? <span className="text-[11px] text-red-200">{props.error}</span> : null}
    </label>
  );
}
