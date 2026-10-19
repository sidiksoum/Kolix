import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center w-full">
        <select
          ref={ref}
          className={cn(
            'w-full min-h-[44px] appearance-none rounded-2xl bg-white border border-[#E2DCF8] px-4 pr-10 text-sm font-semibold text-[#16131F] transition-all duration-150 outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10 cursor-pointer',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3.5 w-4 h-4 text-[#5E5A70] pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = 'Select';
