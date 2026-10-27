import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary: 'bg-emerald-800 text-white hover:bg-emerald-900 active:bg-emerald-950 shadow-sm shadow-emerald-900/10',
      secondary: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300',
      outline: 'border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950 text-gray-700 dark:text-gray-200',
      ghost: 'bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950 text-gray-700 dark:text-gray-200',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
      gold: 'bg-amber-500 text-gray-900 hover:bg-amber-400 font-semibold shadow-sm shadow-amber-500/20',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2 h-10 gap-2',
      lg: 'text-base px-6 py-2.5 h-12 gap-2.5',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
