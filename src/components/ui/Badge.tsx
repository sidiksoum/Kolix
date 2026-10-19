import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 
    | 'livree'
    | 'encours'
    | 'reportee'
    | 'annulee'
    | 'contestee'
    | 'injoignable'
    | 'optimal'
    | 'faible'
    | 'critique'
    | 'rupture'
    | 'pro'
    | 'default';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children, ...props }) => {
  const styles: Record<string, string> = {
    // Orders
    livree: 'bg-[#241D5E] text-white',
    encours: 'bg-[#E9E3FD] text-[#3F25A8]',
    reportee: 'bg-[#FFF0D6] text-[#7A4A00]',
    annulee: 'bg-[#ECEAF3] text-[#3A3647]',
    contestee: 'bg-[#FCE3E0] text-[#8A2414]',
    injoignable: 'bg-white text-[#3A3647] border border-[#8B869C]',
    
    // Inventory
    optimal: 'bg-[#E3F9ED] text-[#136637]',
    faible: 'bg-[#FFF0D6] text-[#7A4A00]',
    critique: 'bg-[#FCE3E0] text-[#8A2414]',
    rupture: 'bg-[#F1F0F5] text-[#5E5A70]',

    // Pro pill
    pro: 'bg-white/15 text-white text-[10px] uppercase tracking-wider font-extrabold',
    default: 'bg-[#F4F1FE] text-[#3F25A8]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none whitespace-nowrap',
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
