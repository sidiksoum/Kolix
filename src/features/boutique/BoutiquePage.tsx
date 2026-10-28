import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  Store, 
  ExternalLink, 
  Palette, 
  Globe, 
  Smartphone, 
  Upload, 
  ChevronUp, 
  ChevronDown, 
  Gift, 
  Check, 
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';
import confetti from 'canvas-confetti';

export const BoutiquePage: React.FC = () => {
  const { user } = useAuth();
  const {
    templates,
    stores,
    activeTemplate,
    customization,
    selectedNiche,
    setSelectedNiche,
    selectedStyle,
    setSelectedStyle,
    selectedPrice,
    setSelectedPrice,
    setActiveTemplate,
    updateCustomColor,
    moveSection
  } = useStore();

  const [activeTab, setActiveTab] = useState<'templates' | 'shops' | 'editor' | 'domains'>('templates');
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  // 10 niches from docx
  const nicheList = [
    { value: 'all', label: 'Toutes les niches (32 templates)' },
    { value: 'Mode féminine', label: 'Mode féminine' },
    { value: 'Beauté, cosmétiques et soins capillaires', label: 'Beauté, cosmétiques & soins' },
    { value: 'Électronique et gadgets', label: 'Électronique & gadgets' },
    { value: 'Maison et électroménager', label: 'Maison & électroménager' },
    { value: 'Compléments alimentaires et bien-être', label: 'Compléments alimentaires & bien-être' },
    { value: 'Mode masculine', label: 'Mode masculine' },
    { value: 'Bijoux et accessoires', label: 'Bijoux & accessoires' },
    { value: 'Enfants et puériculture', label: 'Enfants & puériculture' },
    { value: 'Articles religieux et spirituels', label: 'Articles religieux & spirituels' },
    { value: 'Produits locaux et artisanat', label: 'Produits locaux & artisanat' }
  ];

  const colorSwatches = [
    { name: 'Kolix Violet', hex: '#6C4CF1' },
    { name: 'Bleu Tech', hex: '#0EA5E9' },
    { name: 'Émeraude Santé', hex: '#10B981' },
    { name: 'Rose Glamour', hex: '#F43F5E' },
    { name: 'Or & Prestige', hex: '#F59E0B' },
    { name: 'Noir Luxe', hex: '#16131F' }
  ];

  // Filtering templates
  const filteredTemplates = templates.filter(t => {
    if (selectedNiche !== 'all' && t.niche !== selectedNiche) return false;
    if (selectedStyle !== 'all' && t.style !== selectedStyle) return false;
    if (selectedPrice === 'free' && !t.isFree) return false;
    if (selectedPrice === 'paid' && t.isFree) return false;
    return true;
  });

  const handleApplyTemplate = async (templateId: string) => {
    await setActiveTemplate(templateId);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Boutique
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Créez vos boutiques en ligne, choisissez un template adapté à votre niche COD et personnalisez-le
          </p>
        </div>

        <Link
          to="/boutique-en-ligne"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8FF] border border-[#E2DCF8] text-[#16131F] font-extrabold text-sm px-5 min-h-[46px] rounded-2xl shadow-kolix-sm no-underline transition-all hover:border-[#6C4CF1] hover:shadow-kolix-md"
        >
          <span>Voir ma boutique en ligne</span>
          <ExternalLink className="w-4 h-4 text-[#6C4CF1]" />
        </Link>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-[#E2DCF8] pb-1">
        {[
          { id: 'templates', label: 'Catalogue de templates (32)', icon: Store },
          { id: 'shops', label: 'Mes boutiques', icon: Globe },
          { id: 'editor', label: 'Personnaliser le thème', icon: Palette },
          { id: 'domains', label: 'Noms de domaine', icon: Globe },
        ].map(t => {
          const isSelected = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-sm transition-all border-b-2 -mb-1 cursor-pointer',
                isSelected
                  ? 'border-[#6C4CF1] text-[#241D5E] bg-white shadow-kolix-sm'
                  : 'border-transparent text-[#5E5A70] hover:text-[#16131F] hover:bg-white/50'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="flex flex-col gap-5">
          {/* Active Template Summary Banner */}
          {activeTemplate && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-kolix flex flex-wrap items-center justify-between gap-5 border border-[#E2DCF8]/60">
              {/* Mini Wireframe Mockup */}
              <div className="w-28 h-20 bg-[#F4F1FE] rounded-xl p-2 flex flex-col justify-between shrink-0 shadow-inner">
                <div className="h-2 w-full rounded" style={{ backgroundColor: activeTemplate.accentColor }} />
                <div className="h-4 w-3/4 bg-[#D6CFF7] rounded" />
                <div className="grid grid-cols-2 gap-1">
                  <div className="h-4 bg-white rounded" />
                  <div className="h-4 bg-white rounded" />
                </div>
              </div>

              <div className="flex-1 min-w-[240px]">
                <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider">
                  Template actif sur {user.currentShop.name}
                </span>
                <h3 className="text-2xl font-extrabold text-[#241D5E] mt-0.5">{activeTemplate.name}</h3>
                <span className="text-xs text-[#5E5A70] font-medium">
                  {activeTemplate.niche} · Style {activeTemplate.style}
                </span>
              </div>

              <Button
                variant="primary"
                onClick={() => setActiveTab('editor')}
                className="rounded-full shadow-kolix-cta"
              >
                <Palette className="w-4 h-4 mr-2" />
                Personnaliser
              </Button>
            </div>
          )}

          {/* Filtering Bar */}
          <div className="flex flex-wrap items-end gap-3 bg-white p-4 rounded-3xl shadow-kolix">
            <div className="flex-1 min-w-[260px]">
              <label className="text-xs font-bold text-[#5E5A70] block mb-1.5">Niche e-commerce</label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full min-h-[44px] rounded-2xl bg-[#F4F1FE] border border-transparent px-3.5 text-xs sm:text-sm font-semibold text-[#16131F] outline-none cursor-pointer focus:bg-white focus:border-[#6C4CF1]"
              >
                {nicheList.map(n => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
            </div>

            {/* Style Chips */}
            <div>
              <span className="text-xs font-bold text-[#5E5A70] block mb-1.5">Style visuel</span>
              <div className="flex gap-1.5">
                {['all', 'Épuré', 'Moderne', 'Luxe'].map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStyle(st)}
                    className={cn(
                      'text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer',
                      selectedStyle === st
                        ? 'bg-[#241D5E] text-white'
                        : 'bg-[#F4F1FE] text-[#5E5A70] hover:text-[#16131F]'
                    )}
                  >
                    {st === 'all' ? 'Tous' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Chips */}
            <div>
              <span className="text-xs font-bold text-[#5E5A70] block mb-1.5">Tarif</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'free', label: 'Gratuit (2)' },
                  { id: 'paid', label: 'Premium 15 USD (30)' }
                ].map(pr => (
                  <button
                    key={pr.id}
                    onClick={() => setSelectedPrice(pr.id)}
                    className={cn(
                      'text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer',
                      selectedPrice === pr.id
                        ? 'bg-[#241D5E] text-white'
                        : 'bg-[#F4F1FE] text-[#5E5A70] hover:text-[#16131F]'
                    )}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Special Niche Pack Promotional Banner */}
          <div className="bg-[#EEE9FF] border border-[#D9D3F5] rounded-2xl p-4 flex items-center gap-3 text-[#2E1F86] text-xs sm:text-sm font-bold shadow-sm">
            <span className="w-9 h-9 rounded-xl bg-white text-[#6C4CF1] flex items-center justify-center shrink-0 shadow-sm">
              <Gift className="w-5 h-5" />
            </span>
            <div className="flex-1">
              <strong>Pack niche exclusif Kolix :</strong> Obtenez les 3 styles d’une niche pour <strong>18 000 FCFA</strong>. Un template premium offert à vie avec les forfaits Pro et Empire.
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredTemplates.map(tpl => {
              const isActive = activeTemplate?.id === tpl.id;

              return (
                <article
                  key={tpl.id}
                  className={cn(
                    'bg-white rounded-3xl p-4 shadow-kolix hover:shadow-kolix-md transition-all flex flex-col gap-3.5 border',
                    isActive ? 'border-[#6C4CF1] ring-2 ring-[#6C4CF1]/20' : 'border-transparent'
                  )}
                >
                  {/* Template Wireframe Device Preview */}
                  <div className="relative bg-[#F1EEFA] rounded-2xl p-4 flex flex-col justify-between h-40 shadow-inner overflow-hidden group">
                    <div className="h-3 w-full rounded" style={{ backgroundColor: tpl.accentColor }} />
                    <div className="my-auto flex flex-col gap-1 items-center text-center px-2">
                      <div className="h-3 w-3/4 bg-[#D6CFF7] rounded" />
                      <div className="h-2 w-1/2 bg-[#D6CFF7]/60 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-8 bg-white rounded-lg shadow-sm" />
                      <div className="h-8 bg-white rounded-lg shadow-sm" />
                    </div>

                    {/* Price tag */}
                    <span className="absolute bottom-2.5 right-2.5 text-[11px] font-extrabold bg-[#241D5E] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                      {tpl.isFree ? 'Gratuit' : '15 USD'}
                    </span>

                    {isActive && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold bg-[#16131F] text-white px-2 py-0.5 rounded-md shadow-sm">
                        Actif
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5 px-1">
                    <h4 className="text-base font-extrabold text-[#16131F] truncate">{tpl.name}</h4>
                    <span className="text-xs text-[#5E5A70] truncate">
                      {tpl.niche} · {tpl.style}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPreviewTemplate(tpl)}
                      className="rounded-xl text-xs font-bold"
                    >
                      Aperçu
                    </Button>
                    <Button
                      variant={isActive ? 'navy' : 'primary'}
                      size="sm"
                      onClick={() => handleApplyTemplate(tpl.id)}
                      className="rounded-xl text-xs font-bold"
                    >
                      {isActive ? 'Actif' : tpl.isFree ? 'Choisir' : 'Acheter'}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MES BOUTIQUES */}
      {activeTab === 'shops' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map(store => (
            <div
              key={store.id}
              className="bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-white text-base shadow-sm shrink-0"
                  style={{ backgroundColor: store.accentColor }}
                >
                  {store.initials}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-extrabold text-[#16131F] truncate">{store.name}</h4>
                  <span className="text-xs text-[#5E5A70] truncate block">{store.domain}</span>
                </div>
                <Badge variant={store.status === 'En ligne' ? 'optimal' : 'default'}>
                  {store.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#F0EDFB] text-xs">
                <div>
                  <span className="text-[#5E5A70] block">Produits en vente</span>
                  <span className="text-lg font-extrabold text-[#16131F]">{store.productsCount}</span>
                </div>
                <div>
                  <span className="text-[#5E5A70] block">Commandes (7 j)</span>
                  <span className="text-lg font-extrabold text-[#16131F]">{store.ordersCount7d}</span>
                </div>
              </div>

              <div className="text-xs text-[#5E5A70]">
                Template actif : <strong className="text-[#241D5E]">{store.templateName}</strong>
              </div>

              <Button
                variant={store.isActive ? 'navy' : 'outline'}
                onClick={() => toast.success(`Boutique active : ${store.name}`)}
                className="w-full rounded-2xl mt-auto"
              >
                {store.isActive ? 'Boutique active' : 'Gérer cette boutique'}
              </Button>
            </div>
          ))}

          {/* Add New Store Card */}
          <div className="border-2 border-dashed border-[#CFC7F2] bg-[#FAF8FF] rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[220px]">
            <span className="w-12 h-12 rounded-2xl bg-[#EEE9FF] text-[#6C4CF1] flex items-center justify-center">
              <Store className="w-6 h-6" />
            </span>
            <div>
              <h4 className="text-base font-extrabold text-[#3F25A8]">+ Créer une nouvelle boutique</h4>
              <p className="text-xs text-[#5E5A70] mt-1 max-w-[260px]">
                Choisissez une niche COD, activez un template et vendez en toute simplicité.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => toast.info('Ouverture du configurateur multi-boutique Kolix')}
              className="rounded-full shadow-kolix-cta"
            >
              Créer ma boutique
            </Button>
          </div>
        </div>
      )}

      {/* TAB 3: PERSONNALISER (Live Editor + Mobile Frame Simulation) */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Customizer Settings */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider">
                Personnalisation du thème
              </span>
              <h3 className="text-2xl font-extrabold text-[#241D5E] mt-0.5">
                {activeTemplate?.name || 'Aura Éclat'}
              </h3>
            </div>

            {/* Media Upload Dropzones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toast.success('Sélecteur de logo ouvert')}
                className="h-28 rounded-2xl border-2 border-dashed border-[#CFC7F2] bg-[#FAF8FF] hover:bg-[#F4F1FE] text-[#4B2FC9] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5 text-[#6C4CF1]" />
                <span className="text-xs font-extrabold">+ Téléverser le logo</span>
              </button>
              <button
                type="button"
                onClick={() => toast.success('Sélecteur de bannière 1200x400 ouvert')}
                className="h-28 rounded-2xl border-2 border-dashed border-[#CFC7F2] bg-[#FAF8FF] hover:bg-[#F4F1FE] text-[#4B2FC9] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5 text-[#6C4CF1]" />
                <span className="text-xs font-extrabold">+ Bannière héro (1200 × 400)</span>
              </button>
            </div>

            {/* Primary Color Swatches */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-[#16131F]">Couleur principale du template</span>
              <div className="flex flex-wrap gap-3">
                {colorSwatches.map(swatch => {
                  const isSelected = customization.primaryColor === swatch.hex;
                  return (
                    <button
                      key={swatch.hex}
                      onClick={() => updateCustomColor(swatch.hex)}
                      title={swatch.name}
                      style={{ backgroundColor: swatch.hex }}
                      className={cn(
                        'w-10 h-10 rounded-2xl transition-all cursor-pointer relative shadow-sm',
                        isSelected && 'scale-110 ring-4 ring-offset-2 ring-[#6C4CF1]/30'
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reorderable Page Sections */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#16131F]">Sections de la page d’accueil</span>
              <div className="flex flex-col gap-2 mt-1">
                {customization.sections.map((section, idx) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3.5 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8]/60 text-xs sm:text-sm font-bold text-[#16131F]"
                  >
                    <span>{section.label}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => moveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F4F1FE] text-[#5E5A70] flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-sm"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSection(idx, 'down')}
                        disabled={idx === customization.sections.length - 1}
                        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F4F1FE] text-[#5E5A70] flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-sm"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Mobile Simulator */}
          <div className="lg:col-span-5 flex flex-col items-center gap-3">
            <span className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider">
              Aperçu en direct (Smartphone COD)
            </span>

            {/* Device Mockup Shell */}
            <div className="w-[320px] bg-[#16131F] rounded-[44px] p-3 shadow-2xl border-4 border-[#3A3647]">
              {/* Screen Content */}
              <div className="bg-white rounded-[34px] overflow-hidden flex flex-col min-h-[520px] text-xs">
                {/* Simulated Header */}
                <div
                  className="px-4 py-3 text-white flex justify-between items-center shrink-0"
                  style={{ backgroundColor: customization.primaryColor }}
                >
                  <span className="font-extrabold tracking-tight">ÉLÉGANCE CI</span>
                  <ShoppingBag className="w-4 h-4" />
                </div>

                {/* Simulated Hero Banner */}
                <div className="p-4 bg-[#F4F1FE] flex flex-col gap-2 text-center py-6">
                  <span className="text-sm font-extrabold text-[#16131F]">
                    {activeTemplate?.heroText || 'Sublimez votre beauté naturelle'}
                  </span>
                  <span className="text-[11px] text-[#5E5A70]">
                    Paiement à la livraison partout à Abidjan sous 24h
                  </span>
                  <button
                    className="mt-2 text-white text-xs font-bold py-2 px-4 rounded-full mx-auto shadow-md"
                    style={{ backgroundColor: customization.primaryColor }}
                  >
                    Commander via COD
                  </button>
                </div>

                {/* Simulated Products Grid */}
                <div className="p-3 grid grid-cols-2 gap-2 flex-1">
                  <div className="bg-[#FAF8FF] p-2 rounded-xl flex flex-col gap-1 border border-[#E2DCF8]/40">
                    <div className="h-16 bg-white rounded-lg flex items-center justify-center text-[10px] text-gray-400">
                      Photo
                    </div>
                    <span className="font-bold text-[11px] truncate">Sérum éclat 30ml</span>
                    <span className="font-extrabold text-[11px]" style={{ color: customization.primaryColor }}>
                      9 250 FCFA
                    </span>
                  </div>
                  <div className="bg-[#FAF8FF] p-2 rounded-xl flex flex-col gap-1 border border-[#E2DCF8]/40">
                    <div className="h-16 bg-white rounded-lg flex items-center justify-center text-[10px] text-gray-400">
                      Photo
                    </div>
                    <span className="font-bold text-[11px] truncate">Lisseur Pro</span>
                    <span className="font-extrabold text-[11px]" style={{ color: customization.primaryColor }}>
                      15 000 FCFA
                    </span>
                  </div>
                </div>

                {/* Simulated Footer */}
                <div className="p-3 bg-[#16131F] text-white text-center text-[10px]">
                  © 2026 Élégance CI · Propulsé par Kolix COD
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DOMAINES */}
      {activeTab === 'domains' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-5 max-w-3xl">
          <div>
            <h3 className="text-xl font-extrabold text-[#241D5E]">Domaine personnalisé</h3>
            <p className="text-xs sm:text-sm text-[#5E5A70] mt-1">
              Connectez votre propre nom de domaine (.ci, .com, .shop) pour renforcer la crédibilité de votre boutique.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-[#F4F1FE] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#5E5A70]">Sous-domaine par défaut Kolix</span>
                <div className="font-extrabold text-sm text-[#241D5E]">{user.currentShop.domain}</div>
              </div>
              <Badge variant="optimal">Actif & SSL sécurisé</Badge>
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Ex: www.maboutique.ci"
                className="flex-1 min-h-[46px] rounded-2xl bg-white border border-[#E2DCF8] px-4 text-sm font-semibold"
              />
              <Button
                variant="primary"
                onClick={() => toast.success('Demande de liaison de domaine envoyée')}
              >
                Lier le domaine
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={`Aperçu : ${previewTemplate.name}`}
          description={`${previewTemplate.niche} · Style ${previewTemplate.style}`}
          maxWidth="lg"
        >
          <div className="flex flex-col gap-4">
            <div className="h-64 rounded-2xl bg-[#F4F1FE] p-6 flex flex-col justify-between items-center shadow-inner">
              <div className="h-6 w-full rounded-xl" style={{ backgroundColor: previewTemplate.accentColor }} />
              <div className="text-center">
                <h4 className="text-xl font-extrabold text-[#16131F]">{previewTemplate.heroText}</h4>
                <p className="text-xs text-[#5E5A70] mt-1">{previewTemplate.subText}</p>
              </div>
              <div className="flex gap-3">
                <div className="w-24 h-16 bg-white rounded-xl shadow-sm" />
                <div className="w-24 h-16 bg-white rounded-xl shadow-sm" />
                <div className="w-24 h-16 bg-white rounded-xl shadow-sm" />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#F0EDFB]">
              <span className="text-base font-extrabold text-[#241D5E]">
                Tarif : {previewTemplate.priceLabel}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setPreviewTemplate(null)}>
                  Fermer
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleApplyTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                >
                  Appliquer ce template
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
