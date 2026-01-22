import * as React from 'react';
import { cn } from '../util/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('ghost-input', className)}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
