import * as React from 'react';
import { cn } from '../util/cn';

export function UploadButton(props: {
  label: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: FileList | null) => void;
  className?: string;
}) {
  const id = React.useId();

  return (
    <div className={cn('flex flex-col gap-2 text-left', props.className)}>
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">{props.label}</span>
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="ghost-btn ghost-btn--default cursor-pointer">
          Upload
        </label>
        {props.hint ? <span className="text-[11px] text-white/45">{props.hint}</span> : null}
      </div>
      <input
        id={id}
        type="file"
        className="hidden"
        accept={props.accept}
        multiple={props.multiple}
        onChange={(e) => props.onFiles?.(e.target.files)}
      />
    </div>
  );
}
