import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Layers, Wallet, Store } from 'lucide-react';
import { cn } from '../../utils/cn';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Accueil', path: '/', icon: Home },
    { label: 'Commandes', path: '/commandes', icon: ShoppingBag },
    { label: 'Boutique', path: '/boutique', icon: Store },
    { label: 'Stock', path: '/stock', icon: Layers },
    { label: 'Portefeuille', path: '/portefeuille', icon: Wallet },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#241D5E]/95 backdrop-blur-md text-white border-t border-white/10 px-4 py-2 z-30 flex justify-around items-center">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[11px] font-bold transition-all',
                isActive ? 'text-[#A99BFA]' : 'text-white/60 hover:text-white'
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
