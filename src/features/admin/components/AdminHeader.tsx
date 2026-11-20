// src/features/admin/components/AdminHeader.tsx
import React from 'react';
import { Search, Menu } from 'lucide-react';

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-8 py-4 bg-white border-b border-[#EEEAFB]">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            aria-label="Ouvrir le menu"
            className="md:hidden p-2 rounded-xl text-[#16131F] hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <label className="flex-1 flex items-center gap-3 bg-[#F4F1FE] rounded-full px-4 min-h-[46px] border border-transparent focus-within:border-[#6C4CF1]/40 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-[#5E5A70] shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un marchand, un téléphone, un partenaire…"
            className="w-full bg-transparent text-sm text-[#16131F] placeholder-[#5E5A70] outline-none border-0"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-[#1E5E3F] bg-[#E3F4EC] rounded-full px-3.5 py-2">
          <span className="w-2 h-2 rounded-full bg-[#2E9E6A] animate-pulse" />
          Tous les services opérationnels
        </span>
      </div>
    </header>
  );
};

