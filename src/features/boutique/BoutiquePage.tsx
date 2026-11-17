import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  Store, 
  ExternalLink, 
  Palette, 
  Globe, 
  Smartphone, 
  Upload, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';

export const BoutiquePage: React.FC = () => {
  const { user } = useAuth();
  const {
    stores,
    activeTemplate,
    customization,
    updateCustomColor,
    moveSection
  } = useStore();

  const [activeTab, setActiveTab] = useState<'shops' | 'editor' | 'domains'>('shops');

  const colorSwatches = [
    { name: 'Kolix Violet', hex: '#6C4CF1' },
    { name: 'Bleu Tech', hex: '#0EA5E9' },
    { name: 'Émeraude Santé', hex: '#10B981' },
    { name: 'Rose Glamour', hex: '#F43F5E' },
    { name: 'Or & Prestige', hex: '#F59E0B' },
    { name: 'Noir Luxe', hex: '#16131F' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Boutique
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Gérez votre boutique en ligne et personnalisez votre fiche produit unique pour toutes les niches COD
          </p>
        </div>

        <Link
          to="/boutique-en-ligne"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#6C4CF1] hover:bg-[#5B3FD6] text-white font-extrabold text-sm px-5 min-h-[46px] rounded-2xl shadow-kolix-cta no-underline transition-all active:scale-95 cursor-pointer"
        >
          <span>Voir ma boutique en ligne</span>
          <ExternalLink className="w-4 h-4 text-white" />
        </Link>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-[#E2DCF8] pb-1">
        {[
          { id: 'shops', label: 'Mes boutiques', icon: Globe },
          { id: 'editor', label: 'Personnaliser la fiche produit', icon: Palette },
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

      {/* TAB 1: MES BOUTIQUES */}
      {activeTab === 'shops' && (
        <div className="flex flex-col gap-6">
          {/* Active Product Page Card */}
          <div className="bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4 min-w-[260px]">
              <div className="w-16 h-16 rounded-2xl bg-[#F1ECFC] text-[#6B3FD4] flex items-center justify-center font-black text-2xl shrink-0 shadow-sm">
                🥤
              </div>
              <div>
                <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider block">
                  Fiche produit universelle active
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#241D5E] mt-0.5">
                  BlendGo – Mixeur portable 400 ml
                </h3>
                <span className="text-xs text-[#5E5A70] font-medium">
                  Page de vente COD optimisée avec compte à rebours, sélection d'offres et paiement à la livraison
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/boutique-en-ligne"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#241D5E] hover:bg-[#1C164A] text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-sm no-underline"
              >
                <span>Tester la fiche produit</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('editor')}
                className="rounded-full text-xs font-bold"
              >
                <Palette className="w-4 h-4 mr-1.5" />
                Personnaliser
              </Button>
            </div>
          </div>

          {/* Stores Grid */}
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
                  Fiche produit liée : <strong className="text-[#241D5E]">Fiche COD Standard</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Link
                    to="/boutique-en-ligne"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[#E2DCF8] text-[#241D5E] font-bold text-xs py-2.5 hover:bg-[#F4F1FE] transition-colors"
                  >
                    <span>Voir</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Button
                    variant={store.isActive ? 'navy' : 'outline'}
                    size="sm"
                    onClick={() => toast.success(`Boutique active : ${store.name}`)}
                    className="rounded-2xl text-xs"
                  >
                    {store.isActive ? 'Boutique active' : 'Gérer'}
                  </Button>
                </div>
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
                  Vendez vos produits en direct avec notre fiche de commande COD intégrée.
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
        </div>
      )}

      {/* TAB 2: PERSONNALISER (Live Editor + Mobile Frame Simulation) */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Customizer Settings */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider">
                  Personnalisation de la fiche produit
                </span>
                <h3 className="text-2xl font-extrabold text-[#241D5E] mt-0.5">
                  BlendGo – Mixeur 400 ml
                </h3>
              </div>
              <Link
                to="/boutique-en-ligne"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6C4CF1] bg-[#F4F1FE] px-3 py-1.5 rounded-full hover:bg-[#E9E3FD] transition-colors"
              >
                <span>Aperçu réel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
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
                onClick={() => toast.success('Sélecteur d’images produit ouvert')}
                className="h-28 rounded-2xl border-2 border-dashed border-[#CFC7F2] bg-[#FAF8FF] hover:bg-[#F4F1FE] text-[#4B2FC9] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5 text-[#6C4CF1]" />
                <span className="text-xs font-extrabold">+ Photos du produit (galerie)</span>
              </button>
            </div>

            {/* Primary Color Swatches */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-[#16131F]">Couleur principale de la fiche</span>
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
              <span className="text-xs font-bold text-[#16131F]">Sections de la fiche produit</span>
              <div className="flex flex-col gap-2 mt-1">
                {[
                  { id: 'gallery', label: 'Galerie d’images avec badges de réduction' },
                  { id: 'countdown', label: 'Compte à rebours promo renouvelé chaque jour' },
                  { id: 'orderForm', label: 'Formulaire de commande COD (Pack 1, 2, 3)' },
                  { id: 'benefits', label: 'Bénéfices & caractéristiques techniques' },
                  { id: 'reviews', label: 'Témoignages & avis clients vérifiés' },
                  { id: 'faq', label: 'Foire aux questions (FAQ déroulante)' }
                ].map((section, idx) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3.5 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8]/60 text-xs sm:text-sm font-bold text-[#16131F]"
                  >
                    <span>{section.label}</span>
                    <Badge variant="optimal">Actif</Badge>
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
              <div className="bg-[#FBFAFE] rounded-[34px] overflow-hidden flex flex-col min-h-[520px] text-xs">
                {/* Simulated Header */}
                <div className="px-4 py-2 bg-[#1D1430] text-white flex justify-between items-center shrink-0 text-[10px]">
                  <span className="font-bold">Ma<span className="text-[#A99BFA]">Boutique</span></span>
                  <span className="text-[9px] text-[#C9B6F7]">Livraison Gratuite</span>
                </div>

                {/* Simulated Product Banner */}
                <div className="p-3 bg-[#F1ECFC] flex flex-col items-center justify-center py-5">
                  <div className="w-20 h-24 bg-white/70 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                    🥤
                  </div>
                  <span className="text-[11px] font-extrabold text-[#1D1430] mt-2">BlendGo 400ml</span>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="font-extrabold text-[#6B3FD4]">15 900 FCFA</span>
                    <span className="line-through text-gray-400 text-[10px]">25 000 FCFA</span>
                  </div>
                </div>

                {/* Simulated Form Fields */}
                <div className="p-3 flex-1 flex flex-col gap-2">
                  <div className="bg-[#1D1430] text-white p-2 rounded-xl text-center text-[10px]">
                    ⏱️ Offre spéciale minuit : <strong>14 restants</strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#E2DCF8] space-y-1.5 shadow-sm">
                    <div className="h-5 bg-gray-100 rounded text-[9px] text-gray-500 flex items-center px-2">
                      Nom complet
                    </div>
                    <div className="h-5 bg-gray-100 rounded text-[9px] text-gray-500 flex items-center px-2">
                      Numéro WhatsApp / Téléphone
                    </div>
                    <div className="h-5 bg-gray-100 rounded text-[9px] text-gray-500 flex items-center px-2">
                      Ville & Quartier
                    </div>
                    <button
                      className="w-full text-white text-[10px] font-bold py-2 rounded-lg shadow-sm"
                      style={{ backgroundColor: customization.primaryColor }}
                    >
                      Commander – Payer à la livraison
                    </button>
                  </div>
                </div>

                {/* Simulated Footer */}
                <div className="p-2.5 bg-[#16131F] text-white text-center text-[9px]">
                  © 2026 MaBoutique · Propulsé par Kolix COD
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOMAINES */}
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
    </div>
  );
};
