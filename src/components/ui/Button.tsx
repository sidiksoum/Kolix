import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'navy' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] outline-none';

    const variants = {
      primary: 'bg-[#6C4CF1] hover:bg-[#5A3BD8] text-white shadow-kolix-cta hover:shadow-lg',
      secondary: 'bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8]',
      navy: 'bg-[#241D5E] hover:bg-[#1B1640] text-white shadow-kolix-navy',
      outline: 'bg-white hover:bg-[#FAF8FF] text-[#16131F] border border-[#E2DCF8] shadow-kolix-sm',
      ghost: 'bg-transparent hover:bg-[#F4F1FE] text-[#5E5A70] hover:text-[#16131F]',
      danger: 'bg-[#FCE3E0] hover:bg-[#F9CFCB] text-[#8A2414] font-bold',
      gold: 'bg-[#F5C800] hover:bg-[#E0B700] text-[#16131F] shadow-kolix-gold font-extrabold',
    };

    const sizes = {
      sm: 'text-xs px-3 min-h-[36px] rounded-xl gap-1.5',
      md: 'text-sm px-4 min-h-[44px] rounded-2xl gap-2',
      lg: 'text-base px-6 min-h-[50px] rounded-3xl gap-2.5',
      icon: 'w-10 h-10 p-0 rounded-2xl shrink-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
