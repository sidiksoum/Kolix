// src/features/admin/KolixAdminPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2 } from 'lucide-react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { OverviewSection } from './components/OverviewSection';
import { MerchantsSection } from './components/MerchantsSection';
import { PartnersSection } from './components/PartnersSection';
import { WithdrawalsSection } from './components/WithdrawalsSection';
import { ActivityLogSection } from './components/ActivityLogSection';
import { 
  AdminSection, 
  PlanType, 
  INITIAL_MERCHANTS, 
  INITIAL_WITHDRAWALS, 
  INITIAL_PARTNERS, 
  INITIAL_LOG,
  MerchantAdminItem,
  WithdrawalAdminItem,
  PartnerAdminItem,
  ActivityLogItem
} from './types';

export const KolixAdminPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChip, setFilterChip] = useState('all');

  const [merchants, setMerchants] = useState<MerchantAdminItem[]>(INITIAL_MERCHANTS);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>('m1');
  const [withdrawals, setWithdrawals] = useState<WithdrawalAdminItem[]>(INITIAL_WITHDRAWALS);
  const [partners, setPartners] = useState<PartnerAdminItem[]>(INITIAL_PARTNERS);
  const [logs, setLogs] = useState<ActivityLogItem[]>(INITIAL_LOG);

  const [toast, setToast] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<{ link: string; code: string } | null>(null);

  const formatNow = () => {
    const d = new Date();
    const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${d.getDate()} ${months[d.getMonth()]} · ${h}:${m}`;
  };

  const addLog = (what: string) => {
    const newEntry: ActivityLogItem = {
      when: formatNow(),
      who: 'Souleymane S.',
      what,
    };
    setLogs((prev) => [newEntry, ...prev]);
    setToast(what.charAt(0).toUpperCase() + what.slice(1));
  };

  // Section 1: Overview Actions
  const handleOverviewNavigate = (section: AdminSection, filter?: string) => {
    setCurrentSection(section);
    if (filter) setFilterChip(filter);
  };

  // Section 2: Merchants Actions
  const handleChangePlan = (id: string, plan: PlanType) => {
    const m = merchants.find((x) => x.id === id);
    if (!m) return;
    setMerchants((prev) => prev.map((x) => (x.id === id ? { ...x, plan } : x)));
    addLog(`a passé ${m.shop} au plan ${plan}`);
  };

  const handleExtendTrial = (id: string) => {
    const m = merchants.find((x) => x.id === id);
    if (!m) return;
    addLog(`a prolongé l’essai de ${m.shop} de 7 jours`);
  };

  const handleToggleSuspend = (id: string) => {
    const m = merchants.find((x) => x.id === id);
    if (!m) return;
    const willSuspend = m.status !== 'Suspendu';
    setMerchants((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, status: willSuspend ? 'Suspendu' : 'Actif' } : x
      )
    );
    addLog(`${willSuspend ? 'a suspendu' : 'a réactivé'} ${m.shop}`);
  };

  const handleDeleteMerchant = (id: string) => {
    const m = merchants.find((x) => x.id === id);
    if (!m) return;
    setMerchants((prev) => prev.filter((x) => x.id !== id));
    setSelectedMerchantId(null);
    addLog(`a supprimé définitivement le compte ${m.shop}`);
  };

  const handleExportCsv = () => {
    setToast('Export CSV des marchands prêt.');
  };

  // Section 3: Partners Actions
  const handleGeneratePartnerLink = (name: string, cat: string) => {
    const slug = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const code = slug.slice(0, 6).toUpperCase() + '10';
    const link = `kolix.app/r/${slug}`;

    setPartners((prev) => [
      ...prev,
      { name, cat, code, signups: 0, subs: 0, due: 0 },
    ]);
    setGeneratedLink({ link, code });
    addLog(`a créé le lien partenaire de ${name} (${cat})`);
  };

  // Section 4: Withdrawals Actions
  const handleApproveWithdrawal = (id: string) => {
    const w = withdrawals.find((x) => x.id === id);
    if (!w) return;
    setWithdrawals((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: 'Payé' } : x))
    );
    addLog(`a validé le retrait de ${w.amount.toLocaleString('fr-FR')} FCFA de ${w.who}`);
  };

  const handleRejectWithdrawal = (id: string) => {
    const w = withdrawals.find((x) => x.id === id);
    if (!w) return;
    setWithdrawals((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: 'Rejeté' } : x))
    );
    addLog(`a rejeté le retrait de ${w.amount.toLocaleString('fr-FR')} FCFA de ${w.who}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('kolix_admin_token');
    navigate('/admin/login');
  };

  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'En attente').length;
  const unpaidCount = merchants.filter((m) => m.status === 'Impayé').length;
  const trialEndingCount = merchants.filter((m) => m.status === 'Essai').length;
  const suspendedCount = merchants.filter((m) => m.status === 'Suspendu').length;

  return (
    <div className="min-h-screen bg-[#F7F5FE] text-[#16131F] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(sec) => {
          setCurrentSection(sec);
          if (sec === 'merchants') setFilterChip('all');
        }}
        pendingCount={pendingWithdrawalsCount}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto flex flex-col gap-5">
          {/* Action Toast Banner */}
          {toast && (
            <div
              role="status"
              className="flex items-center gap-3 bg-[#241D5E] text-white rounded-2xl px-5 py-3.5 shadow-lg animate-in fade-in slide-in-from-top-2"
            >
              <CheckCircle2 className="w-5 h-5 text-[#7CE0AE] shrink-0" />
              <span className="flex-1 text-sm font-semibold">{toast}</span>
              <button
                onClick={() => setToast(null)}
                className="text-white/70 hover:text-white font-bold p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Dynamic Section Rendering */}
          {currentSection === 'overview' && (
            <OverviewSection
              onNavigate={handleOverviewNavigate}
              pendingWithdrawalsCount={pendingWithdrawalsCount}
              unpaidCount={unpaidCount}
              trialEndingCount={trialEndingCount}
              suspendedCount={suspendedCount}
            />
          )}

          {currentSection === 'merchants' && (
            <MerchantsSection
              merchants={merchants}
              selectedId={selectedMerchantId}
              onSelectMerchant={setSelectedMerchantId}
              onChangePlan={handleChangePlan}
              onExtendTrial={handleExtendTrial}
              onToggleSuspend={handleToggleSuspend}
              onDeleteMerchant={handleDeleteMerchant}
              onExportCsv={handleExportCsv}
              filterChip={filterChip}
              onFilterChange={setFilterChip}
              searchQuery={searchQuery}
            />
          )}

          {currentSection === 'partners' && (
            <PartnersSection
              partners={partners}
              onGenerateLink={handleGeneratePartnerLink}
              generatedLink={generatedLink}
            />
          )}

          {currentSection === 'withdraw' && (
            <WithdrawalsSection
              withdrawals={withdrawals}
              onApprove={handleApproveWithdrawal}
              onReject={handleRejectWithdrawal}
            />
          )}

          {currentSection === 'log' && <ActivityLogSection logs={logs} />}
        </main>
      </div>
    </div>
  );
};

