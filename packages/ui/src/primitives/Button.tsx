import * as React from 'react';
import { cn } from '../util/cn';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    // Styling is primarily CSS-driven (apps/web/src/styles/index.css) so themes can
    // swap without rewriting components.
    const base = 'ghost-btn inline-flex items-center justify-center select-none';
    const variants: Record<string, string> = {
      default: 'ghost-btn--default',
      ghost: 'ghost-btn--ghost',
      danger: 'ghost-btn--danger',
    };
    const sizes: Record<string, string> = {
      sm: 'ghost-btn--sm',
      md: 'ghost-btn--md',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
