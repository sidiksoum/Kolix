import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ hoverable = false, className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-[22px] p-5 shadow-kolix transition-all duration-200 border border-transparent',
        hoverable && 'hover:shadow-kolix-md hover:border-[#E2DCF8]/80 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
