import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  Info,
  CheckCircle2,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  date: string;
  label: string;
  type: 'Vente' | 'Charge';
  cat: string;
  mode: string;
  amount: number;
}

export const ComptabilitePage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Octobre 2026');
  const [filterType, setFilterType] = useState<'all' | 'Vente' | 'Charge'>('all');
  const [startDate, setStartDate] = useState('01/10/2026');
  const [endDate, setEndDate] = useState('31/10/2026');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for new charge
  const [formCat, setFormCat] = useState('Publicité');
  const [formLabel, setFormLabel] = useState('');
  const [formAmount, setFormAmount] = useState<number | ''>(25000);
  const [formDate, setFormDate] = useState('19/10/2026');
  const [formMode, setFormMode] = useState('Mobile Money');

  // Charges by category
  const [chargesState, setChargesState] = useState<Record<string, number>>({
    'Achat de stock': 1120000,
    'Transport et livraison': 380000,
    'Publicité': 450000,
    'Abonnement Kolix': 10000,
    'Autres': 65000
  });

  // Base Sales
  const momo = 1940000;
  const cash = 1320000;
  const ca = momo + cash;

  // Transactions list
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', date: '19 oct.', label: 'Vente #KX-1048 · Aya Kouassi', type: 'Vente', cat: 'Commande livrée', mode: 'Mobile Money', amount: 18500 },
    { id: 't2', date: '18 oct.', label: 'Vente #KX-1047 · Moussa Diarra', type: 'Vente', cat: 'Commande livrée', mode: 'Mobile Money', amount: 24000 },
    { id: 't3', date: '18 oct.', label: 'Campagne Facebook « Robes »', type: 'Charge', cat: 'Publicité', mode: 'Carte bancaire', amount: -60000 },
    { id: 't4', date: '17 oct.', label: 'Vente #KX-1045 · Konan Yao', type: 'Vente', cat: 'Commande livrée', mode: 'Espèces', amount: 22000 },
    { id: 't5', date: '17 oct.', label: 'Livreur · tournée Cocody', type: 'Charge', cat: 'Transport et livraison', mode: 'Espèces', amount: -15000 },
    { id: 't6', date: '16 oct.', label: 'Arrivage pagnes wax (20 u.)', type: 'Charge', cat: 'Achat de stock', mode: 'Mobile Money', amount: -70000 },
    { id: 't7', date: '15 oct.', label: 'Abonnement Kolix Grow', type: 'Charge', cat: 'Abonnement Kolix', mode: 'Portefeuille Kolix', amount: -10000 },
    { id: 't8', date: '15 oct.', label: 'Vente #KX-1039 · Awa Coulibaly', type: 'Vente', cat: 'Commande livrée', mode: 'Espèces', amount: 22000 },
    { id: 't9', date: '14 oct.', label: 'Emballages et sachets', type: 'Charge', cat: 'Autres', mode: 'Espèces', amount: -8500 },
    { id: 't10', date: '14 oct.', label: 'Vente #KX-1031 · Salif Ouattara', type: 'Vente', cat: 'Commande livrée', mode: 'Mobile Money', amount: 18500 }
  ]);

  const fmt = (n: number) => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const totalCharges = Object.values(chargesState).reduce((a, b) => a + b, 0);
  const netProfit = ca - totalCharges;
  const netMargin = ca > 0 ? Math.round((netProfit / ca) * 100) : 0;
  const momoPct = Math.round((momo / ca) * 100);
  const cashPct = Math.round((cash / ca) * 100);

  // Monthly Bars calculation
  const monthsData = [
    { label: 'Mai', ca: 2900, ch: 1900 },
    { label: 'Juin', ca: 3150, ch: 2050 },
    { label: 'Juil.', ca: 3420, ch: 2180 },
    { label: 'Août', ca: 3880, ch: 2400 },
    { label: 'Sept.', ca: 4510, ch: 2760 },
    { label: 'Oct.', ca: Math.round(ca / 1000), ch: Math.round(totalCharges / 1000) }
  ];
  const maxMonthlyCa = 4800;

  const catColors: Record<string, string> = {
    'Achat de stock': '#241D5E',
    'Transport et livraison': '#6C4CF1',
    'Publicité': '#A99BFA',
    'Abonnement Kolix': '#8B869C',
    'Autres': '#D6CFF7'
  };

  const handleAddCharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = typeof formAmount === 'number' ? formAmount : Number(formAmount) || 0;
    if (amt <= 0) {
      toast.error('Veuillez renseigner un montant valide');
      return;
    }

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      date: formDate.slice(0, 6) + '.',
      label: formLabel.trim() || formCat,
      type: 'Charge',
      cat: formCat,
      mode: formMode,
      amount: -amt
    };

    setChargesState(prev => ({
      ...prev,
      [formCat]: (prev[formCat] || 0) + amt
    }));

    setTransactions(prev => [newTx, ...prev]);
    setModalOpen(false);
    setFormLabel('');
    setFormAmount(25000);
    toast.success(`Charge de ${fmt(amt)} FCFA enregistrée avec succès`);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in font-sans">
      {/* Header bar */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Comptabilité</h1>
          <p className="text-sm text-[#5E5A70] mt-1 font-medium">
            Vos chiffres réels : ce que vous encaissez, ce que vous dépensez, ce qu’il vous reste.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month selector */}
          <div className="flex items-center bg-white border border-[#E2DCF8] rounded-2xl min-h-[46px] shadow-sm px-1">
            <button
              onClick={() => toast.info('Affichage du mois précédent')}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-[#16131F] hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-xs sm:text-sm px-2 text-[#16131F] whitespace-nowrap">
              {selectedMonth}
            </span>
            <button
              onClick={() => toast.info('Affichage du mois suivant')}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-[#16131F] hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => toast.success('Export comptable Excel et PDF prêt au téléchargement')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#16131F] border border-[#E2DCF8] rounded-2xl text-xs sm:text-sm font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-[#5E5A70]" />
            Exporter
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#6C4CF1] text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md shadow-[#6C4CF1]/25 hover:bg-[#5B3FD6] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Ajouter une charge
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chiffre d'affaires */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider block">Chiffre d’affaires</span>
            <div className="text-2xl sm:text-3xl font-black text-[#16131F] mt-1 tracking-tight">
              {fmt(ca)} FCFA
            </div>
            <span className="text-xs text-[#5E5A70] mt-0.5 block">Ventes livrées uniquement</span>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-50">
            <div className="h-2 rounded-full overflow-hidden flex bg-[#F0EDFB]">
              <div style={{ width: `${momoPct}%` }} className="bg-[#6C4CF1]" />
              <div style={{ width: `${cashPct}%` }} className="bg-[#241D5E]" />
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-[#3F25A8]">Mobile Money {momoPct} %</span>
              <span className="text-[#241D5E]">Espèces {cashPct} %</span>
            </div>
          </div>
        </div>

        {/* Charges */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider block">Charges totales</span>
            <div className="text-2xl sm:text-3xl font-black text-[#8A2414] mt-1 tracking-tight">
              {fmt(totalCharges)} FCFA
            </div>
            <span className="text-xs text-[#5E5A70] mt-0.5 block">Stock, transport, pub et frais</span>
          </div>
          <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-[#5E5A70]">
            <span>{Object.keys(chargesState).length} postes de dépenses</span>
            <span className="text-red-600 font-bold">−{fmt(totalCharges)} F</span>
          </div>
        </div>

        {/* Bénéfice net (Purple Highlight) */}
        <div className="bg-gradient-to-br from-[#6C4CF1] to-[#4B2FC9] text-white rounded-3xl p-5 shadow-lg shadow-[#6C4CF1]/20 flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#EDE8FF] uppercase tracking-wider block">Bénéfice net</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              {fmt(netProfit)} FCFA
            </div>
            <span className="text-xs text-[#EDE8FF] mt-0.5 block">CA − charges réelles</span>
          </div>
          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-[#EDE8FF]">
            <span>Résultat d’exploitation</span>
            <span className="font-bold text-white">Calcul automatique</span>
          </div>
        </div>

        {/* Marge nette */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider block">Marge nette</span>
            <div className="text-2xl sm:text-3xl font-black text-[#1E5E3F] mt-1 tracking-tight">
              {netMargin} %
            </div>
            <span className="text-xs text-[#5E5A70] mt-0.5 block">Part du CA qui vous reste</span>
          </div>
          <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-[#5E5A70]">
            <span>Santé financière</span>
            <span className="text-[#1E5E3F] font-bold">Excellente</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Bar Chart + Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Double-Bar Monthly Chart */}
        <section className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#16131F]">CA, charges et bénéfice · 6 derniers mois</h2>
              <p className="text-xs text-[#5E5A70] mt-0.5">Évolution mensuelle des encaissements et décaissements</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-[#3A3647]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#6C4CF1]" /> Chiffre d’affaires
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#D6CFF7] border border-[#A99BFA]" /> Charges
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div>
            <div className="grid grid-cols-6 gap-3 sm:gap-4 items-end h-56 border-b border-[#E2DCF8] pb-3 px-2">
              {monthsData.map((m, idx) => {
                const profitDiff = m.ca - m.ch;
                const isCurrent = idx === monthsData.length - 1;
                const caHeight = Math.round((m.ca / maxMonthlyCa) * 190);
                const chHeight = Math.round((m.ch / maxMonthlyCa) * 190);

                return (
                  <div key={m.label} className="flex flex-col items-center justify-end h-full gap-2">
                    <span className="text-[11px] font-black text-[#1E5E3F] whitespace-nowrap">
                      +{fmt(profitDiff)}k
                    </span>
                    <div className="flex items-end gap-1 w-full justify-center">
                      {/* CA Bar */}
                      <div
                        style={{ height: `${caHeight}px` }}
                        className={`w-4 sm:w-6 rounded-t-md transition-all ${
                          isCurrent ? 'bg-[#6C4CF1]' : 'bg-[#6C4CF1]/75 hover:bg-[#6C4CF1]'
                        }`}
                        title={`CA: ${m.ca * 1000} FCFA`}
                      />
                      {/* Charges Bar */}
                      <div
                        style={{ height: `${chHeight}px` }}
                        className="w-4 sm:w-6 rounded-t-md bg-[#D6CFF7] border border-[#A99BFA] hover:bg-[#C3BAF0] transition-all"
                        title={`Charges: ${m.ch * 1000} FCFA`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-6 gap-3 sm:gap-4 px-2 pt-2 text-center text-xs">
              {monthsData.map((m, idx) => {
                const isCurrent = idx === monthsData.length - 1;
                return (
                  <span key={m.label} className={isCurrent ? 'font-black text-[#16131F]' : 'font-semibold text-[#5E5A70]'}>
                    {m.label}
                  </span>
                );
              })}
            </div>

            <p className="text-xs text-[#5E5A70] mt-3">
              Au-dessus de chaque mois : le bénéfice net estimé (en milliers de FCFA).
            </p>
          </div>
        </section>

        {/* Categories Breakdown */}
        <section className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-[#16131F]">Répartition des charges</h2>

          <div className="space-y-4">
            {Object.entries(chargesState).map(([cat, amount]) => {
              const pct = totalCharges > 0 ? Math.round((amount / totalCharges) * 100) : 0;
              const barColor = catColors[cat] || '#6C4CF1';

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs sm:text-sm">
                    <span className="font-bold text-[#16131F]">{cat}</span>
                    <span className="font-extrabold text-[#16131F]">
                      {fmt(amount)} F <span className="text-xs font-semibold text-[#5E5A70]">· {pct}%</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F0EDFB] overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: barColor }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-[#F8F6FF] rounded-2xl border border-[#EEEAFB] text-xs text-[#3A3647] leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#6C4CF1] flex-shrink-0 mt-0.5" />
            <span>
              Les achats enregistrés dans le module Stock sont ajoutés automatiquement aux charges « Achat de stock ».
            </span>
          </div>
        </section>
      </div>

      {/* Transactions History Table */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#16131F]">Historique des transactions</h2>
            {/* Filter chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Tout' },
                { id: 'Vente', label: 'Ventes' },
                { id: 'Charge', label: 'Charges' }
              ].map(c => {
                const active = filterType === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setFilterType(c.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      active
                        ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF] font-extrabold shadow-xs'
                        : 'bg-white text-[#3A3647] border-[#E2DCF8] hover:bg-gray-50'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Pickers */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1 text-xs text-[#5E5A70]">
              <span className="font-bold">Du</span>
              <input
                type="text"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-28 border border-[#E2DCF8] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#16131F] bg-white"
              />
            </div>
            <div className="flex flex-col gap-1 text-xs text-[#5E5A70]">
              <span className="font-bold">Au</span>
              <input
                type="text"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-28 border border-[#E2DCF8] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#16131F] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider">
                <th className="py-3 px-6 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Libellé</th>
                <th className="py-3 px-4 font-bold">Type</th>
                <th className="py-3 px-4 font-bold">Catégorie</th>
                <th className="py-3 px-4 font-bold">Mode de paiement</th>
                <th className="py-3 px-6 font-bold text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-[#FAF9FE]/50 transition-colors">
                  <td className="py-3.5 px-6 text-[#3A3647] font-medium whitespace-nowrap">{t.date}</td>
                  <td className="py-3.5 px-4 font-bold text-[#16131F]">{t.label}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                      t.type === 'Vente' ? 'bg-[#E3F4EC] text-[#1E5E3F]' : 'bg-[#FCE3E0] text-[#8A2414]'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#3A3647] text-xs">{t.cat}</td>
                  <td className="py-3.5 px-4 text-[#3A3647] text-xs font-medium">{t.mode}</td>
                  <td className={`py-3.5 px-6 text-right font-black whitespace-nowrap ${
                    t.amount >= 0 ? 'text-[#1E5E3F]' : 'text-[#8A2414]'
                  }`}>
                    {t.amount >= 0 ? `+ ${fmt(t.amount)}` : `− ${fmt(t.amount)}`} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: Ajouter une charge */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#16131F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col gap-5 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#16131F]">Ajouter une charge</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#F4F1FE] text-gray-500 hover:text-black flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCharge} className="space-y-4">
              {/* Category Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5E5A70]">Catégorie de dépense</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(chargesState).map(cat => {
                    const active = formCat === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormCat(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          active
                            ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF] font-extrabold'
                            : 'bg-white text-[#3A3647] border-[#E2DCF8]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Label */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5E5A70]">Libellé de la charge</label>
                <input
                  type="text"
                  value={formLabel}
                  onChange={e => setFormLabel(e.target.value)}
                  placeholder="Ex. Campagne Facebook robes, carburant..."
                  className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30"
                />
              </div>

              {/* Amount and Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5E5A70]">Montant (FCFA)</label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5E5A70]">Date</label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#5E5A70]">Moyen de règlement</label>
                <select
                  value={formMode}
                  onChange={e => setFormMode(e.target.value)}
                  className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] bg-white focus:outline-none"
                >
                  <option value="Mobile Money">Mobile Money (Wave / Orange)</option>
                  <option value="Espèces">Espèces (Caisse)</option>
                  <option value="Portefeuille Kolix">Portefeuille Kolix</option>
                  <option value="Carte bancaire">Carte bancaire</option>
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-md shadow-[#6C4CF1]/25 hover:bg-[#5B3FD6] active:scale-95 transition-all mt-2"
              >
                Enregistrer la charge
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
