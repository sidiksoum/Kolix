import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Store,
  ShoppingBag,
  Layers,
  FileText,
  Wallet,
  Users,
  MessageSquare,
  BarChart2,
  UserCheck,
  Sparkles,
  Settings,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export interface NavItemDef {
  label: string;
  path: string;
  icon: React.ElementType;
  locked?: boolean;
}

export const navItems: NavItemDef[] = [
  { label: 'Accueil', path: '/', icon: Home },
  { label: 'Boutique', path: '/boutique', icon: Store },
  { label: 'Commandes', path: '/commandes', icon: ShoppingBag },
  { label: 'Stock', path: '/stock', icon: Layers },
  { label: 'Comptabilité', path: '/comptabilite', icon: FileText },
  { label: 'Portefeuille', path: '/portefeuille', icon: Wallet },
  { label: 'Client', path: '/clients', icon: Users },
  { label: 'WhatsApp Marketing', path: '/whatsapp', icon: MessageSquare, locked: true },
  { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  { label: 'Utilisateurs', path: '/utilisateurs', icon: UserCheck },
  { label: 'Kolix AI', path: '/ai', icon: Sparkles },
  { label: 'Paramètres', path: '/parametres', icon: Settings },
];

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = false, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const percentage = Math.round((user.currentShop.ordersCount / user.currentShop.maxOrders) * 100);

  return (
    <aside
      className={cn(
        'w-[260px] h-screen sticky top-0 left-0 bottom-0 shrink-0 select-none z-40 transition-transform duration-300',
        'bg-[rgb(108_76_241_/_var(--tw-bg-opacity,1))] text-white p-5 sm:p-6 box-border flex flex-col gap-4',
        'overflow-y-auto sidebar-scroll',
        'fixed lg:sticky',
        !isOpen && '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Brand Logo & Subtitle */}
      <div className="flex flex-col gap-0.5 pl-2 shrink-0">
        <div className="flex items-center gap-1.5 text-[28px] font-extrabold tracking-[-0.04em] text-white">
          kolix
          <span className="w-2.5 h-2.5 rounded-full bg-white inline-block mt-2.5 shadow-sm" />
        </div>
        <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/80">
          Espace marchand
        </div>
      </div>

      {/* Current Shop Selector */}
      <button
        type="button"
        className="flex justify-between items-center bg-black/15 hover:bg-black/25 transition-colors text-white border-0 rounded-2xl px-3.5 py-3 text-sm cursor-pointer min-h-[48px] text-left shrink-0"
      >
        <span className="font-bold truncate pr-2">{user.currentShop.name}</span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-80" />
      </button>

      {/* Navigation Links (Scrollable section) */}
      <nav aria-label="Navigation principale" className="flex flex-col gap-1 text-[15px] my-1">
        {navItems.map((n) => {
          const isActive = location.pathname === n.path || (n.path !== '/' && location.pathname.startsWith(n.path));
          const Icon = n.icon;

          return (
            <NavLink
              key={n.path}
              to={n.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl no-underline transition-all duration-150',
                isActive
                  ? 'bg-[#241D5E] text-white font-extrabold shadow-kolix-navy'
                  : 'text-white/85 hover:text-white hover:bg-white/10 font-semibold'
              )}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="flex-1 truncate">{n.label}</span>
              {n.locked && (
                <span className="text-[10px] font-extrabold bg-white/20 text-white rounded-full px-2 py-0.5">
                  PRO
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Plan Card (Kolix Grow) at the bottom */}
      <div className="mt-auto pt-4 shrink-0">
        <div className="bg-[#241D5E] border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-kolix-navy">
          <div className="text-[11px] text-[#BDB5E8] font-bold uppercase tracking-[0.1em]">
            Votre plan
          </div>
          <div className="text-[17px] font-extrabold text-white">{user.currentShop.plan}</div>
          <div className="text-[13px] text-[#D9D3F5]">
            {user.currentShop.ordersCount} / {user.currentShop.maxOrders} commandes ce mois
          </div>
          <div className="h-1.5 bg-white/15 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-[#A99BFA] rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <a
            href="#upgrade"
            className="inline-flex items-center gap-1 text-[13px] font-bold text-white hover:text-[#A99BFA] no-underline mt-1 pt-1 border-t border-white/10"
          >
            Passer à Pro <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>
    </aside>
  );
};
