import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Store,
  Tag,
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
  Gift,
  Lock,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export interface NavItemDef {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: 'pro' | 'warn' | 'default';
  locked?: boolean;
}

export const navItems: NavItemDef[] = [
  { label: 'Accueil', path: '/dashboard', icon: Home },
  { label: 'Boutique', path: '/boutique', icon: Store },
  { label: 'Produits', path: '/produits', icon: Tag },
  { label: 'Commandes', path: '/commandes', icon: ShoppingBag, badge: '12' },
  { label: 'Stock', path: '/stock', icon: Layers, badge: '4', badgeColor: 'warn' },
  { label: 'Comptabilité', path: '/comptabilite', icon: FileText },
  { label: 'Portefeuille', path: '/portefeuille', icon: Wallet },
  { label: 'Client', path: '/clients', icon: Users },
  { label: 'WhatsApp Marketing', path: '/whatsapp', icon: MessageSquare, badge: 'PRO', badgeColor: 'pro' },
  { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  { label: 'Partenaire', path: '/partenaires', icon: Gift, locked: true },
  { label: 'Utilisateurs', path: '/utilisateurs', icon: UserCheck },
  { label: 'Paramètres', path: '/parametres', icon: Settings },
];

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = false, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const shop = user?.currentShop || {
    id: '',
    name: 'Ma Boutique',
    domain: 'maboutique.kolix.shop',
    plan: 'Kolix Grow',
    ordersCount: 0,
    maxOrders: 1500
  };

  const userPerms = user?.permissions || ['*'];
  const isOwner = user?.role === 'Propriétaire' || userPerms.includes('*');

  // Filtrer les menus selon les permissions accordées par le propriétaire
  const visibleNavItems = isOwner
    ? navItems
    : navItems.filter(item => userPerms.includes(item.label));

  return (
    <aside
      className={cn(
        'w-[260px] h-screen sticky top-0 left-0 bottom-0 shrink-0 select-none z-40 transition-transform duration-300',
        'bg-[rgb(36_29_94_/_var(--tw-bg-opacity,1))] text-white p-5 sm:p-6 box-border flex flex-col gap-4',
        'overflow-y-auto sidebar-scroll',
        'fixed lg:sticky',
        !isOpen && '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Brand Logo & Subtitle */}
      <div className="flex flex-col gap-0.5 pl-2 shrink-0">
        <NavLink to="/" className="flex items-center gap-1.5 text-[28px] font-extrabold tracking-[-0.04em] text-white no-underline">
          kolix
          <span className="w-2.5 h-2.5 rounded-full bg-white inline-block mt-2.5 shadow-sm" />
        </NavLink>
        <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/80">
          Votre succès, notre mission
        </div>
      </div>

      {/* Current Shop Selector */}
      <button
        type="button"
        className="flex justify-between items-center bg-white/15 hover:bg-white/20 transition-colors text-white border-0 rounded-2xl px-3.5 py-3 text-sm cursor-pointer min-h-[52px] text-left shrink-0"
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <span className="w-8 h-8 rounded-xl bg-[#C93C72] text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">
            S
          </span>
          <div className="min-w-0">
            <span className="text-[10px] text-[#E2DCFF] font-bold block uppercase tracking-wider">Boutique active</span>
            <span className="font-extrabold text-sm truncate block leading-tight">{shop.name}</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 shrink-0 text-white/80" />
      </button>

      {/* Navigation Links */}
      <nav aria-label="Navigation principale" className="flex flex-col gap-1 text-[14px] my-1">
        {visibleNavItems.map((n) => {
          const isActive = location.pathname === n.path || (n.path !== '/dashboard' && location.pathname.startsWith(n.path));
          const Icon = n.icon;

          return (
            <NavLink
              key={n.path}
              to={n.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl no-underline transition-all duration-150',
                isActive
                  ? 'bg-white/20 text-white font-extrabold shadow-sm'
                  : 'text-white/85 hover:text-white hover:bg-white/10 font-semibold'
              )}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="flex-1 truncate">{n.label}</span>
              {n.locked && (
                <span title="Verrouillé" className="inline-flex items-center">
                  <Lock className="w-3.5 h-3.5 text-[#F7B940] shrink-0" />
                </span>
              )}
              {n.badge && (
                <span className={cn(
                  'text-[10px] font-extrabold rounded-full px-2 py-0.5',
                  n.badgeColor === 'pro' && 'bg-white/25 text-white',
                  n.badgeColor === 'warn' && 'bg-[#FFE7B8] text-[#6B4100]',
                  (!n.badgeColor || n.badgeColor === 'default') && 'bg-white/20 text-white'
                )}>
                  {n.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bouton Se déconnecter (remplace la section Votre plan) */}
      <div className="mt-auto pt-4 shrink-0">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2.5 bg-white/10 hover:bg-[#D21034]/25 hover:border-[#D21034]/40 hover:text-white text-white/90 border border-white/10 rounded-2xl py-3 px-4 text-sm font-extrabold transition-all duration-150 cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4 shrink-0 text-[#FF8596]" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
};
