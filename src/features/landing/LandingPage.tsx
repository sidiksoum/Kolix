import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Sparkles, 
  ShoppingBag, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Store,
  Layers,
  Wallet,
  Calculator,
  Gift
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  // Profit Calculator State
  const [ca, setCa] = useState<number>(1500000);
  const [charges, setCharges] = useState<number>(900000);
  const [orders, setOrders] = useState<number>(400);

  // Templates Niche State
  const [activeNiche, setActiveNiche] = useState<number>(0);

  // Billing State
  const [billing, setBilling] = useState<'month' | 'year'>('month');

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Profit calculation logic
  const profit = Math.max(0, ca - charges);
  const margin = ca > 0 ? ((profit / ca) * 100).toFixed(1) : '0';
  const recommendedPlan = orders <= 700 ? 'Kolix Start' : orders <= 1500 ? 'Kolix Grow' : 'Kolix Pro';

  const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const niches = [
    'Mode féminine',
    'Beauté & Cosmétiques',
    'Électronique & Gadgets',
    'Maison & Cuisine',
    'Compléments & Bien-être',
    'Mode masculine',
    'Bijoux & Accessoires',
    'Enfants & Bébés',
    'Pagne & Wax africain',
    'Produits locaux & Artisanat',
  ];

  const templatePreviews = [
    { name: 'Kenza Élégance', style: 'Chic & Minimaliste', color: '#6C4CF1' },
    { name: 'Dakar Glow', style: 'Vibrant & Moderne', color: '#C93C72' },
    { name: 'Abidjan Trend', style: 'Épuré & Impactant', color: '#1F7A4D' },
  ];

  const plans = [
    {
      name: 'Start',
      pitch: 'Idéal pour démarrer vos premières ventes',
      priceMonth: '5 000',
      priceYear: '4 000',
      features: ['Jusqu’à 700 commandes / mois', '2 utilisateurs', 'Pixel Facebook & TikTok', 'Portefeuille COD intégré', 'Boutique personnalisée'],
      popular: false,
    },
    {
      name: 'Grow',
      pitch: 'Pour les marchands en phase d’accélération',
      priceMonth: '10 000',
      priceYear: '8 000',
      features: ['Jusqu’à 1 500 commandes / mois', '5 collaborateurs', 'CRM Client & Relances', 'Analyses intelligentes Kolix AI', 'Gestion des stocks multi-villes'],
      popular: true,
    },
    {
      name: 'Pro',
      pitch: 'Volume élevé et automatisation complète',
      priceMonth: '15 000',
      priceYear: '12 000',
      features: ['Commandes illimitées', 'Utilisateurs illimités', 'WhatsApp Marketing automatisé', 'API de Conversion Meta (CAPI)', 'Support WhatsApp prioritaire'],
      popular: false,
    },
    {
      name: 'Empire',
      pitch: 'Pour les grandes marques multi-pays',
      priceMonth: '50 000',
      priceYear: '40 000',
      features: ['Toutes les fonctionnalités Pro', 'Boutiques multi-pays illimitées', 'Fulfillment Kolix dans 9 pays', 'Account Manager dédié', 'Webhooks & intégrations API'],
      popular: false,
    },
  ];

  const faqItems = [
    {
      q: 'Ai-je besoin d’une carte bancaire pour m’inscrire ?',
      a: 'Non, aucune carte bancaire n’est requise. Vous bénéficiez de 7 jours d’essai gratuit complet et pouvez ensuite régler votre abonnement via Wave, Orange Money ou MTN Mobile Money.',
    },
    {
      q: 'Comment fonctionne le Cash on Delivery (COD) avec Kolix ?',
      a: 'Vos clients passent commande sur votre boutique sans prépaiement obligatoire. Vos livreurs ou transporteurs encaissent à la livraison, ou vos clients scannent le QR code Mobile Money généré sur le bordereau de livraison.',
    },
    {
      q: 'Puis-je utiliser mon propre nom de domaine ?',
      a: 'Oui ! Kolix vous fournit une adresse gratuite en .kolix.shop, et vous permet d’acheter ou de connecter votre propre nom de domaine (.ci, .com, .shop) en 2 clics avec SSL automatique.',
    },
    {
      q: 'Dans quels pays Kolix est-il disponible ?',
      a: 'Kolix fonctionne dans 9 pays d’Afrique francophone : Côte d’Ivoire, Sénégal, Mali, Burkina Faso, Guinée, Niger, Bénin, Togo et Cameroun, avec devises locales FCFA (XOF/XAF) et GNF.',
    },
    {
      q: 'Comment fonctionne le programme Partenaire ?',
      a: 'Si vous êtes formateur, agence ou créateur de contenu e-commerce, vous touchez 20 % de commission récurrente sur tous les abonnements de vos filleuls pendant 12 mois, versés directement sur votre Mobile Money.',
    },
    {
      q: 'Mes clients peuvent-ils payer par Mobile Money à la livraison ?',
      a: 'Absolument ! Chaque commande génère un QR code dynamique permettant au client de payer instantanément avec Wave ou Orange Money directement au livreur, avec confirmation automatique dans votre tableau de bord.',
    },
  ];

  const mBars = [42, 55, 38, 61, 74, 88, 70, 52, 66, 81, 95, 120, 98, 84, 92, 110, 76, 68, 104];

  return (
    <div className="font-sans text-[#16131F] bg-white min-h-screen relative overflow-x-hidden">
      {/* STICKY NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EEEAFB] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <span className="w-10 h-10 rounded-xl bg-[#6C4CF1] text-white flex items-center justify-center text-2xl font-black shadow-md shadow-[#6C4CF1]/30">
              K
            </span>
            <span className="text-2xl font-black text-[#16131F] tracking-tight">Kolix</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-bold text-[#3A3647]">
            <a href="#fonctionnalites" className="px-3 py-2 rounded-xl hover:text-[#6C4CF1] hover:bg-[#F4F1FE] transition-colors">
              Fonctionnalités
            </a>
            <a href="#templates" className="px-3 py-2 rounded-xl hover:text-[#6C4CF1] hover:bg-[#F4F1FE] transition-colors">
              Templates
            </a>
            <a href="#tarifs" className="px-3 py-2 rounded-xl hover:text-[#6C4CF1] hover:bg-[#F4F1FE] transition-colors">
              Tarifs
            </a>
            <a href="#partenaires" className="px-3 py-2 rounded-xl hover:text-[#6C4CF1] hover:bg-[#F4F1FE] transition-colors">
              Partenaires
            </a>
            <a href="#faq" className="px-3 py-2 rounded-xl hover:text-[#6C4CF1] hover:bg-[#F4F1FE] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Auth CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-extrabold text-[#16131F] hover:bg-[#F4F1FE] transition-colors"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-[#6C4CF1] text-white text-sm font-extrabold shadow-md shadow-[#6C4CF1]/25 hover:bg-[#5B3FD6] active:scale-95 transition-all"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-[#F4F1FE] pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="self-start text-xs font-black tracking-widest uppercase bg-white text-[#3F25A8] rounded-full px-4 py-2 shadow-xs border border-[#E2DCF8]/60">
              SCALE TON COMMERCE EN LIGNE AVEC KOLIX
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#16131F] tracking-tight leading-[1.08]">
              Créez votre boutique en ligne{' '}
              <span className="text-[#6C4CF1]">en quelques clics</span> et vendez vos produits physiques presque partout en Afrique
            </h1>

            <p className="text-base sm:text-lg text-[#3A3647] leading-relaxed max-w-2xl font-medium">
              Boutique no-code, commandes payées à la livraison, paiements Mobile Money par QR code, stocks et comptabilité : tout votre business e-commerce dans une seule application intuitive.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-4 bg-[#6C4CF1] text-white font-black text-base rounded-2xl shadow-xl shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all"
              >
                Essayer 7 jours gratuits
              </Link>
              <a
                href="#templates"
                className="flex items-center gap-2.5 px-6 py-4 bg-white text-[#16131F] font-bold text-base rounded-2xl shadow-sm hover:bg-gray-50 transition-colors border border-[#E2DCF8]"
              >
                <span className="w-7 h-7 rounded-full bg-[#EEE9FF] text-[#3F25A8] flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                <span>Voir les templates</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-[#3A3647] pt-2">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#1E5E3F]" /> Sans carte bancaire</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#1E5E3F]" /> Paiement Mobile Money</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#1E5E3F]" /> Prête en 10 minutes</span>
            </div>
          </div>

          {/* Right Smartphone Simulator Column */}
          <div className="lg:col-span-5 flex justify-center relative min-h-[560px]">
            {/* Phone Frame */}
            <div className="w-[300px] bg-[#16131F] rounded-[48px] p-3 shadow-2xl border-4 border-gray-800 z-10 flex flex-col">
              <div className="w-full bg-[#F7F5FE] rounded-[38px] overflow-hidden flex flex-col text-[11px] h-[550px]">
                {/* Header Stats */}
                <div className="bg-[#241D5E] text-white p-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>9:41</span>
                    <div className="flex gap-1 items-center">
                      <span className="w-3 h-2 rounded-xs bg-white" />
                      <span className="w-4 h-2 rounded-xs border border-white" />
                    </div>
                  </div>

                  <div className="flex gap-1 text-[9px] font-bold">
                    <span className="px-2 py-1 text-[#BDB5E8]">Jour</span>
                    <span className="px-2 py-1 text-[#BDB5E8]">Semaine</span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#6C4CF1] text-white">Ce mois</span>
                  </div>

                  <div className="text-center pt-1">
                    <span className="text-[10px] text-[#E2DCFF] block">Ventes totales</span>
                    <span className="text-2xl font-black text-white leading-tight">3,26 M FCFA</span>
                    <span className="text-[10px] text-[#E2DCFF]">205 commandes livrées</span>
                  </div>

                  {/* Chart Bars */}
                  <div className="h-16 flex items-end gap-1 pt-2 border-t border-white/10">
                    {mBars.map((v, i) => (
                      <div
                        key={i}
                        style={{ height: `${Math.round((v / 120) * 100)}%` }}
                        className="flex-1 bg-white/80 rounded-t-xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Tasks List */}
                <div className="bg-white divide-y divide-[#F0EDFB]">
                  <div className="p-3 flex items-center justify-between text-[#3A3647]">
                    <span><strong>32 commandes</strong> à confirmer</span>
                    <span className="text-gray-400">›</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-[#3A3647]">
                    <span><strong>8 livraisons</strong> aujourd’hui</span>
                    <span className="text-gray-400">›</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-[#3A3647]">
                    <span><strong>2 produits</strong> en stock faible</span>
                    <span className="text-gray-400">›</span>
                  </div>
                </div>

                {/* AI Note */}
                <div className="m-3 bg-white rounded-2xl p-3 shadow-xs border border-purple-100">
                  <span className="text-[9px] font-bold text-[#6C4CF1] uppercase">Kolix AI · Lecture</span>
                  <p className="text-[10px] font-bold text-[#16131F] mt-1 leading-tight">
                    La Montre élégante part vite : il en reste 3 en stock.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Notification Pills */}
            <div className="absolute top-12 -left-6 sm:-left-12 bg-white rounded-2xl p-3.5 shadow-xl border border-gray-100 flex items-center gap-3 z-20 animate-bounce duration-1000">
              <span className="w-10 h-10 rounded-xl bg-[#EEE9FF] text-[#3F25A8] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-black text-[#16131F] block">Nouvelle commande</span>
                <span className="text-[11px] text-[#5E5A70]">18 500 FCFA · à l’instant</span>
              </div>
            </div>

            <div className="absolute bottom-16 -right-4 sm:-right-8 bg-white rounded-2xl p-3.5 shadow-xl border border-gray-100 flex items-center gap-3 z-20">
              <span className="w-10 h-10 rounded-xl bg-[#E3F4EC] text-[#1E5E3F] flex items-center justify-center font-bold">
                <Check className="w-5 h-5 stroke-[3]" />
              </span>
              <div>
                <span className="text-xs font-black text-[#16131F] block">Payé via QR code</span>
                <span className="text-[11px] text-[#5E5A70]">Wave · crédité au Portefeuille</span>
              </div>
            </div>

            <div className="absolute -bottom-4 left-6 bg-[#F5C800] text-[#16131F] font-black text-xs px-4 py-2 rounded-xl shadow-lg z-20">
              Livrée ✓ · commande clôturée
            </div>
          </div>
        </div>
      </section>

      {/* PAYMENT OPERATORS LOGO ROW */}
      <section className="border-b border-[#EEEAFB] py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <span className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider">
            Vos clients paient comme ils veulent
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { name: 'Wave', color: 'bg-[#1CA9E9] text-white' },
              { name: 'Orange Money', color: 'bg-[#FF7900] text-white' },
              { name: 'MTN MoMo', color: 'bg-[#FFCC00] text-black' },
              { name: 'Moov Money', color: 'bg-[#005BA6] text-white' },
              { name: 'Espèces à la livraison', color: 'bg-[#241D5E] text-white' },
            ].map((op) => (
              <span key={op.name} className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs ${op.color}`}>
                {op.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVE SECTION: FINI LE BRICOLAGE */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-black tracking-widest text-[#6C4CF1] uppercase">
            FINI LE BRICOLAGE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#16131F] tracking-tight">
            Votre business mérite mieux qu’un cahier et des captures WhatsApp
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SANS KOLIX */}
          <div className="bg-[#F7F7F9] rounded-3xl p-8 space-y-6 border border-gray-200/80">
            <span className="text-sm font-extrabold text-[#5E5A70] uppercase tracking-wider block">
              Sans Kolix (Méthode manuelle)
            </span>
            <div className="space-y-4 text-[#3A3647]">
              {[
                'Prises de commande sur WhatsApp et calepins souvent égarés.',
                'Appels incessants pour confirmer la livraison et désistements fréquents.',
                'Bénéfice net flou et caisse d’espèces mélangée aux dépenses personnelles.',
                'Clients perdus de vue sans relance ni historique d’achat.',
              ].map((text, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <span className="w-6 h-6 rounded-full bg-[#ECEAF3] text-[#5E5A70] flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AVEC KOLIX */}
          <div className="bg-[#6C4CF1] text-white rounded-3xl p-8 space-y-6 shadow-xl shadow-[#6C4CF1]/20">
            <span className="text-sm font-extrabold text-[#EDE8FF] uppercase tracking-wider block">
              Avec Kolix (Tout-en-un no-code)
            </span>
            <div className="space-y-4 text-white">
              {[
                'Formulaires COD ultra-rapides générant jusqu’à +40% de conversion.',
                'QR code de paiement Mobile Money imprimé pour chaque coursier.',
                'Calcul automatique du bénéfice net après déduction des coûts d’achat et de pub.',
                'Relances clients et campagnes WhatsApp en un clic pour booster le réachat.',
              ].map((text, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <span className="w-6 h-6 rounded-full bg-white text-[#6C4CF1] flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 STEPS PROCESS */}
      <section className="bg-[#F4F1FE] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#6C4CF1] uppercase">
              EN 3 ÉTAPES SIMPLES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#16131F] tracking-tight">
              De zéro à votre première vente en ligne
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Créez votre boutique', text: 'Nommez votre boutique, choisissez un template adapté à votre niche et ajoutez vos produits en quelques minutes.' },
              { n: '2', title: 'Partagez et vendez', text: 'Ajoutez votre lien de boutique sur vos publicités TikTok, Facebook ou vos statuts WhatsApp pour recevoir des commandes.' },
              { n: '3', title: 'Encaissez et scalez', text: 'Vos livreurs remettent les colis, vos clients paient en espèces ou par QR code Mobile Money direct dans votre portefeuille.' },
            ].map((s) => (
              <div key={s.n} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
                <span className="w-12 h-12 rounded-2xl bg-[#241D5E] text-white text-lg font-black flex items-center justify-center">
                  {s.n}
                </span>
                <h3 className="text-xl font-black text-[#16131F]">{s.title}</h3>
                <p className="text-sm text-[#5E5A70] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL IN ONE FEATURES GRID (6 ITEMS) */}
      <section id="fonctionnalites" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-black tracking-widest text-[#6C4CF1] uppercase">
            TOUT-EN-UN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#16131F] tracking-tight">
            Une seule application pour tout piloter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Formulaire COD optimisé', text: 'Champs configurables, bouton de commande sur-mesure et confirmation WhatsApp instantanée.', icon: Store, bg: 'bg-[#EEE9FF]', color: 'text-[#6C4CF1]' },
            { title: 'Gestion des commandes', text: 'Statuts clairs (Confirmée, En cours, Livrée, Retour), alertes d’injoignables et filtres par commune.', icon: ShoppingBag, bg: 'bg-[#E3F4EC]', color: 'text-[#1E5E3F]' },
            { title: 'Portefeuille & Retraits', text: 'Encaissez en espèces ou Mobile Money, suivez vos soldes et retirez sans frais vers Wave ou Orange.', icon: Wallet, bg: 'bg-[#FFF6CC]', color: 'text-[#6B4100]' },
            { title: 'Gestion intelligente des stocks', text: 'Alertes automatiques dès qu’un article atteint le seuil critique pour ne jamais tomber en rupture.', icon: Layers, bg: 'bg-[#FCE3E0]', color: 'text-[#8A2414]' },
            { title: 'WhatsApp Marketing PRO', text: 'Relancez vos anciens clients par produit ou date d’achat pour générer des ventes récurrentes.', icon: MessageCircle, bg: 'bg-[#E8EEFB]', color: 'text-[#1F3F8A]' },
            { title: 'Kolix AI : Coach e-commerce', text: 'Analyses hebdomadaires, identification de vos zones à fort retour et conseils d’optimisation personnalisés.', icon: Sparkles, bg: 'bg-[#241D5E]', color: 'text-[#FFFFFF]' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-7 rounded-3xl border border-gray-100 bg-white shadow-sm hover:border-[#6C4CF1]/30 transition-all space-y-4">
                <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${f.bg} ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-black text-[#16131F]">{f.title}</h3>
                <p className="text-sm text-[#5E5A70] leading-relaxed">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* NET PROFIT CALCULATOR SECTION */}
      <section className="bg-[#241D5E] text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-black tracking-widest text-[#B9AAFF] uppercase">
              CALCULATEUR DE RENTABILITÉ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Combien gagnez-vous vraiment chaque mois ?
            </h2>
            <p className="text-base text-[#D9D3F5] leading-relaxed">
              Beaucoup de marchands confondent chiffre d’affaires et bénéfice net. Renseignez vos chiffres réels et découvrez votre marge nette instantanément.
            </p>
          </div>

          <div className="lg:col-span-6 bg-white text-[#16131F] rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Chiffre d’affaires mensuel visé (FCFA)
                </label>
                <input
                  type="number"
                  value={ca}
                  onChange={(e) => setCa(Number(e.target.value))}
                  className="w-full font-black text-xl px-4 py-3 border border-[#E2DCF8] rounded-2xl text-[#16131F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Charges totales : coût d'achat, livraison et pub (FCFA)
                </label>
                <input
                  type="number"
                  value={charges}
                  onChange={(e) => setCharges(Number(e.target.value))}
                  className="w-full font-black text-xl px-4 py-3 border border-[#E2DCF8] rounded-2xl text-[#16131F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Nombre de commandes livrées par mois
                </label>
                <input
                  type="number"
                  value={orders}
                  onChange={(e) => setOrders(Number(e.target.value))}
                  className="w-full font-black text-xl px-4 py-3 border border-[#E2DCF8] rounded-2xl text-[#16131F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#6C4CF1] text-white p-4 rounded-2xl">
                <span className="text-xs font-bold text-[#EDE8FF] block">Bénéfice net / mois</span>
                <span className="text-2xl font-black">{fmt(profit)} F</span>
              </div>
              <div className="bg-[#F4F1FE] text-[#16131F] p-4 rounded-2xl">
                <span className="text-xs font-bold text-[#5E5A70] block">Marge nette</span>
                <span className="text-2xl font-black text-[#6C4CF1]">{margin} %</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span>Plan conseillé pour ce volume : <strong>{recommendedPlan}</strong></span>
              <a href="#tarifs" className="font-extrabold text-[#6C4CF1] hover:underline">
                Voir les tarifs →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 32 TEMPLATES / 10 NICHES SECTION */}
      <section id="templates" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-black tracking-widest text-[#6C4CF1] uppercase">
            TEMPLATES BOUTIQUE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#16131F] tracking-tight">
            Un design pensé pour votre niche
          </h2>
          <p className="text-base text-[#5E5A70]">
            32 templates mobiles, 10 niches, 3 styles. Choisissez, personnalisez vos couleurs et votre logo, puis publiez.
          </p>
        </div>

        {/* Niches Pills */}
        <div className="flex flex-wrap gap-2">
          {niches.map((n, idx) => (
            <button
              key={n}
              onClick={() => setActiveNiche(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold border transition-all ${
                activeNiche === idx 
                  ? 'bg-[#6C4CF1] text-white border-[#6C4CF1] shadow-md shadow-[#6C4CF1]/20' 
                  : 'bg-white text-[#3A3647] border-gray-200 hover:border-gray-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Template Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templatePreviews.map((t, idx) => (
            <div key={t.name} className="bg-[#FAF9FE] rounded-3xl p-6 border border-[#E2DCF8] flex flex-col items-center gap-4">
              {/* Phone Mockup Representation */}
              <div className="w-[200px] h-[320px] bg-white rounded-3xl border-2 border-gray-200 p-2.5 shadow-md flex flex-col gap-2">
                <div style={{ backgroundColor: t.color }} className="h-4 rounded-lg w-full" />
                <div className="h-24 bg-gray-100 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold">
                  Bannière Collection
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="bg-gray-50 rounded-lg border border-gray-100 p-1 flex flex-col justify-between">
                    <div className="h-10 bg-gray-200 rounded" />
                    <span className="text-[8px] font-bold">17 500 F</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg border border-gray-100 p-1 flex flex-col justify-between">
                    <div className="h-10 bg-gray-200 rounded" />
                    <span className="text-[8px] font-bold">12 000 F</span>
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-between items-center text-sm pt-2">
                <strong className="text-[#16131F]">{t.name}</strong>
                <span className="text-xs text-[#5E5A70] font-bold">{t.style}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PLANS SECTION */}
      <section id="tarifs" className="py-20 sm:py-28 bg-[#F4F1FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div className="max-w-xl space-y-3">
              <span className="text-xs font-black tracking-widest text-[#6C4CF1] uppercase">
                TARIFS TRANSPARENTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#16131F] tracking-tight">
                Un plan pour chaque étape de votre croissance
              </h2>
              <p className="text-sm text-[#5E5A70]">
                Essai gratuit de 7 jours sur tous les forfaits, sans carte bancaire requise.
              </p>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center bg-white p-1 rounded-2xl border border-[#E2DCF8] shadow-xs">
              <button
                onClick={() => setBilling('month')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  billing === 'month' ? 'bg-[#6C4CF1] text-white shadow-xs' : 'text-[#5E5A70]'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBilling('year')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  billing === 'year' ? 'bg-[#6C4CF1] text-white shadow-xs' : 'text-[#5E5A70]'
                }`}
              >
                Annuel (-20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => {
              const price = billing === 'month' ? p.priceMonth : p.priceYear;
              return (
                <div
                  key={p.name}
                  className={`rounded-3xl p-7 flex flex-col justify-between gap-6 transition-all ${
                    p.popular
                      ? 'bg-[#6C4CF1] text-white shadow-xl shadow-[#6C4CF1]/25 ring-2 ring-[#6C4CF1]'
                      : 'bg-white text-[#16131F] border border-gray-100 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black">{p.name}</span>
                      {p.popular && (
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#F5C800] text-[#16131F]">
                          Le plus choisi
                        </span>
                      )}
                    </div>

                    <p className={`text-xs min-h-[36px] ${p.popular ? 'text-[#EDE8FF]' : 'text-[#5E5A70]'}`}>
                      {p.pitch}
                    </p>

                    <div>
                      <span className="text-3xl font-black">{price} F</span>
                      <span className={`text-xs ml-1 ${p.popular ? 'text-[#EDE8FF]' : 'text-[#5E5A70]'}`}>
                        / mois
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs pt-2">
                      {p.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className={`w-4 h-4 flex-shrink-0 ${p.popular ? 'text-[#7CE0AE]' : 'text-[#6C4CF1]'}`} />
                          <span className="font-semibold">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/register"
                    className={`w-full py-3.5 rounded-2xl text-xs font-black text-center shadow-md active:scale-95 transition-all ${
                      p.popular
                        ? 'bg-white text-[#241D5E] hover:bg-gray-50'
                        : 'bg-[#6C4CF1] text-white hover:bg-[#5B3FD6]'
                    }`}
                  >
                    Essayer 7 jours gratuits
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PARTNER PROGRAM BANNER */}
      <section id="partenaires" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#241D5E] text-white rounded-3xl p-8 sm:p-12 flex flex-wrap items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-black tracking-widest text-[#F5C800] uppercase">
              PROGRAMME PARTENAIRE & AFFILIATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Vous formez ou conseillez des e-commerçants ? Gagnez avec Kolix.
            </h2>
            <p className="text-sm text-[#D9D3F5] leading-relaxed">
              Touchez 20 % de chaque abonnement payé par vos filleuls pendant 12 mois, versés automatiquement dans votre Portefeuille Kolix et retirables en Mobile Money.
            </p>
          </div>
          <Link
            to="/partenaires"
            className="px-8 py-4 bg-[#F5C800] text-[#16131F] font-black text-sm sm:text-base rounded-2xl shadow-lg hover:bg-amber-400 active:scale-95 transition-all whitespace-nowrap"
          >
            Découvrir l’espace Partenaire
          </Link>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 sm:py-28 bg-[#F4F1FE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black tracking-widest text-[#6C4CF1] uppercase">
              FOIRE AUX QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#16131F] tracking-tight">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-black text-sm sm:text-base text-[#16131F] flex justify-between items-center gap-4 hover:bg-gray-50/50"
                  >
                    <span>{item.q}</span>
                    <span className="text-[#6C4CF1] font-black text-lg">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-sm text-[#5E5A70] leading-relaxed border-t border-gray-50">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL BOTTOM CTA */}
      <section className="py-20 sm:py-28 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <span className="text-xs font-black tracking-widest text-[#6C4CF1] uppercase">
          SCALE TON COMMERCE EN LIGNE AVEC KOLIX
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-[#16131F] tracking-tight leading-tight">
          Votre boutique en ligne peut être active ce soir
        </h2>
        <div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#6C4CF1] text-white font-black text-base rounded-2xl shadow-xl shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all"
          >
            <span>Essayer 7 jours gratuits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-xs text-[#5E5A70] font-medium">
          Fulfillment Kolix disponible dans 9 pays : Côte d’Ivoire, Sénégal, Mali, Burkina Faso, Guinée, Niger, Bénin, Togo et Cameroun.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#EEEAFB] py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-between items-center gap-4 text-xs text-[#5E5A70]">
          <span>© 2026 Kolix · Votre succès, notre mission</span>
          <div className="flex gap-6">
            <a href="#mentions" className="hover:text-[#16131F]">Mentions légales</a>
            <a href="#confidentialite" className="hover:text-[#16131F]">Confidentialité</a>
            <a href="#contact" className="hover:text-[#16131F]">Contact support</a>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/2250700000001"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#1F7A4D] text-white px-5 py-3 rounded-full shadow-xl shadow-[#1F7A4D]/30 flex items-center gap-2.5 font-black text-sm hover:bg-[#18643E] active:scale-95 transition-all"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span>Une question ?</span>
      </a>
    </div>
  );
};
