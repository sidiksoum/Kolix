import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  QrCode, 
  Layers, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X as CloseIcon, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { formatFCFA, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const LandingPage: React.FC = () => {
  // Calculator state
  const [ca, setCa] = useState<number>(1500000);
  const [charges, setCharges] = useState<number>(900000);
  const [ordersCount, setOrdersCount] = useState<number>(400);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Billing toggle state
  const [billing, setBilling] = useState<'month' | 'year'>('month');

  // Niche preview tabs
  const [activeNicheIdx, setActiveNicheIdx] = useState<number>(0);

  const profit = Math.max(0, ca - charges);
  const margin = ca > 0 ? Math.round((profit / ca) * 100) : 0;
  const suggestedPlan = ordersCount > 1500 ? 'Kolix Pro' : ordersCount > 500 ? 'Kolix Grow' : 'Kolix Starter';

  const niches = [
    { label: 'Mode féminine', color: '#C93C72', templates: ['Amina (Sobre)', 'Kenza (Moderne)', 'Nala (Premium)'] },
    { label: 'Beauté & Soins', color: '#A8456B', templates: ['Glow (Sobre)', 'Ébène (Moderne)', 'Lumière (Premium)'] },
    { label: 'Électronique', color: '#2453C9', templates: ['Volt (Sobre)', 'Pixel (Moderne)', 'Nova (Premium)'] },
    { label: 'Maison', color: '#2F7A5B', templates: ['Cocon (Sobre)', 'Habitat (Moderne)', 'Prestige (Premium)'] },
    { label: 'Bien-être & Santé', color: '#4E7F2A', templates: ['Vitalis (Sobre)', 'Nature+ (Moderne)', 'Essence (Premium)'] },
    { label: 'Mode masculine', color: '#1F2A44', templates: ['Urbain (Sobre)', 'Classique (Moderne)', 'Baron (Premium)'] },
    { label: 'Bijoux & Accessoires', color: '#8A6A1F', templates: ['Perle (Sobre)', 'Éclat (Moderne)', 'Carat (Premium)'] },
    { label: 'Enfants', color: '#C2611B', templates: ['Bambin (Sobre)', 'Kiddo (Moderne)', 'Petit Prince (Premium)'] },
    { label: 'Articles religieux', color: '#5B3FD6', templates: ['Foi (Sobre)', 'Sérénité (Moderne)', 'Lumière Divine (Premium)'] },
    { label: 'Produits locaux & Wax', color: '#9A4A22', templates: ['Terroir (Sobre)', 'Wax (Moderne)', 'Héritage (Premium)'] },
  ];

  const features = [
    { title: 'Commandes payées à la livraison (COD)', text: 'Le formulaire COD intégré envoie chaque commande dans votre tableau. Appelez, confirmez, suivez les statuts.', icon: ShoppingBag, bg: 'bg-[#EEE9FF]', fg: 'text-[#6C4CF1]' },
    { title: 'Paiement par QR code Mobile Money', text: 'Chaque commande a son QR code. Le client scanne avec Wave, Orange Money ou MTN, l’argent arrive dans votre Portefeuille.', icon: QrCode, bg: 'bg-[#E3F4EC]', fg: 'text-[#1E5E3F]' },
    { title: 'Stock sous contrôle & Alertes', text: 'Quantités restantes en temps réel et alertes automatiques avant la rupture pour informer vos livreurs.', icon: Layers, bg: 'bg-[#FFF0D6]', fg: 'text-[#8A3D0A]' },
    { title: 'Comptabilité automatique des livreurs', text: 'Chiffre d’affaires, espèces collectées, dépenses de livraison et bénéfice net en un coup d’œil.', icon: FileText, bg: 'bg-[#E8EEFB]', fg: 'text-[#1F4FA8]' },
    { title: 'WhatsApp Marketing & Relances', text: 'Relancez vos clients livrés avec des messages personnalisés et confirmez les commandes automatiquement.', icon: MessageSquare, bg: 'bg-[#E3F4EC]', fg: 'text-[#1E5E3F]' },
    { title: 'Kolix AI Copilote e-commerce', text: 'Un assistant qui analyse vos chiffres et vous conseille : où vos livraisons échouent, quoi réapprovisionner.', icon: Sparkles, bg: 'bg-[#EEE9FF]', fg: 'text-[#6C4CF1]' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: billing === 'month' ? '15 000 FCFA' : '12 000 FCFA',
      period: '/ mois',
      pitch: 'Pour tester le e-commerce COD et lancer votre premier produit.',
      features: ['Jusqu’à 200 commandes / mois', '1 boutique en ligne', 'Formulaire COD & QR code paiement', 'Gestion de stock basique', 'Support standard WhatsApp'],
      cta: 'Essayer gratuitement',
      popular: false,
    },
    {
      name: 'Grow',
      price: billing === 'month' ? '29 000 FCFA' : '23 000 FCFA',
      period: '/ mois',
      pitch: 'Le choix idéal des e-commerçants actifs sur TikTok & Facebook Ads.',
      features: ['Jusqu’à 1 500 commandes / mois', '3 boutiques en ligne', 'Tous les templates standard + 1 premium', 'Rapprochement comptabilité livreurs', 'Portefeuille numérique & retraits Wave/Orange', 'Support prioritaire 7j/7'],
      cta: 'Commencer 7 jours gratuits',
      popular: true,
    },
    {
      name: 'Pro',
      price: billing === 'month' ? '59 000 FCFA' : '47 000 FCFA',
      period: '/ mois',
      pitch: 'Pour les marques et agences gérant plusieurs livreurs.',
      features: ['Jusqu’à 5 000 commandes / mois', '10 boutiques en ligne', 'WhatsApp Marketing automatisé inclus', 'Accès livreurs et collaborateurs illimités', 'Kolix AI assistant complet', 'Nom de domaine personnalisé offert'],
      cta: 'Essayer Kolix Pro',
      popular: false,
    },
    {
      name: 'Empire',
      price: billing === 'month' ? '119 000 FCFA' : '95 000 FCFA',
      period: '/ mois',
      pitch: 'Pour les marchands à fort volume et multi-pays en Afrique.',
      features: ['Commandes illimitées', 'Boutiques illimitées', 'Fulfillment Kolix Empire dans 9 pays', 'Chargé de compte dédié', 'API & Webhooks sur mesure', 'Taux de commission 0%'],
      cta: 'Contacter l’équipe Empire',
      popular: false,
    }
  ];

  const faqs = [
    { q: 'Ai-je besoin d’une carte bancaire pour commencer ?', a: 'Non, aucune carte bancaire n’est requise. Vous pouvez vous inscrire et profiter de 7 jours d’essai gratuit immédiatement. Les abonnements et les retraits se font directement via Mobile Money (Wave, Orange Money, MTN MoMo).' },
    { q: 'Comment fonctionne le paiement par QR code à la livraison ?', a: 'Chaque commande génère automatiquement un QR code sécurisé. Le livreur le présente au client, qui le scanne avec Wave ou Orange Money. Le montant est validé en quelques secondes et crédité instantanément dans votre Portefeuille Kolix.' },
    { q: 'Puis-je utiliser Kolix si je vends déjà sur WhatsApp ou TikTok ?', a: 'Absolument ! Kolix est spécialement conçu pour transformer vos prospects WhatsApp et TikTok en acheteurs grâce à des formulaires express optimisés pour le Cash on Delivery.' },
    { q: 'Dans quels pays fonctionne Kolix ?', a: 'Kolix est optimisé pour toute l’Afrique francophone de l’Ouest et du Centre : Côte d’Ivoire, Sénégal, Cameroun, Bénin, Togo, Mali, Burkina Faso, Gabon, RDC.' },
    { q: 'Que se passe-t-il après les 7 jours d’essai ?', a: 'Vous choisissez le plan qui correspond au volume de commandes de votre boutique. Vos données, produits, commandes et templates restent intacts.' },
  ];

  return (
    <div className="font-sans text-[#16131F] bg-white min-h-screen selection:bg-[#6C4CF1] selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EEEAFB]">
        <div className="max-w-[1240px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 text-[#16131F] no-underline">
            <span className="w-9 h-9 rounded-xl bg-[#6C4CF1] text-white flex items-center justify-center font-extrabold text-xl shadow-kolix-sm">
              K
            </span>
            <span className="text-2xl font-extrabold tracking-tight">Kolix</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#3A3647]">
            <a href="#fonctionnalites" className="hover:text-[#6C4CF1] transition-colors no-underline">Fonctionnalités</a>
            <a href="#templates" className="hover:text-[#6C4CF1] transition-colors no-underline">Templates</a>
            <a href="#calculateur" className="hover:text-[#6C4CF1] transition-colors no-underline">Calculateur</a>
            <a href="#tarifs" className="hover:text-[#6C4CF1] transition-colors no-underline">Tarifs</a>
            <a href="#partenaires" className="hover:text-[#6C4CF1] transition-colors no-underline">Partenaires</a>
            <a href="#faq" className="hover:text-[#6C4CF1] transition-colors no-underline">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-extrabold text-[#16131F] hover:bg-[#F4F1FE] transition-colors no-underline"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-[#6C4CF1] hover:bg-[#5A3BD8] text-white text-sm font-extrabold shadow-kolix-cta transition-all hover:scale-105 active:scale-95 no-underline"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#F4F1FE] relative overflow-hidden py-16 sm:py-24">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-wrap lg:flex-nowrap items-center gap-12">
          {/* Left Text */}
          <div className="flex-1 min-w-[320px] flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-white text-[#3F25A8] rounded-full px-4 py-2 text-xs font-extrabold shadow-sm w-fit tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#6C4CF1] animate-ping" />
              SCALE TON COMMERCE EN LIGNE AVEC KOLIX
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#16131F] leading-[1.08] tracking-tight">
              Créez votre boutique en ligne <span className="text-[#6C4CF1]">en quelques clics</span> et vendez vos produits physiques presque partout en Afrique
            </h1>

            <p className="text-base sm:text-lg text-[#3A3647] font-medium leading-relaxed max-w-[560px]">
              Boutique, commandes payées à la livraison (COD), Mobile Money, stock et comptabilité : tout votre business dans une seule application, sans compétence technique.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-[#6C4CF1] hover:bg-[#5A3BD8] text-white text-base font-extrabold shadow-kolix-cta transition-all hover:scale-105 active:scale-95 no-underline flex items-center gap-2"
              >
                <span>Essayer 7 jours gratuits</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-4 rounded-2xl bg-white hover:bg-[#FAF8FF] text-[#16131F] text-base font-extrabold border border-[#E2DCF8] shadow-sm transition-colors no-underline flex items-center gap-2"
              >
                <span className="w-7 h-7 rounded-full bg-[#EEE9FF] text-[#6C4CF1] flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </span>
                <span>Voir la démo</span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 text-xs sm:text-sm font-bold text-[#3A3647] pt-2">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sans carte bancaire</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Paiement Mobile Money</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Prête en 10 minutes</span>
            </div>
          </div>

          {/* Right Phone Simulation with Floating Badges */}
          <div className="flex-1 min-w-[320px] flex justify-center relative py-8">
            {/* Phone Shell */}
            <div className="w-[300px] sm:w-[320px] h-[580px] bg-[#16131F] rounded-[48px] p-3 shadow-2xl border-4 border-[#241D5E] relative z-10">
              <div className="w-full h-full bg-[#F7F5FE] rounded-[38px] overflow-hidden flex flex-col text-xs">
                {/* Simulated App Header */}
                <div className="bg-[#6C4CF1] text-white p-5 pt-8 flex flex-col gap-1 shadow-sm">
                  <span className="text-[11px] text-[#EDE8FF]">Bonjour Aya Kouassi</span>
                  <span className="text-[11px] text-[#EDE8FF]">Portefeuille numérique Kolix</span>
                  <span className="text-2xl font-extrabold tracking-tight mt-0.5">842 300 FCFA</span>
                </div>

                {/* Orders List inside phone */}
                <div className="p-3 flex flex-col gap-2.5 flex-1 overflow-hidden">
                  <div className="bg-white rounded-xl p-2.5 flex justify-between items-center shadow-sm border border-[#E2DCF8]/60">
                    <div>
                      <strong className="block text-[#16131F]">#KX-1048 · Aya K.</strong>
                      <span className="text-[10px] text-[#5E5A70]">Sérum éclat ×2 · Cocody</span>
                    </div>
                    <span className="font-extrabold text-[#6C4CF1]">18 500 F</span>
                  </div>

                  <div className="bg-white rounded-xl p-2.5 flex justify-between items-center shadow-sm border border-[#E2DCF8]/60">
                    <div>
                      <strong className="block text-[#16131F]">#KX-1047 · Moussa D.</strong>
                      <span className="text-[10px] text-[#5E5A70]">Écouteurs Pro · Yopougon</span>
                    </div>
                    <span className="font-extrabold text-[#6C4CF1]">24 000 F</span>
                  </div>

                  <div className="bg-white rounded-xl p-2.5 flex justify-between items-center shadow-sm border border-[#E2DCF8]/60">
                    <div>
                      <strong className="block text-[#16131F]">#KX-1046 · Fatou B.</strong>
                      <span className="text-[10px] text-[#5E5A70]">Sac bandoulière · Bouaké</span>
                    </div>
                    <span className="font-extrabold text-[#6C4CF1]">12 000 F</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm text-center">
                      <span className="block text-base font-extrabold text-[#241D5E]">146</span>
                      <span className="text-[9px] text-[#5E5A70] font-bold">Commandes</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl shadow-sm text-center">
                      <span className="block text-base font-extrabold text-emerald-600">86 %</span>
                      <span className="text-[9px] text-[#5E5A70] font-bold">Livrées</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating pill 1: Nouvelle commande */}
            <div className="absolute top-4 left-0 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-kolix-lg border border-[#E2DCF8] flex items-center gap-3 z-20 animate-bounce duration-1000">
              <span className="w-10 h-10 rounded-xl bg-[#EEE9FF] text-[#6C4CF1] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs font-extrabold text-[#16131F]">Nouvelle commande</div>
                <div className="text-[11px] text-[#5E5A70]">18 500 FCFA · à l’instant</div>
              </div>
            </div>

            {/* Floating pill 2: Payé via QR code */}
            <div className="absolute bottom-16 right-0 sm:-right-4 bg-white rounded-2xl p-3.5 shadow-kolix-lg border border-[#E2DCF8] flex items-center gap-3 z-20">
              <span className="w-10 h-10 rounded-xl bg-[#E3F4EC] text-[#1E5E3F] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs font-extrabold text-[#16131F]">Payé via QR code</div>
                <div className="text-[11px] text-[#5E5A70]">Wave · crédité au Portefeuille</div>
              </div>
            </div>

            {/* Floating pill 3: Livrée ✓ */}
            <div className="absolute -bottom-2 left-6 sm:left-4 bg-[#F5C800] text-[#16131F] font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-kolix-gold z-20">
              Livrée ✓ · commande clôturée
            </div>
          </div>
        </div>
      </section>

      {/* Payment Operators Bar */}
      <section className="border-b border-[#EEEAFB] py-7 bg-white">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-wrap items-center justify-between gap-5">
          <span className="text-sm font-extrabold text-[#5E5A70]">Vos clients paient comme ils veulent :</span>
          <div className="flex flex-wrap gap-2.5">
            {[
              { name: 'Wave', bg: 'bg-[#E3F2FB]', fg: 'text-[#0E5A85]' },
              { name: 'Orange Money', bg: 'bg-[#FFF0E0]', fg: 'text-[#8A3D0A]' },
              { name: 'MTN MoMo', bg: 'bg-[#FFF6CC]', fg: 'text-[#6B5300]' },
              { name: 'Moov Money', bg: 'bg-[#E6EEFA]', fg: 'text-[#1F3F8A]' },
              { name: 'Espèces à la livraison', bg: 'bg-[#ECEAF3]', fg: 'text-[#3A3647]' }
            ].map(o => (
              <span key={o.name} className={cn('px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-sm', o.bg, o.fg)}>
                {o.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Sans Kolix vs Avec Kolix */}
      <section className="py-20 max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold tracking-widest text-[#6C4CF1] uppercase">FINI LE BRICOLAGE</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16131F] mt-2 tracking-tight">
            Votre business mérite mieux qu’un cahier et des captures WhatsApp
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sans Kolix */}
          <div className="bg-[#F7F7F9] rounded-3xl p-8 flex flex-col gap-4 border border-[#EEEAFB]">
            <span className="text-sm font-extrabold text-[#5E5A70] uppercase tracking-wider">Sans Kolix</span>
            <div className="flex flex-col gap-3.5 text-sm text-[#3A3647]">
              {[
                'Commandes notées sur des cahiers ou perdues dans WhatsApp',
                'Livreurs qui rentrent avec des espèces non justifiées',
                'Ruptures de stock imprévues en plein milieu d’une campagne pub',
                'Aucune idée exacte de votre bénéfice net après commissions'
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ECEAF3] text-[#5E5A70] font-extrabold text-xs flex items-center justify-center shrink-0">✕</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Avec Kolix */}
          <div className="bg-[#6C4CF1] text-white rounded-3xl p-8 flex flex-col gap-4 shadow-kolix-cta">
            <span className="text-sm font-extrabold text-[#EDE8FF] uppercase tracking-wider">Avec Kolix</span>
            <div className="flex flex-col gap-3.5 text-sm">
              {[
                'Toutes vos commandes centralisées avec statut temps réel',
                'Paiements Mobile Money direct au wallet via QR code',
                'Alertes de stock automatiques et seuils configurables',
                'Bénéfice net calculé automatiquement chaque mois'
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white text-[#6C4CF1] font-extrabold text-xs flex items-center justify-center shrink-0">✓</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="bg-[#F4F1FE] py-20">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold tracking-widest text-[#6C4CF1] uppercase">EN 3 ÉTAPES</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] mt-2 tracking-tight">
              De zéro à votre première vente COD
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '1', title: 'Choisissez votre template', text: 'Sélectionnez un design adapté à votre niche e-commerce parmi nos 32 templates prêts à l’emploi.' },
              { n: '2', title: 'Ajoutez vos produits', text: 'Définissez vos prix, votre stock et activez le formulaire de commande express optimisé pour le COD.' },
              { n: '3', title: 'Livrez et encaissez', text: 'Vos livreurs présentent le QR code, le client paie en espèces ou Mobile Money, votre solde est crédité.' }
            ].map(step => (
              <div key={step.n} className="bg-white rounded-3xl p-8 shadow-kolix flex flex-col gap-4 border border-[#E2DCF8]/40">
                <span className="w-12 h-12 rounded-2xl bg-[#241D5E] text-white text-xl font-extrabold flex items-center justify-center shadow-md">
                  {step.n}
                </span>
                <h3 className="text-xl font-extrabold text-[#16131F]">{step.title}</h3>
                <p className="text-sm text-[#3A3647] leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="fonctionnalites" className="py-20 max-w-[1240px] mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-extrabold tracking-widest text-[#6C4CF1] uppercase">TOUT-EN-UN</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16131F] mt-2 tracking-tight">
            Une seule application pour tout piloter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="border border-[#EEEAFB] hover:border-[#6C4CF1]/40 rounded-3xl p-7 flex flex-col gap-4 shadow-sm hover:shadow-kolix transition-all">
                <span className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm', f.bg, f.fg)}>
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-extrabold text-[#16131F]">{f.title}</h3>
                <p className="text-sm text-[#3A3647] leading-relaxed">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Net Profit Calculator */}
      <section id="calculateur" className="bg-[#241D5E] text-white py-20">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-wrap lg:flex-nowrap items-center gap-12">
          <div className="flex-1 min-w-[320px] flex flex-col gap-4">
            <span className="text-xs font-extrabold tracking-widest text-[#A99BFA] uppercase">CALCULATEUR COD</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Combien gagnez-vous vraiment par mois ?
            </h2>
            <p className="text-sm sm:text-base text-[#D9D3F5] leading-relaxed">
              Beaucoup de marchands regardent leur chiffre d’affaires et oublient leurs charges (achats, livraisons, pubs). Faites le calcul en direct, puis laissez Kolix le suivre chaque jour pour vous.
            </p>
          </div>

          <div className="flex-1 min-w-[320px] bg-white text-[#16131F] rounded-3xl p-8 shadow-2xl flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Chiffre d’affaires estimé (FCFA)</label>
              <input
                type="number"
                value={ca}
                onChange={(e) => setCa(parseInt(e.target.value, 10) || 0)}
                className="w-full min-h-[48px] rounded-2xl border border-[#E2DCF8] px-4 font-extrabold text-base text-[#16131F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Charges totales (achats de stock + livraisons + pubs)</label>
              <input
                type="number"
                value={charges}
                onChange={(e) => setCharges(parseInt(e.target.value, 10) || 0)}
                className="w-full min-h-[48px] rounded-2xl border border-[#E2DCF8] px-4 font-extrabold text-base text-[#16131F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Nombre de commandes mensuelles</label>
              <input
                type="number"
                value={ordersCount}
                onChange={(e) => setOrdersCount(parseInt(e.target.value, 10) || 0)}
                className="w-full min-h-[48px] rounded-2xl border border-[#E2DCF8] px-4 font-extrabold text-base text-[#16131F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#6C4CF1] text-white p-4 rounded-2xl flex flex-col gap-1 shadow-sm">
                <span className="text-xs text-[#EDE8FF]">Bénéfice net / mois</span>
                <span className="text-xl sm:text-2xl font-extrabold">{formatFCFA(profit)}</span>
              </div>
              <div className="bg-[#F4F1FE] text-[#16131F] p-4 rounded-2xl flex flex-col gap-1">
                <span className="text-xs text-[#5E5A70]">Marge nette</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#241D5E]">{margin} %</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#F0EDFB] text-xs font-bold">
              <span>Plan conseillé : <strong className="text-[#6C4CF1]">{suggestedPlan}</strong></span>
              <a href="#tarifs" className="text-[#6C4CF1] hover:underline">Voir les tarifs →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section with Niches Tabs */}
      <section id="templates" className="py-20 max-w-[1240px] mx-auto px-6">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-extrabold tracking-widest text-[#6C4CF1] uppercase">32 TEMPLATES</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16131F] mt-2 tracking-tight">
            Un design pensé pour votre niche e-commerce
          </h2>
          <p className="text-sm sm:text-base text-[#5E5A70] mt-2">
            32 templates mobiles, 10 niches, 3 styles (Sobre, Moderne, Premium). Choisissez, personnalisez et publiez votre boutique.
          </p>
        </div>

        {/* Niche Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {niches.map((n, idx) => (
            <button
              key={idx}
              onClick={() => setActiveNicheIdx(idx)}
              className={cn(
                'px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold shrink-0 transition-all cursor-pointer',
                activeNicheIdx === idx
                  ? 'bg-[#241D5E] text-white shadow-md'
                  : 'bg-white text-[#5E5A70] border border-[#E2DCF8] hover:text-[#16131F]'
              )}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Templates 3 Variants Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Sobre', 'Moderne', 'Premium'].map((style, sIdx) => {
            const currentNiche = niches[activeNicheIdx];
            const tName = currentNiche.templates[sIdx];
            const isPremium = style === 'Premium';

            return (
              <div
                key={style}
                className={cn(
                  'rounded-3xl p-6 flex flex-col gap-4 shadow-kolix border transition-all',
                  isPremium ? 'bg-[#16131F] text-white border-transparent' : 'bg-[#F1EEFA] text-[#16131F] border-[#E2DCF8]/60'
                )}
              >
                {/* Mini Frame */}
                <div className="h-44 bg-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
                  <div className="h-4 w-full rounded" style={{ backgroundColor: currentNiche.color }} />
                  <div className="text-center py-2">
                    <span className="text-xs font-extrabold opacity-80">{tName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-white/20 rounded-xl" />
                    <div className="h-10 bg-white/20 rounded-xl" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-extrabold">{tName.split(' ')[0]}</h4>
                    <span className="text-xs opacity-70">Style {style}</span>
                  </div>
                  <span className="text-xs font-extrabold bg-[#6C4CF1] text-white px-3 py-1 rounded-full">
                    {isPremium ? '15 USD' : 'Inclus'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-20 bg-[#F4F1FE]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-[#6C4CF1] uppercase">TARIFS TRANSPARENTS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] mt-2 tracking-tight">
                Un plan pour chaque étape de votre croissance
              </h2>
              <p className="text-sm text-[#5E5A70] mt-1">7 jours d’essai gratuit sur tous les plans, sans carte bancaire.</p>
            </div>

            {/* Monthly / Yearly Toggle */}
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-[#E2DCF8] flex gap-1">
              <button
                onClick={() => setBilling('month')}
                className={cn('px-4 py-2 rounded-xl text-xs font-extrabold transition-all', billing === 'month' ? 'bg-[#241D5E] text-white' : 'text-[#5E5A70]')}
              >
                Facturation mensuelle
              </button>
              <button
                onClick={() => setBilling('year')}
                className={cn('px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5', billing === 'year' ? 'bg-[#241D5E] text-white' : 'text-[#5E5A70]')}
              >
                <span>Annuelle</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-md">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(p => (
              <div
                key={p.name}
                className={cn(
                  'rounded-3xl p-6 flex flex-col justify-between gap-5 transition-all',
                  p.popular
                    ? 'bg-[#241D5E] text-white shadow-kolix-navy ring-2 ring-[#6C4CF1]'
                    : 'bg-white text-[#16131F] shadow-kolix border border-[#E2DCF8]/60'
                )}
              >
                <div className="flex flex-col gap-3">
                  {p.popular && (
                    <span className="bg-[#F5C800] text-[#16131F] text-[11px] font-extrabold px-3 py-1 rounded-full w-fit">
                      Le plus choisi
                    </span>
                  )}
                  <h3 className="text-xl font-extrabold">{p.name}</h3>
                  <p className={cn('text-xs min-h-[36px] leading-relaxed', p.popular ? 'text-[#D9D3F5]' : 'text-[#5E5A70]')}>
                    {p.pitch}
                  </p>
                  <div>
                    <span className="text-3xl font-extrabold tracking-tight">{p.price}</span>
                    <span className={cn('text-xs ml-1', p.popular ? 'text-[#D9D3F5]' : 'text-[#5E5A70]')}>{p.period}</span>
                  </div>

                  <div className="flex flex-col gap-2 pt-3 border-t border-white/10 text-xs">
                    {p.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/register"
                  className={cn(
                    'w-full py-3 rounded-2xl text-xs font-extrabold text-center no-underline transition-all shadow-sm',
                    p.popular
                      ? 'bg-[#6C4CF1] hover:bg-[#5A3BD8] text-white shadow-kolix-cta'
                      : 'bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8]'
                  )}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Banner */}
      <section id="partenaires" className="py-16 max-w-[1240px] mx-auto px-6">
        <div className="bg-[#241D5E] text-white rounded-3xl p-8 sm:p-12 flex flex-wrap items-center justify-between gap-6 shadow-kolix-navy">
          <div className="max-w-xl flex flex-col gap-3">
            <span className="text-xs font-extrabold tracking-widest text-[#F5C800] uppercase">PROGRAMME PARTENAIRE</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Vous formez ou conseillez des e-commerçants ? Gagnez avec Kolix.
            </h2>
            <p className="text-sm text-[#D9D3F5] leading-relaxed">
              Touchez <strong>20 % de chaque abonnement pendant 12 mois</strong>, versés directement dans votre Portefeuille Kolix et retirables en Mobile Money.
            </p>
          </div>

          <Link
            to="/register"
            className="px-6 py-3.5 rounded-2xl bg-[#F5C800] hover:bg-[#E0B700] text-[#16131F] font-extrabold text-sm shadow-kolix-gold no-underline transition-transform hover:scale-105"
          >
            Devenir partenaire affilié
          </Link>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 bg-[#F4F1FE]">
        <div className="max-w-[800px] mx-auto px-6 flex flex-col gap-8">
          <div className="text-center">
            <span className="text-xs font-extrabold tracking-widest text-[#6C4CF1] uppercase">AIDE & FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] mt-2 tracking-tight">
              Questions fréquentes
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E2DCF8]/60">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-extrabold text-sm sm:text-base text-[#16131F] flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#6C4CF1] shrink-0" /> : <ChevronDown className="w-5 h-5 text-[#5E5A70] shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#3A3647] leading-relaxed border-t border-[#F0EDFB] pt-3 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center max-w-[1240px] mx-auto px-6 flex flex-col items-center gap-5">
        <span className="text-xs font-extrabold tracking-widest text-[#6C4CF1] uppercase">LANCEZ-VOUS</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#16131F] tracking-tight max-w-2xl">
          Votre boutique en ligne peut être active ce soir
        </h2>
        <Link
          to="/register"
          className="px-8 py-4 rounded-2xl bg-[#6C4CF1] hover:bg-[#5A3BD8] text-white font-extrabold text-base shadow-kolix-cta transition-transform hover:scale-105 no-underline"
        >
          Essayer 7 jours gratuits
        </Link>
        <span className="text-xs font-medium text-[#5E5A70]">
          Disponible en Côte d’Ivoire, Sénégal, Cameroun, Bénin, Togo, Mali, Burkina Faso, Gabon, RDC
        </span>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EEEAFB] py-8 bg-white">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-wrap justify-between items-center gap-4 text-xs text-[#5E5A70]">
          <span>© 2026 Kolix · E-commerce & Cash on Delivery en Afrique</span>
          <div className="flex gap-4">
            <Link to="/login" className="text-[#5E5A70] hover:text-[#16131F]">Espace marchand</Link>
            <Link to="/register" className="text-[#5E5A70] hover:text-[#16131F]">Inscription</Link>
            <a href="https://wa.me/2250708123448" target="_blank" rel="noopener noreferrer" className="text-[#6C4CF1] font-bold">Contact WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
