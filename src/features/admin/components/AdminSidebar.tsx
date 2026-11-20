// src/features/admin/components/AdminSidebar.tsx
import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  CreditCard, 
  FileText, 
  LogOut,
  X,
  ExternalLink
} from 'lucide-react';
import { AdminSection } from '../types';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (sec: AdminSection) => void;
  pendingCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  pendingCount = 4,
  mobileOpen = false,
  onCloseMobile,
  onLogout
}) => {
  const navItems = [
    { id: 'overview' as AdminSection, label: 'Vue d’ensemble', icon: LayoutDashboard },
    { id: 'merchants' as AdminSection, label: 'Marchands', icon: Store },
    { id: 'partners' as AdminSection, label: 'Partenaires', icon: Users },
    { id: 'withdraw' as AdminSection, label: 'Retraits', icon: CreditCard, badge: pendingCount },
    { id: 'log' as AdminSection, label: 'Journal d’activité', icon: FileText },
  ];

  const content = (
    <div className="flex flex-col h-full gap-6">
      {/* Brand Header */}
      <div className="flex items-center justify-between pl-2">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#6C4CF1] text-white flex items-center justify-center text-2xl font-black shadow-md shadow-[#6C4CF1]/30">
            K
          </span>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-white leading-tight">Kolix</span>
            <span className="text-[10px] font-extrabold tracking-[0.16em] text-[#F5C800]">
              ADMINISTRATION
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="md:hidden text-white/70 hover:text-white p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav aria-label="Administration" className="flex flex-col gap-1.5 text-[15px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectSection(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all cursor-pointer text-left min-h-[46px] w-full ${
                isActive
                  ? 'bg-[#6C4CF1] text-white font-bold shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[11px] font-extrabold bg-[#F5C800] text-[#16131F] rounded-full px-2 py-0.5 shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="mt-auto border-t border-[#2E2A3D] pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 pl-1">
          <span className="w-10 h-10 rounded-full bg-[#2E2A3D] text-white flex items-center justify-center text-sm font-bold shrink-0">
            SS
          </span>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-bold text-white truncate">Souleymane Sanogo</span>
            <span className="text-xs text-[#BDB5E8] truncate">Super administrateur</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <a
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Espace marchand
          </a>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Déconnexion admin"
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 bg-[#16131F] text-white p-6 min-h-screen box-border">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex">
          <aside className="w-[280px] bg-[#16131F] text-white p-6 h-full flex flex-col animate-in slide-in-from-left duration-200">
            {content}
          </aside>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};

