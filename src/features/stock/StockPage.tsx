import React, { useState } from 'react';
import { useStock } from '../../context/StockContext';
import { InventoryItem, StockStatus } from '../../types/inventory';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { 
  Layers, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Download, 
  Search, 
  RefreshCw,
  TrendingUp,
  DollarSign,
  PackageX
} from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const StockPage: React.FC = () => {
  const {
    inventory,
    kpis,
    alerts,
    threshold,
    updateQuantity,
    updateThreshold
  } = useStock();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItemForUpdate, setSelectedItemForUpdate] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<string>('10');

  const filtered = inventory
    .filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Calculate Table Totals
  const totalQ = filtered.reduce((s, i) => s + i.q, 0);
  const totalQV = filtered.reduce((s, i) => s + i.qv, 0);
  const totalQR = filtered.reduce((s, i) => s + i.qr, 0);
  const grandTotalCost = filtered.reduce((s, i) => s + i.total, 0);

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForUpdate) return;
    const qty = parseInt(restockAmount, 10);
    if (isNaN(qty) || qty === 0) return;

    await updateQuantity(selectedItemForUpdate.id, qty);
    setSelectedItemForUpdate(null);
    setRestockAmount('10');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Stock
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Suivez votre stock en temps réel et anticipez les ruptures pour vos livreurs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => toast.success('Export du journal d’inventaire téléchargé')}
            className="rounded-full shadow-kolix-sm"
          >
            <Download className="w-4 h-4 mr-1 text-[#5E5A70]" />
            Exporter
          </Button>
          <Button
            variant="primary"
            onClick={() => setSelectedItemForUpdate(inventory[0] || null)}
            className="rounded-full shadow-kolix-cta"
          >
            <Plus className="w-4 h-4 mr-1" />
            Mettre à jour un stock
          </Button>
        </div>
      </div>

      {/* 5 Stock KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-[22px] p-5 flex flex-col gap-2.5 shadow-kolix">
          <span className="w-10 h-10 rounded-2xl bg-[#E9E3FD] text-[#4B2FC9] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </span>
          <span className="text-2xl font-extrabold text-[#241D5E]">
            {formatNumber(kpis?.totalValue || 0)} FCFA
          </span>
          <span className="text-xs text-[#5E5A70] font-bold">Valeur totale du stock</span>
        </div>

        <div className="bg-white rounded-[22px] p-5 flex flex-col gap-2.5 shadow-kolix">
          <span className="w-10 h-10 rounded-2xl bg-[#FCE3E0] text-[#8A2414] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </span>
          <span className="text-2xl font-extrabold text-[#D6304A]">
            {kpis?.underThresholdCount || 0}
          </span>
          <span className="text-xs text-[#5E5A70] font-bold">Produits sous le seuil</span>
        </div>

        <div className="bg-white rounded-[22px] p-5 flex flex-col gap-2.5 shadow-kolix">
          <span className="w-10 h-10 rounded-2xl bg-[#E3EEFF] text-[#1F4FA8] flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </span>
          <span className="text-2xl font-extrabold text-[#241D5E]">
            {kpis?.pendingRestockCount || 0}
          </span>
          <span className="text-xs text-[#5E5A70] font-bold">Réappro. en attente</span>
        </div>

        <div className="bg-white rounded-[22px] p-5 flex flex-col gap-2.5 shadow-kolix">
          <span className="w-10 h-10 rounded-2xl bg-[#E9E3FD] text-[#4B2FC9] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </span>
          <span className="text-2xl font-extrabold text-[#241D5E]">
            {kpis?.turnoverRate || '84 %'}
          </span>
          <span className="text-xs text-[#5E5A70] font-bold">Taux de rotation</span>
        </div>

        <div className="bg-white rounded-[22px] p-5 flex flex-col gap-2.5 shadow-kolix">
          <span className="w-10 h-10 rounded-2xl bg-[#F1F0F5] text-[#5E5A70] flex items-center justify-center">
            <PackageX className="w-5 h-5" />
          </span>
          <span className="text-2xl font-extrabold text-[#16131F]">
            {kpis?.outOfStockCount || 0}
          </span>
          <span className="text-xs text-[#5E5A70] font-bold">Ruptures de stock</span>
        </div>
      </div>

      {/* Alerts + Threshold Configurator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left: Low Stock Alerts Box with Red border accent */}
        <section className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-kolix border-t-4 border-t-[#D6304A] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D6304A]" />
              <h2 className="text-lg font-extrabold text-[#241D5E]">Alertes stock faible</h2>
            </div>
            <span className="text-xs text-[#5E5A70] font-semibold">
              Aussi visibles dans le header et l’Accueil
            </span>
          </div>

          <div className="flex flex-col divide-y divide-[#F0EDFB]">
            {alerts.map(a => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-3">
                <Badge variant={a.status === 'Rupture' ? 'rupture' : a.status === 'Critique' ? 'critique' : 'faible'}>
                  {a.status}
                </Badge>
                <span className="flex-1 font-extrabold text-sm text-[#16131F] truncate">
                  {a.name}
                </span>
                <span className="text-xs text-[#3A3647]">
                  QR : <strong>{a.qr}</strong> / seuil {a.seuil}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const item = inventory.find(i => i.id === a.id);
                    if (item) setSelectedItemForUpdate(item);
                  }}
                  className="rounded-xl text-xs font-bold"
                >
                  Réapprovisionner
                </Button>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="py-6 text-center text-sm font-bold text-emerald-700">
                Aucun produit sous le seuil. Tous les stocks sont optimaux !
              </div>
            )}
          </div>
        </section>

        {/* Right: Threshold Configurator Widget */}
        <section className="bg-white rounded-3xl p-6 shadow-kolix flex flex-col gap-3 justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#241D5E]">Seuil d’alerte global</h2>
            <p className="text-xs text-[#3A3647] mt-1 leading-relaxed">
              L’alerte « Stock faible » se déclenche quand la quantité restante (QR) atteint ce seuil.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 py-3 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8]/60 my-2">
            <button
              onClick={() => updateThreshold(threshold - 1)}
              disabled={threshold <= 1}
              className="w-12 h-12 rounded-xl bg-white hover:bg-[#F4F1FE] text-[#241D5E] border border-[#E2DCF8] font-extrabold text-xl flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer shadow-sm"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#3F25A8] tracking-tight">
                {threshold}
              </span>
              <span className="text-[11px] font-bold text-[#5E5A70]">unités</span>
            </div>
            <button
              onClick={() => updateThreshold(threshold + 1)}
              className="w-12 h-12 rounded-xl bg-white hover:bg-[#F4F1FE] text-[#241D5E] border border-[#E2DCF8] font-extrabold text-xl flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <span className="text-[11px] text-[#5E5A70] text-center">
            Seuil appliqué à l’ensemble des références COD.
          </span>
        </section>
      </div>

      {/* Comprehensive Inventory Table */}
      <section className="bg-white rounded-3xl shadow-kolix border border-[#E2DCF8]/60 overflow-hidden flex flex-col">
        {/* Table Filter Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 p-4 border-b border-[#F0EDFB]">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Rechercher par nom de produit…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'Optimal', 'Faible', 'Critique', 'Rupture'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer',
                  statusFilter === st
                    ? 'bg-[#241D5E] text-white shadow-sm'
                    : 'bg-[#F4F1FE] text-[#5E5A70] hover:text-[#16131F]'
                )}
              >
                {st === 'all' ? 'Tous' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="text-xs text-[#5E5A70] uppercase tracking-wider bg-[#FAF9FE] border-b border-[#F0EDFB]">
                <th className="py-3 px-4 font-bold">N°</th>
                <th className="py-3 px-3 font-bold">Nom du produit</th>
                <th className="py-3 px-3 font-bold text-right" title="Quantité initiale">Q</th>
                <th className="py-3 px-3 font-bold text-right" title="Quantité vendue">QV</th>
                <th className="py-3 px-3 font-bold" title="Quantité restante">QR (Restant)</th>
                <th className="py-3 px-3 font-bold">Statut</th>
                <th className="py-3 px-3 font-bold text-right">Prix unitaire</th>
                <th className="py-3 px-3 font-bold text-right">Coût total</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {filtered.map(item => {
                const qrPercentage = Math.min(100, Math.round((item.qr / item.q) * 100));
                const barColor = item.status === 'Rupture' ? 'bg-[#8B869C]' : item.status === 'Critique' ? 'bg-[#D6304A]' : item.status === 'Faible' ? 'bg-[#E0A33A]' : 'bg-[#6C4CF1]';

                return (
                  <tr key={item.id} className="hover:bg-[#FAF8FF] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#5E5A70]">{item.num}</td>
                    <td className="py-3.5 px-3 font-bold text-[#16131F]">{item.name}</td>
                    <td className="py-3.5 px-3 text-right font-medium text-[#5E5A70]">{item.q}</td>
                    <td className="py-3.5 px-3 text-right font-medium text-[#16131F]">{item.qv}</td>
                    <td className="py-3.5 px-3 min-w-[140px]">
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-[#16131F] text-xs w-6">{item.qr}</span>
                        <div className="flex-1 h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-300', barColor)}
                            style={{ width: `${qrPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={item.status === 'Optimal' ? 'optimal' : item.status === 'Rupture' ? 'rupture' : item.status === 'Critique' ? 'critique' : 'faible'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap text-xs font-semibold text-[#5E5A70]">
                      {formatFCFA(item.pu)}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-extrabold text-[#241D5E]">
                      {formatFCFA(item.total)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedItemForUpdate(item)}
                        className="rounded-xl text-xs font-bold"
                      >
                        Mettre à jour
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#FAF9FE] border-t-2 border-[#E2DCF8] font-extrabold text-sm text-[#16131F]">
                <td colSpan={2} className="py-3 px-4">Total général</td>
                <td className="py-3 px-3 text-right">{totalQ}</td>
                <td className="py-3 px-3 text-right">{totalQV}</td>
                <td className="py-3 px-3 font-extrabold text-[#241D5E]">{totalQR} unités</td>
                <td />
                <td />
                <td className="py-3 px-3 text-right text-base text-[#241D5E]">
                  {formatFCFA(grandTotalCost)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Restock Modal */}
      {selectedItemForUpdate && (
        <Modal
          isOpen={!!selectedItemForUpdate}
          onClose={() => setSelectedItemForUpdate(null)}
          title={`Mettre à jour le stock : ${selectedItemForUpdate.name}`}
          description={`Stock actuel restant : ${selectedItemForUpdate.qr} unités`}
        >
          <form onSubmit={handleRestockSubmit} className="flex flex-col gap-4 mt-2">
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                Quantité à ajouter (ou valeur négative pour ajustement perte/casse)
              </label>
              <Input
                type="number"
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-2">
              {[+10, +25, +50, +100].map(add => (
                <button
                  key={add}
                  type="button"
                  onClick={() => setRestockAmount(String(add))}
                  className="flex-1 py-2 rounded-xl bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8] text-xs font-extrabold transition-colors cursor-pointer"
                >
                  +{add}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-[#F0EDFB]">
              <Button variant="ghost" type="button" onClick={() => setSelectedItemForUpdate(null)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Confirmer l'ajustement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
