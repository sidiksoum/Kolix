// src/features/admin/components/MerchantsSection.tsx
import React, { useState } from 'react';
import { Download, X, AlertTriangle } from 'lucide-react';
import { MerchantAdminItem, PlanType, MerchantStatus } from '../types';

interface MerchantsSectionProps {
  merchants: MerchantAdminItem[];
  selectedId: string | null;
  onSelectMerchant: (id: string | null) => void;
  onChangePlan: (id: string, plan: PlanType) => void;
  onExtendTrial: (id: string) => void;
  onToggleSuspend: (id: string) => void;
  onDeleteMerchant: (id: string) => void;
  onExportCsv: () => void;
  filterChip: string;
  onFilterChange: (chip: string) => void;
  searchQuery?: string;
}

export const MerchantsSection: React.FC<MerchantsSectionProps> = ({
  merchants,
  selectedId,
  onSelectMerchant,
  onChangePlan,
  onExtendTrial,
  onToggleSuspend,
  onDeleteMerchant,
  onExportCsv,
  filterChip,
  onFilterChange,
  searchQuery = '',
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const planStyles: Record<PlanType, string> = {
    Start: 'bg-[#ECEAF3] text-[#3A3647]',
    Grow: 'bg-[#EEE9FF] text-[#3F25A8]',
    Pro: 'bg-[#241D5E] text-white',
    Empire: 'bg-[#F5C800] text-[#16131F]',
  };

  const statusStyles: Record<MerchantStatus, string> = {
    Actif: 'bg-[#E3F4EC] text-[#1E5E3F]',
    Essai: 'bg-[#E8EEFB] text-[#1F3F8A]',
    Impayé: 'bg-[#FFF0D6] text-[#6B4100]',
    Suspendu: 'bg-[#FCE3E0] text-[#8A2414]',
  };

  const chips = [
    { id: 'all', label: 'Tous' },
    { id: 'Actif', label: 'Actifs' },
    { id: 'Essai', label: 'En essai' },
    { id: 'Impayé', label: 'Impayés' },
    { id: 'Suspendu', label: 'Suspendus' },
  ];

  // Filtering
  const filtered = merchants.filter((m) => {
    if (filterChip !== 'all' && m.status !== filterChip) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        m.shop.toLowerCase().includes(q) ||
        m.owner.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.domain.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const selectedMerchant = merchants.find((m) => m.id === selectedId);

  const handleDeleteSubmit = () => {
    if (confirmText === 'SUPPRIMER' && selectedMerchant) {
      onDeleteMerchant(selectedMerchant.id);
      setDeleteModalOpen(false);
      setConfirmText('');
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Marchands</h1>
          <p className="text-sm text-[#5E5A70] mt-1 font-medium">
            {filtered.length} comptes affichés · 1 248 au total
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#16131F] border border-[#E2DCF8] rounded-2xl text-xs sm:text-sm font-bold shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#5E5A70]" />
          Exporter (CSV)
        </button>
      </div>

      {/* Chips Filter */}
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const count =
            c.id === 'all'
              ? merchants.length
              : merchants.filter((m) => m.status === c.id).length;
          const isActive = filterChip === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onFilterChange(c.id)}
              className={`text-xs sm:text-sm px-4 py-2 rounded-full transition-all cursor-pointer font-bold ${
                isActive
                  ? 'bg-[#16131F] text-white shadow-sm'
                  : 'bg-white text-[#3A3647] border border-[#E2DCF8] hover:bg-gray-50'
              }`}
            >
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Main Grid: Table + Side Drawer */}
      <div className="flex flex-wrap lg:flex-nowrap gap-5 items-start">
        {/* Table Container */}
        <section className="flex-1 min-w-0 bg-white rounded-[18px] shadow-sm border border-[#EEEAFB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[760px]">
              <thead>
                <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider border-b border-[#F0EDFB]">
                  <th className="py-3.5 px-5 font-bold">Boutique</th>
                  <th className="py-3.5 px-3 font-bold">Pays</th>
                  <th className="py-3.5 px-3 font-bold">Plan</th>
                  <th className="py-3.5 px-3 font-bold">Statut</th>
                  <th className="py-3.5 px-3 font-bold">Inscription</th>
                  <th className="py-3.5 px-3 font-bold text-right">Commandes (30 j)</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDFB]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-xs text-[#8B869C] font-semibold">
                      Aucun marchand ne correspond aux filtres.
                    </td>
                  </tr>
                ) : (
                  filtered.map((m) => {
                    const isSelected = selectedId === m.id;
                    return (
                      <tr
                        key={m.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-[#FAF8FF]' : 'hover:bg-[#FAF9FE]/50'
                        }`}
                      >
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-[#16131F]">{m.shop}</div>
                          <div className="text-xs text-[#5E5A70]">
                            {m.owner} · {m.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-[#3A3647] font-medium">{m.country}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${
                              planStyles[m.plan]
                            }`}
                          >
                            {m.plan}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${
                              statusStyles[m.status]
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-xs text-[#3A3647] whitespace-nowrap">
                          {m.since}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-[#16131F]">
                          {m.orders.toLocaleString('fr-FR')}
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectMerchant(m.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#16131F] hover:bg-[#2E2A3D] text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            Gérer
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Side Drawer: Selected Merchant Profile */}
        {selectedMerchant && (
          <aside
            aria-label="Fiche marchand"
            className="w-full lg:w-[340px] shrink-0 bg-white rounded-[18px] p-6 shadow-xl border border-[#EEEAFB] flex flex-col gap-4 animate-in fade-in"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex flex-col min-w-0">
                <span className="text-xl font-bold text-[#16131F] truncate">
                  {selectedMerchant.shop}
                </span>
                <span className="text-xs text-[#5E5A70] truncate">
                  {selectedMerchant.domain}
                </span>
              </div>
              <button
                onClick={() => onSelectMerchant(null)}
                aria-label="Fermer"
                className="w-8 h-8 rounded-full bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#5E5A70] hover:text-[#16131F] flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  planStyles[selectedMerchant.plan]
                }`}
              >
                {selectedMerchant.plan}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  statusStyles[selectedMerchant.status]
                }`}
              >
                {selectedMerchant.status}
              </span>
            </div>

            {/* Merchant Details Box */}
            <div className="bg-[#F7F5FE] rounded-2xl p-4 flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5E5A70]">Propriétaire</span>
                <strong className="text-[#16131F]">{selectedMerchant.owner}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E5A70]">Téléphone</span>
                <strong className="text-[#16131F]">{selectedMerchant.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E5A70]">Pays</span>
                <strong className="text-[#16131F]">{selectedMerchant.country}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E5A70]">Boutiques</span>
                <strong className="text-[#16131F]">{selectedMerchant.shops}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E5A70]">Commandes (30 j)</span>
                <strong className="text-[#16131F]">{selectedMerchant.orders}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E5A70]">Partenaire référent</span>
                <strong className="text-[#16131F]">{selectedMerchant.ref}</strong>
              </div>
            </div>

            {/* Change Plan */}
            <label className="flex flex-col gap-1.5 text-xs font-bold text-[#5E5A70]">
              Changer de plan
              <select
                value={selectedMerchant.plan}
                onChange={(e) =>
                  onChangePlan(selectedMerchant.id, e.target.value as PlanType)
                }
                className="w-full text-sm font-semibold border border-[#E2DCF8] rounded-xl px-3 py-2.5 bg-white text-[#16131F] outline-none"
              >
                <option value="Start">Start</option>
                <option value="Grow">Grow</option>
                <option value="Pro">Pro</option>
                <option value="Empire">Empire</option>
              </select>
            </label>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onExtendTrial(selectedMerchant.id)}
                className="py-2.5 px-2 bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8] rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Prolonger l’essai (+7 j)
              </button>
              <button
                onClick={() => window.open(`https://${selectedMerchant.domain}`, '_blank')}
                className="py-2.5 px-2 bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8] rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Voir son espace
              </button>
            </div>

            <button
              onClick={() => onToggleSuspend(selectedMerchant.id)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMerchant.status === 'Suspendu'
                  ? 'bg-[#1E5E3F] hover:bg-[#164730] text-white'
                  : 'bg-[#FFF0D6] hover:bg-[#FFE5B8] text-[#6B4100]'
              }`}
            >
              {selectedMerchant.status === 'Suspendu'
                ? 'Réactiver le compte'
                : 'Suspendre le compte'}
            </button>

            <button
              onClick={() => {
                setConfirmText('');
                setDeleteModalOpen(true);
              }}
              className="w-full py-2.5 px-3 bg-transparent hover:bg-red-50 text-[#A3202F] border border-[#F2C4C9] rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Supprimer le compte
            </button>

            <span className="text-[11px] text-[#5E5A70] text-center">
              Chaque action est enregistrée dans le journal d’activité.
            </span>
          </aside>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedMerchant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h2 className="text-lg font-bold text-[#16131F]">
                Supprimer {selectedMerchant.shop} ?
              </h2>
            </div>

            <p className="text-sm text-[#3A3647] leading-relaxed">
              Le compte, ses boutiques, produits et clients seront supprimés définitivement.
              Le solde du Portefeuille doit être à zéro. Tapez <strong>SUPPRIMER</strong> pour
              confirmer.
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Tapez SUPPRIMER"
              className="w-full text-base font-bold border-2 border-[#E2DCF8] focus:border-red-500 rounded-xl px-4 py-3 text-[#16131F] outline-none tracking-widest text-center"
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="py-3 px-4 bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8] rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={confirmText !== 'SUPPRIMER'}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                  confirmText === 'SUPPRIMER'
                    ? 'bg-[#A3202F] hover:bg-[#8A1A26] text-white cursor-pointer shadow-md shadow-red-500/20'
                    : 'bg-[#F2C4C9] text-white cursor-not-allowed'
                }`}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

