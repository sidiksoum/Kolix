import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, Bell, Menu, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStock } from '../../context/StockContext';

export const Header: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { user } = useAuth();
  const { alerts } = useStock();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, title: 'Nouvelle commande reçue !', desc: 'Aya Kouassi (18 500 FCFA)', time: 'Il y a 10 min' },
    { id: 2, title: 'Paiement Wave validé', desc: 'Commande KX-1047 créditée au portefeuille', time: 'Il y a 45 min' },
    { id: 3, title: 'Stock critique', desc: 'Lisseur céramique Pro : reste 3 unités', time: 'Il y a 2h' },
  ];

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 py-4 px-6 sm:px-9 bg-[#F4F1FE]/85 backdrop-blur-md border-b border-[#E2DCF8]/50 transition-all">
      {/* Mobile Toggle Button */}
      <button
        onClick={onOpenMobileMenu}
        aria-label="Ouvrir le menu"
        className="lg:hidden w-11 h-11 rounded-2xl bg-white shadow-kolix-sm flex items-center justify-center text-[#16131F]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Global Search Input */}
      <div className="flex-1 max-w-[420px] relative">
        <label className="relative flex items-center w-full">
          <Search className="absolute left-4 w-4 h-4 text-[#5E5A70] pointer-events-none" />
          <input
            type="search"
            placeholder="Rechercher une commande, un produit, un client…"
            className="w-full min-h-[46px] rounded-full bg-white text-[#16131F] text-sm pl-11 pr-4 shadow-kolix-sm border border-transparent focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10 outline-none transition-all placeholder:text-[#8B869C]"
          />
        </label>
      </div>

      {/* Right Actions: Stock alert pill, notifications, profile */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Stock Alert Pill */}
        {alerts.length > 0 && (
          <Link
            to="/stock"
            className="flex items-center gap-2 bg-[#FCE3E0] hover:bg-[#F9CFCB] text-[#8A2414] rounded-full px-4 min-h-[44px] text-xs sm:text-[13px] font-extrabold no-underline transition-colors shrink-0 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-[#8A2414] stroke-[2.3]" />
            <span>Stock faible : {alerts.length}</span>
          </Link>
        )}

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            aria-label="Notifications"
            className="relative bg-white hover:bg-[#FAF8FF] w-[46px] h-[46px] rounded-full flex items-center justify-center cursor-pointer shadow-kolix-sm border border-transparent transition-colors"
          >
            <Bell className="w-[18px] h-[18px] text-[#16131F]" />
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] rounded-full bg-[#6C4CF1] text-white text-[11px] font-extrabold flex items-center justify-center px-1">
              {notifications.length}
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-kolix-lg border border-[#E2DCF8] p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center px-3 py-2 border-b border-[#F0EDFB]">
                <span className="font-extrabold text-sm text-[#241D5E]">Notifications</span>
                <span className="text-xs text-[#6C4CF1] font-bold cursor-pointer hover:underline">Tout marquer comme lu</span>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl hover:bg-[#F4F1FE] transition-colors cursor-pointer flex flex-col gap-1">
                    <div className="font-bold text-xs text-[#16131F]">{n.title}</div>
                    <div className="text-[11px] text-[#5E5A70]">{n.desc}</div>
                    <div className="text-[10px] text-[#8B869C]">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Merchant Profile Avatar & Name */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/60 transition-colors cursor-pointer"
          >
            <span className="w-[44px] h-[44px] rounded-full bg-[#241D5E] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm">
              {user.initials}
            </span>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-extrabold text-[#16131F] leading-tight">{user.name}</span>
              <span className="text-xs text-[#5E5A70] font-medium leading-tight">{user.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#5E5A70] hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-kolix-lg border border-[#E2DCF8] p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-[#F0EDFB]">
                <div className="font-bold text-sm text-[#16131F]">{user.name}</div>
                <div className="text-xs text-[#5E5A70] truncate">{user.email}</div>
              </div>
              <div className="flex flex-col gap-1 mt-1 text-sm font-semibold">
                <Link to="/boutique" onClick={() => setShowProfile(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F1FE] text-[#16131F] no-underline">Ma Boutique</Link>
                <Link to="/portefeuille" onClick={() => setShowProfile(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F1FE] text-[#16131F] no-underline">Mon Portefeuille</Link>
                <Link to="/parametres" onClick={() => setShowProfile(false)} className="px-3 py-2 rounded-xl hover:bg-[#F4F1FE] text-[#16131F] no-underline">Paramètres</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
