import React, { useState } from 'react';
import { 
  Store, 
  Globe, 
  FormInput, 
  Target, 
  Bell, 
  UserCheck, 
  CreditCard,
  Check,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Lock,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

type SectionType = 'general' | 'domain' | 'cod' | 'marketing' | 'notif' | 'account' | 'plan';

export const ParametresPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>('cod');
  
  // General form state
  const [shopName, setShopName] = useState('Style & Élégance');
  const [slogan, setSlogan] = useState('Élégance au quotidien');
  const [niche, setNiche] = useState('Mode féminine');
  const [country, setCountry] = useState('Côte d’Ivoire');
  const [currency, setCurrency] = useState('FCFA (XOF)');
  const [shopPhone, setShopPhone] = useState('07 00 00 00 01');
  const [shopEmail, setShopEmail] = useState('contact@styleelegance.ci');
  const [shopAddress, setShopAddress] = useState('Cocody Angré, Abidjan');

  // Domain state
  const [domQuery, setDomQuery] = useState('styleelegance');
  const [domExt, setDomExt] = useState('.ci');
  const [ownedDomains, setOwnedDomains] = useState<string[]>([]);

  // COD form state
  const [codFields, setCodFields] = useState({
    nom: true,       // locked
    prenom: true,
    tel: true,       // locked
    lieu: true,      // locked
    note: true,
    consent: true
  });
  const [btnColor, setBtnColor] = useState('#C93C72');
  const [btnShape, setBtnShape] = useState<'round' | 'square'>('round');
  const [btnText, setBtnText] = useState('Commander maintenant');
  const [confirmMsg, setConfirmMsg] = useState(
    'Merci {Prénom} ! Votre commande est bien reçue. Notre livreur vous appelle avant de passer. Paiement en espèces ou Mobile Money à la livraison.'
  );

  // Marketing state
  const [pixelId, setPixelId] = useState('1094839201948271');
  const [pixelConnected, setPixelConnected] = useState(true);

  // Notification matrix state
  const [notifs, setNotifs] = useState({
    stock: [true, true, false],
    order: [true, true, false],
    pay: [true, false, true],
    withdraw: [true, false, true],
    weekly: [false, false, true]
  });

  // Plans state
  const [billing, setBilling] = useState<'month' | 'year'>('month');
  const [currentPlan, setCurrentPlan] = useState('Grow');

  const toggleField = (field: 'prenom' | 'note' | 'consent') => {
    setCodFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleBuyDomain = () => {
    const full = `${domQuery}${domExt}`;
    if (!ownedDomains.includes(full)) {
      setOwnedDomains(prev => [...prev, full]);
      toast.success(`Domaine ${full} réservé avec succès ! Configuration DNS et SSL activée.`);
    }
  };

  const toggleNotifCell = (rowKey: keyof typeof notifs, cellIdx: number) => {
    setNotifs(prev => {
      const row = [...prev[rowKey]];
      row[cellIdx] = !row[cellIdx];
      return { ...prev, [rowKey]: row };
    });
  };

  const sections: { id: SectionType; label: string; sub: string; icon: any }[] = [
    { id: 'general', label: 'Boutique', sub: 'Nom et informations', icon: Store },
    { id: 'domain', label: 'Nom de domaine', sub: 'Achat et gestion', icon: Globe },
    { id: 'cod', label: 'Formulaire COD', sub: 'Champs, design, aperçu', icon: FormInput },
    { id: 'marketing', label: 'Pixel et API Meta', sub: 'Suivi publicitaire', icon: Target },
    { id: 'notif', label: 'Notifications', sub: 'Stock, commandes, alertes', icon: Bell },
    { id: 'account', label: 'Compte & facturation', sub: 'Identifiants et profil', icon: UserCheck },
    { id: 'plan', label: 'Abonnement', sub: 'Plan Grow actif', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Paramètres</h1>
        <p className="text-sm text-[#5E5A70] mt-1">
          Toute la configuration de votre boutique et de votre compte e-commerce au même endroit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar Drawer */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-white rounded-3xl p-3 border border-gray-100 shadow-sm space-y-1">
          {sections.map((s) => {
            const Icon = s.icon;
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                  active 
                    ? 'bg-[#EEE9FF] text-[#2E1F86] font-bold shadow-xs' 
                    : 'text-[#3A3647] hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[#6C4CF1]' : 'text-[#5E5A70]'}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold truncate">{s.label}</div>
                  <div className="text-[11px] text-[#5E5A70] font-medium truncate">{s.sub}</div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* TAB 1: BOUTIQUE GÉNÉRALE */}
          {activeSection === 'general' && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-[#16131F]">Informations de la boutique</h2>
              
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#C93C72] text-white text-2xl font-black flex items-center justify-center shadow-md">
                  S
                </div>
                <div className="space-y-1">
                  <button 
                    onClick={() => toast.info('Sélecteur de logo ouvert')}
                    className="px-4 py-2 bg-[#F4F1FE] text-[#3F25A8] font-extrabold rounded-xl text-xs hover:bg-[#EEE9FF] transition-colors"
                  >
                    Changer le logo
                  </button>
                  <p className="text-xs text-[#5E5A70]">PNG ou JPG, 512 × 512 conseillé pour vos fiches et bordereaux</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Nom de la boutique</label>
                  <input 
                    type="text" 
                    value={shopName} 
                    onChange={(e) => setShopName(e.target.value)} 
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Slogan</label>
                  <input 
                    type="text" 
                    value={slogan} 
                    onChange={(e) => setSlogan(e.target.value)} 
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm text-[#16131F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Niche principale</label>
                  <input 
                    type="text" 
                    value={niche} 
                    onChange={(e) => setNiche(e.target.value)} 
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm text-[#16131F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Pays d'opération</label>
                  <input 
                    type="text" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm text-[#16131F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Devise de vente</label>
                  <input 
                    type="text" 
                    value={currency} 
                    disabled
                    className="w-full bg-[#FAF9FE] border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Numéro WhatsApp de contact</label>
                  <input 
                    type="text" 
                    value={shopPhone} 
                    onChange={(e) => setShopPhone(e.target.value)} 
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm text-[#16131F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">E-mail de contact client</label>
                  <input 
                    type="email" 
                    value={shopEmail} 
                    onChange={(e) => setShopEmail(e.target.value)} 
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm text-[#16131F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Adresse ou entrepôt principal</label>
                  <input 
                    type="text" 
                    value={shopAddress} 
                    onChange={(e) => setShopAddress(e.target.value)} 
                    className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm text-[#16131F]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.success('Informations de la boutique enregistrées avec succès !')}
                className="px-6 py-3 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-md shadow-[#6C4CF1]/20 hover:bg-[#5B3FD6] active:scale-95 transition-all"
              >
                Enregistrer les modifications
              </button>
            </section>
          )}

          {/* TAB 2: NOM DE DOMAINE */}
          {activeSection === 'domain' && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-[#16131F]">Nom de domaine</h2>
              
              {/* Default Free Subdomain */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-[#EEEAFB] bg-[#FAF9FE]">
                <div>
                  <div className="font-extrabold text-base text-[#16131F]">styleelegance.kolix.shop</div>
                  <div className="text-xs text-[#5E5A70]">Adresse Kolix gratuite incluse à vie avec SSL</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold bg-[#E3F4EC] text-[#1E5E3F] px-3 py-1 rounded-full">
                    Actif & Sécurisé
                  </span>
                  {ownedDomains.length === 0 && (
                    <span className="text-xs font-extrabold bg-[#EEE9FF] text-[#3F25A8] px-3 py-1 rounded-full">
                      Principal
                    </span>
                  )}
                </div>
              </div>

              {/* Owned Custom Domains */}
              {ownedDomains.map((dom) => (
                <div key={dom} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-[#EEEAFB] bg-white">
                  <div>
                    <div className="font-extrabold text-base text-[#16131F]">{dom}</div>
                    <div className="text-xs text-[#5E5A70]">Domaine personnalisé connecté · renouvellement annuel automatique</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold bg-[#E3F4EC] text-[#1E5E3F] px-3 py-1 rounded-full">
                      Actif · SSL OK
                    </span>
                    <span className="text-xs font-extrabold bg-[#EEE9FF] text-[#3F25A8] px-3 py-1 rounded-full">
                      Principal
                    </span>
                  </div>
                </div>
              ))}

              {/* Buy or connect domain box */}
              <div className="bg-[#FAF8FF] border border-[#E2DCF8] rounded-3xl p-6 space-y-4">
                <span className="text-sm font-extrabold text-[#16131F] block">
                  Acheter ou connecter un domaine personnalisé
                </span>

                <div className="flex flex-wrap gap-2">
                  <input 
                    type="text" 
                    value={domQuery} 
                    onChange={(e) => setDomQuery(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="nom-de-votre-boutique"
                    className="flex-1 min-w-[200px] border border-[#E2DCF8] rounded-2xl px-4 py-3 text-sm font-bold text-[#16131F] bg-white"
                  />
                  {['.ci', '.com', '.shop'].map((ext) => (
                    <button
                      key={ext}
                      type="button"
                      onClick={() => setDomExt(ext)}
                      className={`px-4 py-3 rounded-2xl text-sm font-extrabold border transition-all ${
                        domExt === ext 
                          ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF]' 
                          : 'bg-white text-[#3A3647] border-gray-200'
                      }`}
                    >
                      {ext}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-[#E2DCF8]">
                  <div className="text-sm">
                    <strong>{domQuery}{domExt}</strong> · <span className="text-[#1E5E3F] font-black">Disponible</span> · 9 500 FCFA / an
                  </div>
                  <button
                    type="button"
                    onClick={handleBuyDomain}
                    className="px-5 py-2.5 bg-[#6C4CF1] text-white font-extrabold rounded-xl text-xs hover:bg-[#5B3FD6] shadow-sm transition-all"
                  >
                    Acheter et connecter
                  </button>
                </div>

                <p className="text-xs text-[#5E5A70]">
                  Kolix configure automatiquement les enregistrements DNS A / CNAME et génère le certificat SSL Cloudflare en moins de 2 minutes.
                </p>
              </div>
            </section>
          )}

          {/* TAB 3: FORMULAIRE COD AVEC SMARTPHONE SIMULATOR */}
          {activeSection === 'cod' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Form Customizer */}
              <section className="xl:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#16131F]">Formulaire de commande COD</h2>
                  <p className="text-xs text-[#5E5A70] mt-1">Personnalisez les champs et l'apparence de votre page de commande</p>
                </div>

                {/* Fields Switchers */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider block">Champs du formulaire</span>
                  
                  {/* Nom */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#FAF9FE]">
                    <div>
                      <div className="text-sm font-bold text-[#16131F]">Nom complet</div>
                      <div className="text-[11px] text-[#5E5A70]">Obligatoire</div>
                    </div>
                    <span className="text-xs font-extrabold text-[#6C4CF1] bg-[#EEE9FF] px-2.5 py-1 rounded-full">Fixe</span>
                  </div>

                  {/* Prénom */}
                  <button
                    type="button"
                    onClick={() => toggleField('prenom')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#16131F]">Prénom séparé</div>
                      <div className="text-[11px] text-[#5E5A70]">Personnalise vos messages WhatsApp</div>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                      codFields.prenom ? 'bg-[#6C4CF1] justify-end' : 'bg-gray-300 justify-start'
                    }`}>
                      <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </div>
                  </button>

                  {/* Tel */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#FAF9FE]">
                    <div>
                      <div className="text-sm font-bold text-[#16131F]">Numéro de téléphone</div>
                      <div className="text-[11px] text-[#5E5A70]">Obligatoire pour l'appel de livraison</div>
                    </div>
                    <span className="text-xs font-extrabold text-[#6C4CF1] bg-[#EEE9FF] px-2.5 py-1 rounded-full">Fixe</span>
                  </div>

                  {/* Lieu */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#FAF9FE]">
                    <div>
                      <div className="text-sm font-bold text-[#16131F]">Ville & Commune de livraison</div>
                      <div className="text-[11px] text-[#5E5A70]">Obligatoire</div>
                    </div>
                    <span className="text-xs font-extrabold text-[#6C4CF1] bg-[#EEE9FF] px-2.5 py-1 rounded-full">Fixe</span>
                  </div>

                  {/* Note */}
                  <button
                    type="button"
                    onClick={() => toggleField('note')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#16131F]">Note ou précision pour le livreur</div>
                      <div className="text-[11px] text-[#5E5A70]">Facultatif pour le client</div>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                      codFields.note ? 'bg-[#6C4CF1] justify-end' : 'bg-gray-300 justify-start'
                    }`}>
                      <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </div>
                  </button>

                  {/* Consent */}
                  <button
                    type="button"
                    onClick={() => toggleField('consent')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#16131F]">Consentement opt-in WhatsApp</div>
                      <div className="text-[11px] text-[#5E5A70]">Requis pour vos relances et campagnes</div>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                      codFields.consent ? 'bg-[#6C4CF1] justify-end' : 'bg-gray-300 justify-start'
                    }`}>
                      <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </div>
                  </button>
                </div>

                {/* Button Design */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider block">Bouton de validation</span>
                  
                  {/* Colors */}
                  <div className="flex items-center gap-3">
                    {[
                      { hex: '#C93C72', label: 'Rose' },
                      { hex: '#6C4CF1', label: 'Violet' },
                      { hex: '#1F7A63', label: 'Vert' },
                      { hex: '#B85C0E', label: 'Orange' },
                      { hex: '#16131F', label: 'Noir' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setBtnColor(c.hex)}
                        style={{ backgroundColor: c.hex }}
                        className={`w-9 h-9 rounded-full transition-transform ${
                          btnColor === c.hex ? 'ring-4 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-105'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>

                  {/* Shape */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBtnShape('round')}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        btnShape === 'round' 
                          ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF]' 
                          : 'bg-white text-[#3A3647] border-gray-200'
                      }`}
                    >
                      Coins arrondis
                    </button>
                    <button
                      type="button"
                      onClick={() => setBtnShape('square')}
                      className={`px-4 py-2 rounded-md text-xs font-extrabold border transition-all ${
                        btnShape === 'square' 
                          ? 'bg-[#EEE9FF] text-[#3F25A8] border-[#B9AAFF]' 
                          : 'bg-white text-[#3A3647] border-gray-200'
                      }`}
                    >
                      Bords droits
                    </button>
                  </div>

                  {/* Button text */}
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">Texte du bouton</label>
                    <input 
                      type="text" 
                      value={btnText} 
                      onChange={(e) => setBtnText(e.target.value)} 
                      className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2 text-sm font-bold text-[#16131F]"
                    />
                  </div>
                </div>

                {/* Confirmation message */}
                <div className="space-y-1 pt-3 border-t border-gray-100">
                  <label className="text-xs font-bold text-[#5E5A70] block">Message de confirmation après commande</label>
                  <textarea 
                    rows={3} 
                    value={confirmMsg} 
                    onChange={(e) => setConfirmMsg(e.target.value)}
                    className="w-full border border-[#E2DCF8] rounded-xl p-3 text-sm text-[#16131F] leading-relaxed resize-y"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => toast.success('Formulaire COD mis à jour et synchronisé sur votre boutique en ligne !')}
                  className="px-6 py-3 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-md shadow-[#6C4CF1]/20 hover:bg-[#5B3FD6] active:scale-95 transition-all"
                >
                  Publier le formulaire en ligne
                </button>
              </section>

              {/* Smartphone Preview */}
              <div className="xl:col-span-5 flex flex-col items-center xl:sticky xl:top-6">
                <div className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider mb-3">
                  Aperçu mobile en direct
                </div>

                <div className="w-[300px] bg-[#16131F] rounded-[42px] p-2.5 shadow-2xl border-4 border-gray-800">
                  <div className="rounded-[34px] overflow-hidden bg-white p-5 flex flex-col gap-3 min-h-[480px]">
                    <div className="text-center pb-2 border-b border-gray-100">
                      <span className="text-xs font-black text-[#16131F]">Commandez, payez à la livraison</span>
                      <span className="text-[10px] text-[#5E5A70] block mt-0.5">Livraison rapide en 24h</span>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2">
                      <div className={`p-2.5 border border-gray-200 text-[11px] text-gray-400 bg-gray-50 ${btnShape === 'round' ? 'rounded-xl' : 'rounded-xs'}`}>
                        Nom complet *
                      </div>
                      
                      {codFields.prenom && (
                        <div className={`p-2.5 border border-gray-200 text-[11px] text-gray-400 bg-gray-50 ${btnShape === 'round' ? 'rounded-xl' : 'rounded-xs'}`}>
                          Prénom
                        </div>
                      )}

                      <div className={`p-2.5 border border-gray-200 text-[11px] text-gray-400 bg-gray-50 ${btnShape === 'round' ? 'rounded-xl' : 'rounded-xs'}`}>
                        Numéro de téléphone WhatsApp *
                      </div>

                      <div className={`p-2.5 border border-gray-200 text-[11px] text-gray-400 bg-gray-50 ${btnShape === 'round' ? 'rounded-xl' : 'rounded-xs'}`}>
                        Ville & Commune de livraison *
                      </div>

                      {codFields.note && (
                        <div className={`p-2.5 border border-gray-200 text-[11px] text-gray-400 bg-gray-50 h-12 ${btnShape === 'round' ? 'rounded-xl' : 'rounded-xs'}`}>
                          Instructions pour le livreur (facultatif)...
                        </div>
                      )}

                      {codFields.consent && (
                        <div className="flex items-start gap-2 pt-1 text-[10px] text-[#3A3647] leading-tight">
                          <input type="checkbox" defaultChecked className="mt-0.5 rounded accent-[#6C4CF1]" />
                          <span>J’accepte de recevoir les offres et suivis de la boutique sur WhatsApp</span>
                        </div>
                      )}
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      style={{ backgroundColor: btnColor }}
                      className={`w-full py-3 text-white font-black text-xs shadow-md mt-2 transition-transform active:scale-95 ${
                        btnShape === 'round' ? 'rounded-2xl' : 'rounded-xs'
                      }`}
                    >
                      {btnText}
                    </button>

                    {/* Live Confirmation Preview Bubble */}
                    <div className="mt-auto bg-[#FAF9FE] p-2.5 rounded-xl border border-[#EEEAFB] text-[10px] text-[#5E5A70] leading-relaxed">
                      <span className="font-bold text-[#16131F] block mb-0.5">Confirmation instantanée :</span>
                      {confirmMsg.replace('{Prénom}', 'Amina')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MARKETING & META PIXEL */}
          {activeSection === 'marketing' && (
            <div className="space-y-6">
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-[#16131F]">Pixel Facebook & Instagram</h2>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    pixelConnected ? 'bg-[#E3F4EC] text-[#1E5E3F]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {pixelConnected ? 'Connecté & Actif' : 'Non configuré'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#5E5A70] leading-relaxed">
                  Mesurez la performance de vos publicités Meta : les événements <code>PageView</code>, <code>ViewContent</code>, <code>InitiateCheckout</code> et <code>Purchase</code> sont injectés automatiquement sans coder.
                </p>

                <div className="flex flex-wrap gap-2">
                  <input 
                    type="text" 
                    value={pixelId} 
                    onChange={(e) => setPixelId(e.target.value)}
                    placeholder="Identifiant du Pixel (15 à 16 chiffres)"
                    className="flex-1 min-w-[240px] border border-[#E2DCF8] rounded-2xl px-4 py-3 text-sm font-bold text-[#16131F]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPixelConnected(true);
                      toast.success('Pixel Meta connecté avec succès !');
                    }}
                    className="px-6 py-3 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-xs hover:bg-[#5B3FD6] shadow-sm transition-all whitespace-nowrap"
                  >
                    Enregistrer le Pixel
                  </button>
                </div>
              </section>

              {/* Conversion API Card */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-[#16131F]">API de Conversion Meta (CAPI)</h2>
                  <span className="text-xs font-extrabold bg-[#241D5E] text-white px-3 py-1 rounded-full">
                    Pro & Empire
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5E5A70] leading-relaxed">
                  Envoie les conversions directement depuis les serveurs cloud de Kolix vers Meta, garantissant 100% de suivi même en présence de bloqueurs de publicités ou de restrictions iOS.
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F4F1FE] border border-[#E2DCF8]">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#6C4CF1]" />
                    <span className="text-xs font-bold text-[#2E1F86]">
                      Votre boutique bénéficie de la double attribution Pixel + Server-Side CAPI.
                    </span>
                  </div>
                  <button
                    onClick={() => toast.success('Test des événements serveur CAPI : Statut 200 OK')}
                    className="text-xs font-extrabold bg-white text-[#3F25A8] border border-[#E2DCF8] px-3.5 py-2 rounded-xl shadow-xs"
                  >
                    Tester la transmission CAPI
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeSection === 'notif' && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-[#16131F]">Notifications & Alertes</h2>
                <p className="text-xs text-[#5E5A70] mt-1">Configurez les canaux où vous souhaitez être alerté en temps réel</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-[#5E5A70] uppercase">
                      <th className="py-3 px-2 font-bold">Événement</th>
                      <th className="py-3 px-4 font-bold text-center">Dans Kolix</th>
                      <th className="py-3 px-4 font-bold text-center">WhatsApp</th>
                      <th className="py-3 px-4 font-bold text-center">E-mail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EDFB]">
                    {[
                      { key: 'stock' as const, label: 'Alertes stock faible', sub: 'Quand un article atteint le seuil d’alerte' },
                      { key: 'order' as const, label: 'Nouvelles commandes COD', sub: 'À chaque commande enregistrée' },
                      { key: 'pay' as const, label: 'Paiements QR Code reçus', sub: 'Confirmation instantanée Mobile Money' },
                      { key: 'withdraw' as const, label: 'Retraits de fonds validés', sub: 'Notification du versement sur votre compte' },
                      { key: 'weekly' as const, label: 'Rapport hebdomadaire du lundi', sub: 'Bilan des ventes, bénéfices et taux de livraison' },
                    ].map((row) => (
                      <tr key={row.key} className="hover:bg-[#FAF9FE]/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="font-bold text-[#16131F]">{row.label}</div>
                          <div className="text-xs text-[#5E5A70]">{row.sub}</div>
                        </td>
                        {[0, 1, 2].map((colIdx) => (
                          <td key={colIdx} className="py-4 px-4 text-center">
                            <input 
                              type="checkbox"
                              checked={notifs[row.key][colIdx]}
                              onChange={() => toggleNotifCell(row.key, colIdx)}
                              className="w-5 h-5 rounded-md accent-[#6C4CF1] cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => toast.success('Préférences de notification enregistrées !')}
                className="px-6 py-3 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-md shadow-[#6C4CF1]/20 hover:bg-[#5B3FD6] active:scale-95 transition-all"
              >
                Sauvegarder les canaux
              </button>
            </section>
          )}

          {/* TAB 6: COMPTE & FACTURATION */}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-xl font-extrabold text-[#16131F]">Compte marchand</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">E-mail de connexion</label>
                    <input 
                      type="email" 
                      defaultValue="souleymane@styleelegance.ci" 
                      className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">Numéro de téléphone</label>
                    <input 
                      type="tel" 
                      defaultValue="+225 07 00 00 01" 
                      className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="font-extrabold text-sm text-[#16131F]">Mot de passe</div>
                    <div className="text-xs text-[#5E5A70]">Dernière modification il y a 3 mois</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info('Un lien de réinitialisation sécurisé vous a été envoyé par SMS.')}
                    className="px-4 py-2 bg-[#F4F1FE] text-[#3F25A8] font-extrabold rounded-xl text-xs hover:bg-[#EEE9FF] transition-colors"
                  >
                    Changer le mot de passe
                  </button>
                </div>
              </section>

              {/* Invoicing Section */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-xl font-extrabold text-[#16131F]">Informations de facturation de l'abonnement</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">Raison sociale ou Nom</label>
                    <input 
                      type="text" 
                      defaultValue="Style & Élégance SARL" 
                      className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">Moyen de règlement préféré</label>
                    <select className="w-full border border-[#E2DCF8] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#16131F] bg-white">
                      <option>Portefeuille Kolix (déduction automatique)</option>
                      <option>Wave Mobile Money</option>
                      <option>Orange Money</option>
                      <option>Carte Bancaire Visa / Mastercard</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toast.info('Vos 12 dernières factures d’abonnement ont été envoyées sur votre e-mail.')}
                    className="text-xs font-extrabold text-[#6C4CF1] hover:underline flex items-center gap-1"
                  >
                    <span>Télécharger l'historique complet de mes factures</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* TAB 7: ABONNEMENT ET PLANS */}
          {activeSection === 'plan' && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#16131F]">Gestion de l'abonnement</h2>
                  <p className="text-xs text-[#5E5A70] mt-1">
                    Plan actuel : <strong className="text-[#6C4CF1]">Kolix Grow</strong> · 412 / 1 500 commandes ce mois
                  </p>
                </div>

                <div className="flex items-center bg-[#F4F1FE] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setBilling('month')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      billing === 'month' ? 'bg-white text-[#16131F] shadow-xs' : 'text-[#5E5A70]'
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setBilling('year')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      billing === 'year' ? 'bg-white text-[#16131F] shadow-xs' : 'text-[#5E5A70]'
                    }`}
                  >
                    Annuel (-20%)
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Start', price: '5 000', period: '/ mois', desc: ['700 commandes / mois', '2 utilisateurs', 'Pixel Facebook', 'Portefeuille COD'] },
                  { name: 'Grow', price: '10 000', period: '/ mois', desc: ['1 500 commandes / mois', '5 utilisateurs', 'CRM Client & Relances', 'Kolix AI lecture'], current: true },
                  { name: 'Pro', price: '15 000', period: '/ mois', desc: ['Commandes illimitées', 'Utilisateurs illimités', 'WhatsApp Marketing PRO', 'API Meta CAPI'] },
                  { name: 'Empire', price: '50 000', period: '/ mois', desc: ['Toutes les fonctionnalités Pro', 'Boutiques multi-pays illimitées', 'Manager de compte dédié', 'API Webhooks & Zapier'] },
                ].map((p) => {
                  const isCurrent = p.name === currentPlan;
                  return (
                    <div
                      key={p.name}
                      className={`rounded-2xl p-5 border flex flex-col justify-between gap-4 transition-all ${
                        isCurrent 
                          ? 'border-[#6C4CF1] bg-[#FAF9FE] shadow-md shadow-[#6C4CF1]/10' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-base text-[#16131F]">{p.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-black bg-[#6C4CF1] text-white px-2 py-0.5 rounded-full">
                              Actuel
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-2xl font-black text-[#16131F]">{p.price} F</span>
                          <span className="text-xs text-[#5E5A70] ml-1">{p.period}</span>
                        </div>

                        <div className="space-y-2 text-xs text-[#5E5A70]">
                          {p.desc.map((d, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-[#6C4CF1] flex-shrink-0" />
                              <span className="truncate">{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPlan(p.name);
                          toast.success(`Votre passage au plan ${p.name} est confirmé !`);
                        }}
                        disabled={isCurrent}
                        className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                          isCurrent 
                            ? 'bg-gray-100 text-gray-400 cursor-default' 
                            : 'bg-[#6C4CF1] text-white hover:bg-[#5B3FD6] shadow-xs active:scale-95'
                        }`}
                      >
                        {isCurrent ? 'Plan en cours' : `Choisir ${p.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-[#F4F1FE] rounded-2xl text-xs text-[#2E1F86] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6C4CF1] flex-shrink-0" />
                <span>
                  Essai gratuit de 7 jours sans engagement pour toute montée en gamme de forfait.
                </span>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
