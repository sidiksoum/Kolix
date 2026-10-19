import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Paperclip, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCheck, 
  Users, 
  Sparkles,
  AlertCircle,
  Bookmark,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

type TargetType = 'all' | 'product' | 'date' | 'manual';
type WhenType = 'now' | 'schedule';

export const WhatsAppMarketingPage: React.FC = () => {
  const [campName, setCampName] = useState('Nouvelle collection d’automne');
  const [target, setTarget] = useState<TargetType>('all');
  const [selectedProduct, setSelectedProduct] = useState('Montre élégante');
  const [dateFilter, setDateFilter] = useState('30');
  const [manualSelection, setManualSelection] = useState<string[]>(['Amina T.', 'Mamadou D.']);
  
  const [message, setMessage] = useState(
    'Bonjour {Prénom} ! Votre fidélité nous fait chaud au cœur. Découvrez nos nouveautés exclusives et profitez de -15% aujourd’hui avec le code MERCI15 sur votre prochaine commande livrée.'
  );
  
  const [attachments, setAttachments] = useState<{ image: boolean; video: boolean; file: boolean }>({
    image: true,
    video: false,
    file: false
  });

  const [when, setWhen] = useState<WhenType>('now');
  const [schedDate, setSchedDate] = useState('Ven. 23/10/2026');
  const [schedTime, setSchedTime] = useState('18:30');
  const [savedLists, setSavedLists] = useState(['Grosses commandes', 'Clients Abidjan', 'Inactifs 60j']);
  const [listSavedToast, setListSavedToast] = useState(false);

  // Audience counting logic
  const getAudienceCount = () => {
    switch (target) {
      case 'all': return 616;
      case 'product': return selectedProduct === 'Montre élégante' ? 120 : 88;
      case 'date': return dateFilter === '30' ? 245 : 371;
      case 'manual': return manualSelection.length;
    }
  };

  const recipientCount = getAudienceCount();

  const insertVariable = (v: string) => {
    setMessage(prev => `${prev} ${v}`);
  };

  const toggleAttachment = (key: 'image' | 'video' | 'file') => {
    setAttachments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const manualClients = [
    'Amina Traoré', 'Mamadou Diarra', 'Fatou Cissé', 
    'Koffi Kouamé', 'Aïcha Bakayoko', 'Ibrahim Touré', 
    'Salimata Koné', 'Oumar Diallo', 'Mariam Coulibaly'
  ];

  const toggleManualClient = (c: string) => {
    setManualSelection(prev => 
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const handleSaveList = () => {
    const newName = `Audience ${savedLists.length + 1}`;
    setSavedLists(prev => [...prev, newName]);
    toast.success(`Liste « ${newName} » sauvegardée avec succès !`);
  };

  const handleSendOrSchedule = () => {
    if (when === 'now') {
      toast.success(`Campagne « ${campName} » envoyée à ${recipientCount} clients !`);
    } else {
      toast.success(`Campagne « ${campName} » programmée pour le ${schedDate} à ${schedTime}.`);
    }
  };

  // Preview formatted text with sample customer "Amina"
  const previewText = message
    .replace(/{Prénom}/g, 'Amina')
    .replace(/{Nom}/g, 'Traoré')
    .replace(/{Boutique}/g, 'Style & Élégance')
    .replace(/{Lien}/g, 'styleelegance.kolix.shop');

  const campaigns = [
    { name: 'Collection fête des mères', audience: 'Toutes les clientes · 540', when: '12 Mai 2026', status: 'Envoyée', sent: 540, recv: '98 %', read: '94 %', recvPct: 98, readPct: 94 },
    { name: 'Réactivation clients inactifs', audience: 'Inactifs > 45 jours · 180', when: '28 Juin 2026', status: 'Envoyée', sent: 180, recv: '95 %', read: '88 %', recvPct: 95, readPct: 88 },
    { name: 'Lancement Sérum Éclat', audience: 'Acheteurs Cosmétiques · 92', when: '15 Sept. 2026', status: 'Envoyée', sent: 92, recv: '99 %', read: '96 %', recvPct: 99, readPct: 96 },
    { name: 'Flash Sale Weekend', audience: 'Clients Abidjan · 320', when: 'Ven. 23/10 (18:30)', status: 'Programmée', sent: 320, recv: '—', read: '—', recvPct: 0, readPct: 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Title & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">WhatsApp Marketing</h1>
            <span className="text-xs font-extrabold bg-[#241D5E] text-white rounded-full px-2.5 py-1">
              Pro et Empire
            </span>
          </div>
          <p className="text-sm text-[#5E5A70] mt-1">
            Relancez vos clients livrés avec des campagnes WhatsApp hautement ciblées et automatisées.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-[#5E5A70]">Opt-in WhatsApp</span>
          <span className="text-2xl font-black text-[#16131F]">78 %</span>
          <span className="text-xs text-[#5E5A70]">616 clients contactables</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-[#5E5A70]">Campagnes envoyées</span>
          <span className="text-2xl font-black text-[#16131F]">8</span>
          <span className="text-xs text-[#5E5A70]">3 ce mois-ci</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-[#5E5A70]">Taux d’ouverture moyen</span>
          <span className="text-2xl font-black text-[#1E5E3F]">92 %</span>
          <span className="text-xs text-[#5E5A70]">Messages lus dans l’heure</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-[#5E5A70]">Commandes générées</span>
          <span className="text-2xl font-black text-[#6C4CF1]">47</span>
          <span className="text-xs text-[#5E5A70]">564 000 FCFA de CA attribué</span>
        </div>
      </div>

      {/* Main Campaign Builder + Live Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: 3-step Wizard */}
        <section className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-extrabold text-[#16131F]">Nouvelle campagne</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5E5A70]">Nom :</span>
              <input 
                type="text" 
                value={campName} 
                onChange={(e) => setCampName(e.target.value)}
                className="font-bold text-sm border border-[#E2DCF8] rounded-xl px-3 py-1.5 text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30"
              />
            </div>
          </div>

          {/* STEP 1: Audience */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#241D5E] text-white text-xs font-extrabold flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-extrabold text-[#16131F]">Audience cible</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'all', title: 'Tous les clients livrés', sub: '616 destinataires (100% opt-in)' },
                { id: 'product', title: 'Par produit acheté', sub: 'Clients ayant commandé un article précis' },
                { id: 'date', title: 'Par date de dernier achat', sub: 'Clients récents ou inactifs à réactiver' },
                { id: 'manual', title: 'Sélection manuelle', sub: 'Choisir client par client dans la liste' },
              ].map((t) => {
                const active = target === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTarget(t.id as TargetType)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      active 
                        ? 'border-[#6C4CF1] bg-[#F4F1FE] ring-1 ring-[#6C4CF1]' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#16131F]">{t.title}</div>
                    <div className="text-xs text-[#5E5A70] mt-0.5">{t.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Sub-filters depending on chosen target */}
            {target === 'product' && (
              <div className="p-4 bg-[#F4F1FE]/60 rounded-2xl space-y-2 border border-[#E2DCF8]">
                <label className="text-xs font-bold text-[#5E5A70] block">Produit acheté</label>
                <select 
                  value={selectedProduct} 
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-white border border-[#E2DCF8] rounded-xl px-3 py-2 text-sm font-semibold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]"
                >
                  <option value="Montre élégante">Montre élégante (120 acheteurs)</option>
                  <option value="Sac à main chic">Sac à main chic (88 acheteurs)</option>
                  <option value="Sérum éclat 30 ml">Sérum éclat 30 ml (70 acheteurs)</option>
                </select>
              </div>
            )}

            {target === 'date' && (
              <div className="p-4 bg-[#F4F1FE]/60 rounded-2xl space-y-2 border border-[#E2DCF8]">
                <label className="text-xs font-bold text-[#5E5A70] block">Période du dernier achat</label>
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full bg-white border border-[#E2DCF8] rounded-xl px-3 py-2 text-sm font-semibold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]"
                >
                  <option value="30">Dans les 30 derniers jours (clients chauds · 245)</option>
                  <option value="old">Il y a plus de 30 jours (clients à réactiver · 371)</option>
                </select>
              </div>
            )}

            {target === 'manual' && (
              <div className="p-4 bg-[#F4F1FE]/60 rounded-2xl space-y-2 border border-[#E2DCF8]">
                <label className="text-xs font-bold text-[#5E5A70] block">Sélectionnez les clients</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {manualClients.map((c) => {
                    const sel = manualSelection.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleManualClient(c)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all flex items-center justify-between ${
                          sel ? 'bg-[#6C4CF1] text-white border-[#6C4CF1]' : 'bg-white text-[#3A3647] border-gray-200'
                        }`}
                      >
                        <span className="truncate">{c}</span>
                        {sel && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recipient summary banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4F1FE] rounded-2xl p-4 border border-[#E2DCF8]/60">
              <div className="flex items-center gap-3 text-sm text-[#2E1F86]">
                <Users className="w-5 h-5 text-[#6C4CF1]" />
                <span>
                  <strong className="text-lg font-black text-[#16131F]">{recipientCount}</strong> destinataires ciblés · issus de votre CRM Client
                </span>
              </div>
              <button
                type="button"
                onClick={handleSaveList}
                className="text-xs font-extrabold bg-white text-[#3F25A8] border border-[#E2DCF8] hover:bg-white/80 px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                Enregistrer cette audience
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-[#5E5A70]">Audiences sauvegardées :</span>
              {savedLists.map((l) => (
                <span key={l} className="text-xs font-bold bg-white border border-[#E2DCF8] text-[#3A3647] px-2.5 py-1 rounded-full">
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* STEP 2: Message */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#241D5E] text-white text-xs font-extrabold flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-extrabold text-[#16131F]">Contenu du message</h3>
            </div>

            <div className="space-y-3">
              <textarea 
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-[#E2DCF8] rounded-2xl p-4 text-sm text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] leading-relaxed resize-y"
              />

              {/* Variables */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#5E5A70]">Variables dynamiques :</span>
                {['{Prénom}', '{Nom}', '{Boutique}', '{Lien}'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="text-xs font-extrabold bg-[#EEE9FF] text-[#3F25A8] hover:bg-[#E2DCFF] px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    + {v}
                  </button>
                ))}
              </div>

              {/* Attachments */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => toggleAttachment('image')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    attachments.image 
                      ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF]' 
                      : 'bg-white text-[#5E5A70] border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image jointe
                </button>

                <button
                  type="button"
                  onClick={() => toggleAttachment('video')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    attachments.video 
                      ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF]' 
                      : 'bg-white text-[#5E5A70] border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Vidéo démo
                </button>

                <button
                  type="button"
                  onClick={() => toggleAttachment('file')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    attachments.file 
                      ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF]' 
                      : 'bg-white text-[#5E5A70] border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Catalogue PDF
                </button>
              </div>
            </div>
          </div>

          {/* STEP 3: Envoi */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#241D5E] text-white text-xs font-extrabold flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-extrabold text-[#16131F]">Moment de diffusion</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'now', title: 'Envoyer maintenant', sub: 'Diffusion instantanée auprès des clients' },
                { id: 'schedule', title: 'Programmer l’envoi', sub: 'Choisir la date et l’heure optimale' },
              ].map((w) => {
                const active = when === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWhen(w.id as WhenType)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      active 
                        ? 'border-[#6C4CF1] bg-[#F4F1FE] ring-1 ring-[#6C4CF1]' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#16131F]">{w.title}</div>
                    <div className="text-xs text-[#5E5A70] mt-0.5">{w.sub}</div>
                  </button>
                );
              })}
            </div>

            {when === 'schedule' && (
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#F4F1FE]/50 rounded-2xl border border-[#E2DCF8]">
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Date</label>
                  <input 
                    type="text" 
                    value={schedDate} 
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full bg-white border border-[#E2DCF8] rounded-xl px-3 py-2 text-sm font-bold text-[#16131F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Heure</label>
                  <input 
                    type="text" 
                    value={schedTime} 
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full bg-white border border-[#E2DCF8] rounded-xl px-3 py-2 text-sm font-bold text-[#16131F]"
                  />
                </div>
              </div>
            )}

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                Seuls les clients ayant coché la case de consentement sur votre formulaire COD reçoivent vos messages WhatsApp, conformément aux règles anti-spam WhatsApp Business.
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendOrSchedule}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#6C4CF1] text-white font-extrabold rounded-2xl shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {when === 'now' ? `Envoyer à ${recipientCount} clients` : `Programmer la campagne`}
            </button>
          </div>
        </section>

        {/* Right Column: Live iPhone WhatsApp Simulator */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 flex flex-col items-center">
          <div className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider mb-3">
            Aperçu smartphone (Client : Amina Traoré)
          </div>

          <div className="w-[320px] bg-[#16131F] rounded-[44px] p-2.5 shadow-2xl border-4 border-gray-800">
            {/* Screen Content */}
            <div className="rounded-[36px] overflow-hidden bg-[#EFEAE2] flex flex-col h-[560px] relative">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white p-3.5 flex items-center gap-3 pt-6">
                <div className="w-9 h-9 rounded-full bg-[#C93C72] text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm leading-tight truncate">Style & Élégance</div>
                  <div className="text-[11px] text-[#A5D6CF] flex items-center gap-1">
                    <span>Compte professionnel</span>
                  </div>
                </div>
              </div>

              {/* Chat Canvas with Wallpaper */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                <div className="text-center">
                  <span className="bg-white/80 backdrop-blur-sm text-[10px] text-[#5E5A70] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                    Aujourd’hui
                  </span>
                </div>

                {/* Message Bubble */}
                <div className="max-w-[90%] bg-white rounded-2xl rounded-tl-sm p-2 shadow-sm space-y-2">
                  {/* Image attachment */}
                  {attachments.image && (
                    <div className="h-36 rounded-xl bg-gradient-to-tr from-[#6C4CF1]/20 to-[#C93C72]/20 flex items-center justify-center border border-gray-100 overflow-hidden relative">
                      <div className="text-center p-3">
                        <ImageIcon className="w-8 h-8 text-[#6C4CF1] mx-auto mb-1 opacity-70" />
                        <span className="text-[11px] font-bold text-[#241D5E] block">Nouvelle Collection d’Automne</span>
                        <span className="text-[10px] text-[#5E5A70]">-15% avec le code MERCI15</span>
                      </div>
                    </div>
                  )}

                  {/* Video attachment */}
                  {attachments.video && (
                    <div className="h-28 rounded-xl bg-[#241D5E] flex items-center justify-center text-white relative">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* File attachment */}
                  {attachments.file && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold text-[#16131F]">
                      <FileText className="w-4 h-4 text-[#C93C72]" />
                      <span className="truncate">Catalogue-Octobre-2026.pdf</span>
                    </div>
                  )}

                  {/* Text */}
                  <p className="text-xs text-[#16131F] leading-relaxed whitespace-pre-wrap px-1">
                    {previewText}
                  </p>

                  {/* Timestamp and ticks */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#8B869C] px-1">
                    <span>18:32</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
                  </div>
                </div>
              </div>

              {/* Bottom Chat Bar Mockup */}
              <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-gray-200">
                <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[11px] text-gray-400">
                  Répondre au message...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#075E54] flex items-center justify-center text-white">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns History Table */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#16131F]">Statistiques des campagnes passées</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider">
                <th className="py-3 px-6 font-bold">Campagne</th>
                <th className="py-3 px-4 font-bold">Audience</th>
                <th className="py-3 px-4 font-bold">Envoi</th>
                <th className="py-3 px-4 font-bold">Statut</th>
                <th className="py-3 px-4 font-bold text-right">Envoyés</th>
                <th className="py-3 px-4 font-bold">Reçus</th>
                <th className="py-3 px-6 font-bold">Lus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {campaigns.map((c) => (
                <tr key={c.name} className="hover:bg-[#FAF9FE]/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#16131F]">{c.name}</td>
                  <td className="py-4 px-4 text-[#3A3647] font-medium">{c.audience}</td>
                  <td className="py-4 px-4 text-[#5E5A70] whitespace-nowrap">{c.when}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-full ${
                      c.status === 'Envoyée' 
                        ? 'bg-[#E3F4EC] text-[#1E5E3F]' 
                        : 'bg-[#EEE9FF] text-[#3F25A8]'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-[#16131F]">{c.sent}</td>
                  <td className="py-4 px-4 min-w-[130px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                        <div style={{ width: `${c.recvPct}%` }} className="h-full bg-[#6C4CF1] rounded-full" />
                      </div>
                      <span className="text-xs font-bold text-[#16131F] w-10 text-right">{c.recv}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 min-w-[130px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                        <div style={{ width: `${c.readPct}%` }} className="h-full bg-[#1E5E3F] rounded-full" />
                      </div>
                      <span className="text-xs font-bold text-[#16131F] w-10 text-right">{c.read}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
