import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
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
  ArrowRight,
  Plus,
  Copy,
  Layers,
  Settings,
  Eye,
  X,
  CreditCard,
  ShieldCheck,
  Tag,
  Box,
  Pencil,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';
import { MerchantStore } from '../../types/store';
import { Product } from '../../types/product';
import { productsApi } from '../../api/products.api';
import { ProductCreateModal } from '../../components/products/ProductCreateModal';

export const BoutiquePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    stores,
    activeStore,
    activeTemplate,
    customization,
    templates,
    storeProducts,
    switchActiveStore,
    createStore,
    updateStore,
    loadStoreProducts,
    updateCustomColor,
    saveCustomization,
    moveSection,
    refreshStoreData,
    isLoading
  } = useStore();
  const { subscribe } = useRealtime();

  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'shops' | 'templates' | 'editor' | 'domains'>('shops');
  const [selectedStore, setSelectedStore] = useState<MerchantStore | null>(activeStore || stores[0] || null);

  useEffect(() => {
    setPageLoading(true);
    refreshStoreData().finally(() => {
      setPageLoading(false);
    });
  }, []);

  // Template tab filters state
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [templateLimit, setTemplateLimit] = useState<number>(8);
  const [previewTemplateModal, setPreviewTemplateModal] = useState<any | null>(null);

  // Custom domain edit state
  const [customDomainInput, setCustomDomainInput] = useState<string>('');
  const [isSavingDomain, setIsSavingDomain] = useState<boolean>(false);

  // Modal: Create Store
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newStoreName, setNewStoreName] = useState<string>('');
  const [newStoreActivity, setNewStoreActivity] = useState<string>('Mode & Vêtements');
  const [newStorePlan, setNewStorePlan] = useState<string>('Grow');
  const [newStoreColor, setNewStoreColor] = useState<string>('#6C4CF1');
  const [isSubmittingStore, setIsSubmittingStore] = useState<boolean>(false);

  // Modal: Add Product to selected store
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setShowAddProductModal(true);
  };

  const handleDeleteProduct = async (prodId: string, prodName: string) => {
    if (!window.confirm(`Confirmer la suppression du produit « ${prodName} » ?`)) return;
    try {
      await productsApi.delete(prodId);
      toast.success(`Produit « ${prodName} » supprimé.`);
      if (selectedStore?.id) {
        loadStoreProducts(selectedStore.id);
      }
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    if (activeStore) {
      setSelectedStore(activeStore);
      if (activeStore.customDomain || activeStore.custom_domain) {
        setCustomDomainInput(activeStore.customDomain || activeStore.custom_domain || '');
      }
    } else if (stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0]);
    }
  }, [activeStore, stores]);

  useEffect(() => {
    if (selectedStore?.id) {
      loadStoreProducts(selectedStore.id);
    }
  }, [selectedStore?.id]);

  // Écoute des événements temps réel via WebSocket pour rafraîchir boutiques et produits
  useEffect(() => {
    const onRealtimeUpdate = () => {
      refreshStoreData();
      if (selectedStore?.id) {
        loadStoreProducts(selectedStore.id);
      }
    };

    const unsubStore = subscribe('STORE_UPDATED', onRealtimeUpdate);
    const unsubProduct = subscribe('PRODUCT_CREATED', onRealtimeUpdate);
    const unsubOrder = subscribe('ORDER_CREATED', onRealtimeUpdate);

    return () => {
      unsubStore();
      unsubProduct();
      unsubOrder();
    };
  }, [subscribe, refreshStoreData, selectedStore?.id]);

  const currentProducts: Product[] = selectedStore ? (storeProducts[selectedStore.id] || []) : [];

  const storePublicUrl = selectedStore?.id
    ? `/boutique-en-ligne?shop=${encodeURIComponent(selectedStore.id)}`
    : '/boutique-en-ligne';

  const colorSwatches = [
    { name: 'Kolix Violet', hex: '#6C4CF1' },
    { name: 'Bleu Tech', hex: '#0EA5E9' },
    { name: 'Émeraude Santé', hex: '#10B981' },
    { name: 'Rose Glamour', hex: '#F43F5E' },
    { name: 'Or & Prestige', hex: '#F59E0B' },
    { name: 'Noir Luxe', hex: '#16131F' }
  ];

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Lien copié dans le presse-papier !');
  };

  const handleSaveCustomDomain = async () => {
    if (!selectedStore) return;
    try {
      setIsSavingDomain(true);
      await updateStore(selectedStore.id, {
        custom_domain: customDomainInput.trim() || undefined
      });
      toast.success('Nom de domaine enregistré avec succès !');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour du domaine');
    } finally {
      setIsSavingDomain(false);
    }
  };

  const handleCreateStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) {
      toast.error('Veuillez saisir un nom pour votre nouvelle boutique');
      return;
    }
    try {
      setIsSubmittingStore(true);
      const created = await createStore({
        name: newStoreName.trim(),
        activity: newStoreActivity,
        plan: newStorePlan,
        accent_color: newStoreColor
      });
      setSelectedStore(created);
      setShowCreateModal(false);
      setNewStoreName('');
    } catch {
      // toast already handled in context
    } finally {
      setIsSubmittingStore(false);
    }
  };



  // Raw templates list from reference screen
  const rawTemplatesList = [
    { id: 'f-0', name: 'Kolix Essentiel', niche: 'Toutes niches', style: 'Moderne', color: '#5B3FD6', free: true },
    { id: 'f-1', name: 'Kolix Vitrine', niche: 'Toutes niches', style: 'Sobre', color: '#16131F', free: true },
    { id: 'p-mode-1', name: 'Amina Style', niche: 'Mode féminine', style: 'Moderne', color: '#C93C72', free: false },
    { id: 'p-mode-2', name: 'Kenza Luxe', niche: 'Mode féminine', style: 'Premium', color: '#A8456B', free: false },
    { id: 'p-tech-1', name: 'Volt Gadgets', niche: 'Électronique et gadgets', style: 'Moderne', color: '#2453C9', free: false },
    { id: 'p-tech-2', name: 'Nova Pro', niche: 'Électronique et gadgets', style: 'Sobre', color: '#16131F', free: false },
    { id: 'p-beauty-1', name: 'Glow Cosmetics', niche: 'Beauté et cosmétiques', style: 'Moderne', color: '#A8456B', free: false },
    { id: 'p-beauty-2', name: 'Ébène Pure', niche: 'Beauté et cosmétiques', style: 'Premium', color: '#D9B26A', free: false },
    { id: 'p-home-1', name: 'Habitat Confort', niche: 'Maison et électroménager', style: 'Sobre', color: '#2F7A5B', free: false },
    { id: 'p-wellness-1', name: 'Vitalis Nature', niche: 'Compléments et bien-être', style: 'Moderne', color: '#4E7F2A', free: false },
  ];

  if (pageLoading || (isLoading && stores.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-[#5E5A70]">Chargement de votre univers boutique...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Boutique
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Gérez vos boutiques, consultez vos produits avec leur fiche de vente COD et personnalisez votre univers de marque.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={storePublicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#6C4CF1] hover:bg-[#5B3FD6] text-white font-extrabold text-sm px-5 min-h-[46px] rounded-2xl shadow-kolix-cta no-underline transition-all active:scale-95 cursor-pointer"
          >
            <span>Voir ma boutique en ligne</span>
            <ExternalLink className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-[#E2DCF8] pb-1">
        {[
          { id: 'shops', label: `Mes boutiques (${stores.length})`, icon: Store },
          { id: 'templates', label: 'Catalogue de templates', icon: Sparkles },
          { id: 'editor', label: 'Personnaliser la fiche produit', icon: Palette },
          { id: 'domains', label: 'Domaine & Formulaire COD', icon: Globe },
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

      {/* ========================================================================= */}
      {/* TAB 1: MES BOUTIQUES (Liste des boutiques + Fiches produits détaillées) */}
      {/* ========================================================================= */}
      {activeTab === 'shops' && (
        <div className="flex flex-col gap-8">
          {/* Top Bar for Shops: Quick Switch / Summary & Action Add Store */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E2DCF8]/60 shadow-kolix-sm">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-[#EEE9FF] text-[#6C4CF1] flex items-center justify-center font-black">
                <Store className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs text-[#5E5A70] font-bold block uppercase tracking-wider">
                  Boutique actuellement active sur Kolix
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="text-lg font-black text-[#16131F]">
                    {selectedStore?.name || 'Aucune boutique sélectionnée'}
                  </h2>
                  {selectedStore && (
                    <Badge variant={selectedStore.isActive ? 'optimal' : 'default'}>
                      {selectedStore.isActive ? 'Active' : 'Secondaire'}
                    </Badge>
                  )}
                  {selectedStore?.plan && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF0DC] text-[#9A6216]">
                      Plan {selectedStore.plan}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="rounded-2xl gap-2 font-extrabold"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une boutique supplémentaire</span>
            </Button>
          </div>

          {/* Stores Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stores.map(store => {
              const isSelected = selectedStore?.id === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={cn(
                    'bg-white rounded-3xl p-6 shadow-kolix border transition-all cursor-pointer flex flex-col gap-4 relative',
                    isSelected
                      ? 'border-[#6C4CF1] ring-2 ring-[#6C4CF1]/20'
                      : 'border-[#E2DCF8]/60 hover:border-[#6C4CF1]/40'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-white text-base shadow-sm shrink-0"
                      style={{ backgroundColor: store.accentColor || '#6C4CF1' }}
                    >
                      {store.initials || store.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-extrabold text-[#16131F] truncate">{store.name}</h3>
                      <span className="text-xs text-[#5E5A70] truncate block">{store.domain}</span>
                    </div>
                    <Badge variant={store.status === 'En ligne' ? 'optimal' : 'default'}>
                      {store.status || 'En ligne'}
                    </Badge>
                  </div>

                  {/* Stats snippet */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#F0EDFB] text-xs">
                    <div>
                      <span className="text-[#5E5A70] block">Produits en vente</span>
                      <span className="text-lg font-extrabold text-[#16131F]">{store.productsCount ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-[#5E5A70] block">Commandes (7 j)</span>
                      <span className="text-lg font-extrabold text-[#16131F]">{store.ordersCount7d ?? 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#5E5A70]">
                    <span>Forfait : <strong className="text-[#241D5E]">{store.plan || 'Grow'}</strong></span>
                    <span>Modèle : <strong className="text-[#6C4CF1]">{store.templateName || 'Kolix Essentiel'}</strong></span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
                    <Link
                      to={`/boutique-en-ligne?shop=${encodeURIComponent(store.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[#E2DCF8] text-[#241D5E] font-bold text-xs py-2.5 hover:bg-[#F4F1FE] transition-colors"
                    >
                      <span>Voir en ligne</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Button
                      variant={store.isActive ? 'navy' : 'outline'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        switchActiveStore(store.id);
                        setSelectedStore(store);
                      }}
                      className="rounded-2xl text-xs"
                    >
                      {store.isActive ? 'Active sur l’app' : 'Activer'}
                    </Button>
                  </div>
                </div>
              );
            })}

            {/* Add New Store Card */}
            <div 
              onClick={() => setShowCreateModal(true)}
              className="border-2 border-dashed border-[#CFC7F2] bg-[#FAF8FF] hover:bg-[#F4F1FE] transition-all rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[220px] cursor-pointer group"
            >
              <span className="w-12 h-12 rounded-2xl bg-[#EEE9FF] text-[#6C4CF1] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6 stroke-[3]" />
              </span>
              <div>
                <h4 className="text-base font-extrabold text-[#3F25A8]">+ Créer une nouvelle boutique</h4>
                <p className="text-xs text-[#5E5A70] mt-1 max-w-[260px] leading-relaxed">
                  Lancez une autre marque ou niche avec son propre nom de domaine et son abonnement dédié.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCreateModal(true);
                }}
                className="rounded-full shadow-kolix-cta"
              >
                Créer ma boutique
              </Button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DETAILED VIEW OF SELECTED STORE (Domaine + Produits & Fiches Produits) */}
          {/* ========================================================================= */}
          {selectedStore && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-8 animate-in fade-in duration-200">
              {/* Selected Boutique Header & Domain Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#F0EDFB]">
                <div className="flex items-center gap-4">
                  <span
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-white text-xl shadow-md shrink-0"
                    style={{ backgroundColor: selectedStore.accentColor || '#6C4CF1' }}
                  >
                    {selectedStore.initials || selectedStore.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-[#16131F]">{selectedStore.name}</h3>
                      <Badge variant="optimal">En ligne</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5E5A70] mt-1 font-medium">
                      <span>Domaine assigné : <strong className="text-[#241D5E] font-bold">{selectedStore.domain}</strong></span>
                      <span>·</span>
                      <span>Plan : <strong className="text-[#6C4CF1] font-bold">{selectedStore.plan || 'Grow'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(`https://${selectedStore.domain}`)}
                    className="rounded-2xl text-xs gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le lien</span>
                  </Button>
                  <Link
                    to={`/boutique-en-ligne?shop=${encodeURIComponent(selectedStore.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#241D5E] hover:bg-[#1C164A] text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-sm no-underline"
                  >
                    <span>Tester la boutique</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(null);
                      setShowAddProductModal(true);
                    }}
                    className="rounded-2xl text-xs gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter un produit</span>
                  </Button>
                </div>
              </div>

              {/* Sub-Section 1: Noms de Domaine */}
              <div className="bg-[#FAF8FF] p-5 rounded-2xl border border-[#E2DCF8]/60 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#16131F] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#6C4CF1]" />
                      <span>Nom de domaine de la boutique</span>
                    </h4>
                    <p className="text-xs text-[#5E5A70] mt-0.5">
                      Attribué par défaut avec Kolix, vous pouvez également configurer votre propre nom de domaine personnalisé.
                    </p>
                  </div>
                  <Badge variant="optimal">SSL Sécurisé</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Default domain card */}
                  <div className="bg-white p-4 rounded-xl border border-[#E2DCF8] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#5E5A70] uppercase tracking-wider block">
                        Domaine Kolix par défaut
                      </span>
                      <span className="font-extrabold text-sm text-[#241D5E] mt-0.5 block">
                        https://{selectedStore.domain}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink(`https://${selectedStore.domain}`)}
                      className="p-2 h-auto text-[#6C4CF1]"
                      title="Copier le lien"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Custom domain input */}
                  <div className="bg-white p-4 rounded-xl border border-[#E2DCF8] flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-[#5E5A70] uppercase tracking-wider">
                      Domaine personnalisé (Ex: www.maboutique.ci)
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customDomainInput}
                        onChange={(e) => setCustomDomainInput(e.target.value)}
                        placeholder="www.maboutique.ci"
                        className="flex-1 rounded-xl bg-[#FAF8FF] border border-[#E2DCF8] px-3 py-1.5 text-xs font-semibold text-[#16131F]"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isSavingDomain}
                        onClick={handleSaveCustomDomain}
                        className="rounded-xl text-xs py-1.5"
                      >
                        {isSavingDomain ? 'Enregistrement...' : 'Lier'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Section 2: Produits et Visualisation de la Fiche Produit */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-black text-[#16131F] flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#6C4CF1]" />
                      <span>Produits de {selectedStore.name} ({currentProducts.length})</span>
                    </h4>
                    <p className="text-xs text-[#5E5A70] mt-0.5">
                      Chaque produit dispose de sa propre fiche de vente optimisée pour le Cash on Delivery.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(null);
                      setShowAddProductModal(true);
                    }}
                    className="rounded-2xl text-xs gap-1.5 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter un produit</span>
                  </Button>
                </div>

                {currentProducts.length === 0 ? (
                  <div className="border border-dashed border-[#CFC7F2] bg-[#FAF8FF] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#EEE9FF] text-[#6C4CF1] flex items-center justify-center font-bold">
                      <Box className="w-6 h-6" />
                    </span>
                    <div>
                      <h5 className="font-extrabold text-sm text-[#16131F]">Aucun produit rattaché pour le moment</h5>
                      <p className="text-xs text-[#5E5A70] mt-1 max-w-[320px]">
                        Ajoutez votre premier produit pour générer automatiquement sa fiche de vente COD avec formulaire de commande intégré.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowAddProductModal(true)}
                      className="rounded-2xl text-xs font-bold"
                    >
                      + Ajouter mon premier produit
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentProducts.map((prod) => {
                      const productUrl = `/boutique-en-ligne?shop=${encodeURIComponent(selectedStore.id)}&product=${encodeURIComponent(prod.slug || prod.id)}`;
                      return (
                        <div
                          key={prod.id}
                          className="bg-[#FAF8FF] border border-[#E2DCF8]/60 rounded-2xl p-4 flex flex-col gap-3 shadow-xs hover:border-[#6C4CF1]/40 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-xl bg-white border border-[#E2DCF8] flex items-center justify-center text-2xl shrink-0 overflow-hidden shadow-xs">
                              {prod.images && prod.images.length > 0 ? (
                                <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>📦</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-[#6C4CF1] uppercase tracking-wider block truncate">
                                {prod.category || 'Général'}
                              </span>
                              <h5 className="text-sm font-extrabold text-[#16131F] truncate mt-0.5" title={prod.name}>
                                {prod.name}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-black text-sm text-[#241D5E]">
                                  {prod.price.toLocaleString('fr-FR')} FCFA
                                </span>
                                {prod.priceOld && (
                                  <span className="line-through text-[11px] text-[#8B869C]">
                                    {prod.priceOld.toLocaleString('fr-FR')} F
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs py-2 border-t border-[#E2DCF8]/40">
                            <span className="text-[#5E5A70]">Stock disponible</span>
                            <Badge variant={prod.stockQuantity > 5 ? 'optimal' : 'faible'}>
                              {prod.stockQuantity} unités
                            </Badge>
                          </div>

                          {/* Action Buttons: Visualiser, Modifier, Supprimer */}
                          <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-[#E2DCF8]/40">
                            <Link
                              to={productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#241D5E] hover:bg-[#1C164A] text-white text-xs font-bold no-underline transition-colors"
                              title="Ouvrir la fiche produit en direct"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Fiche</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleEditProduct(prod)}
                              className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-[#F4F1FE] hover:bg-[#EAE5FC] border border-[#6C4CF1]/30 text-[#6C4CF1] text-xs font-bold transition-colors cursor-pointer"
                              title="Modifier toutes les informations de ce produit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Modifier</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="w-8 h-8 rounded-xl bg-white hover:bg-rose-50 border border-[#E2DCF8] text-[#8B869C] hover:text-rose-600 inline-flex items-center justify-center transition-colors cursor-pointer"
                              title="Supprimer ce produit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CATALOGUE DE TEMPLATES (Fidèle à _raw_screens/Boutique.dc.html) */}
      {/* ========================================================================= */}
      {activeTab === 'templates' && (
        <div className="flex flex-col gap-6">
          {/* Active Template Hero Banner */}
          <section className="bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EEE9FF] text-[#6C4CF1] flex items-center justify-center font-black text-2xl shrink-0 shadow-sm">
                ✨
              </div>
              <div>
                <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider block">
                  Template actif sur {selectedStore?.name || 'votre boutique'}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#241D5E] mt-0.5">
                  {selectedStore?.templateName || 'Kolix Essentiel'}
                </h3>
                <span className="text-xs text-[#5E5A70] font-medium">
                  Style moderne optimisé pour smartphones avec formulaire COD intégré
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setActiveTab('editor')}
              className="rounded-2xl"
            >
              <Palette className="w-4 h-4 mr-2" />
              <span>Personnaliser ce template</span>
            </Button>
          </section>

          {/* Filter Bar: Niche, Style, Prix */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-[#E2DCF8]/60">
            <div className="flex flex-col gap-1 min-w-[220px]">
              <span className="text-xs font-bold text-[#5E5A70]">Filtrer par Niche</span>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="rounded-xl border border-[#E2DCF8] px-3 py-2 text-xs font-bold bg-[#FAF8FF] text-[#16131F]"
              >
                <option value="all">Toutes les niches</option>
                <option value="Mode féminine">Mode féminine</option>
                <option value="Beauté et cosmétiques">Beauté et cosmétiques</option>
                <option value="Électronique et gadgets">Électronique et gadgets</option>
                <option value="Maison et électroménager">Maison et électroménager</option>
                <option value="Compléments et bien-être">Compléments et bien-être</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#5E5A70]">Style</span>
              <div className="flex gap-1.5 flex-wrap">
                {['all', 'Sobre', 'Moderne', 'Premium'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStyle(st)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer',
                      selectedStyle === st
                        ? 'bg-[#EEE9FF] text-[#6C4CF1] border border-[#B9AAFF]'
                        : 'bg-white text-[#5E5A70] border border-[#E2DCF8]'
                    )}
                  >
                    {st === 'all' ? 'Tous' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#5E5A70]">Tarif</span>
              <div className="flex gap-1.5 flex-wrap">
                {['all', 'Gratuits', 'Premium'].map((pr) => (
                  <button
                    key={pr}
                    onClick={() => setSelectedPrice(pr)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer',
                      selectedPrice === pr
                        ? 'bg-[#EEE9FF] text-[#6C4CF1] border border-[#B9AAFF]'
                        : 'bg-white text-[#5E5A70] border border-[#E2DCF8]'
                    )}
                  >
                    {pr === 'all' ? 'Tous' : pr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {rawTemplatesList
              .filter(t => selectedNiche === 'all' || t.niche === selectedNiche)
              .filter(t => selectedStyle === 'all' || t.style === selectedStyle)
              .filter(t => selectedPrice === 'all' || (selectedPrice === 'Gratuits' ? t.free : !t.free))
              .map(tpl => {
                const isCurrentActive = selectedStore?.templateName === tpl.name || tpl.id === 'f-0';
                return (
                  <div
                    key={tpl.id}
                    className="bg-white rounded-3xl p-4 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-3"
                  >
                    {/* Simulated Mini Template Frame */}
                    <div 
                      className="rounded-2xl p-4 flex flex-col justify-between h-40 relative overflow-hidden"
                      style={{ backgroundColor: tpl.free ? '#F1EEFA' : '#1D1430' }}
                    >
                      <div className="flex justify-between items-center z-10">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tpl.color }} 
                        />
                        <span className={cn(
                          'text-[10px] font-black px-2 py-0.5 rounded-full',
                          tpl.free ? 'bg-[#E3F4EC] text-[#1E5E3F]' : 'bg-[#D9B26A] text-[#1D1430]'
                        )}>
                          {tpl.free ? 'Gratuit' : '9 000 FCFA'}
                        </span>
                      </div>

                      <div className="z-10 mt-auto">
                        <div className="h-2 w-16 bg-white/40 rounded-full mb-1" />
                        <div className="h-1.5 w-10 bg-white/30 rounded-full" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-[#16131F]">{tpl.name}</span>
                      <span className="text-xs text-[#5E5A70]">{tpl.niche} · {tpl.style}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-[#F0EDFB]">
                      <button
                        type="button"
                        onClick={() => setPreviewTemplateModal(tpl)}
                        className="py-2 text-xs font-bold rounded-xl bg-[#FAF8FF] hover:bg-[#F4F1FE] text-[#241D5E] border border-[#E2DCF8]"
                      >
                        Aperçu
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedStore) {
                            updateStore(selectedStore.id, {
                              accent_color: tpl.color
                            });
                          }
                          toast.success(`Template ${tpl.name} appliqué avec succès !`);
                        }}
                        className={cn(
                          'py-2 text-xs font-bold rounded-xl transition-all',
                          isCurrentActive
                            ? 'bg-[#E3F4EC] text-[#1E5E3F]'
                            : 'bg-[#6C4CF1] hover:bg-[#5B3FD6] text-white'
                        )}
                      >
                        {isCurrentActive ? 'Actif' : 'Appliquer'}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PERSONNALISER LA FICHE PRODUIT (Live Editor & Smartphone Simulator) */}
      {/* ========================================================================= */}
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
                  {selectedStore?.name || 'Ma Boutique'}
                </h3>
              </div>
              <Link
                to={storePublicUrl}
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
                onClick={() => toast.success('Sélecteur de bannière ouvert')}
                className="h-28 rounded-2xl border-2 border-dashed border-[#CFC7F2] bg-[#FAF8FF] hover:bg-[#F4F1FE] text-[#4B2FC9] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5 text-[#6C4CF1]" />
                <span className="text-xs font-extrabold">+ Bannière promotionnelle (1200×400)</span>
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

            <Button
              variant="primary"
              onClick={() => saveCustomization({})}
              className="mt-2 self-start rounded-2xl"
            >
              Enregistrer les modifications
            </Button>
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
                <div className="px-4 py-2.5 bg-[#1D1430] text-white flex justify-between items-center shrink-0 text-[10px]">
                  <span className="font-extrabold flex items-center gap-1.5">
                    <span 
                      className="w-4 h-4 rounded-md flex items-center justify-center text-[9px] text-white"
                      style={{ backgroundColor: customization.primaryColor }}
                    >
                      {selectedStore?.name?.charAt(0) || 'K'}
                    </span>
                    <span>{selectedStore?.name || 'Ma Boutique'}</span>
                  </span>
                  <span className="text-[9px] text-[#C9B6F7]">Livraison Gratuite</span>
                </div>

                {/* Simulated Product Banner */}
                <div className="p-3 bg-[#F1ECFC] flex flex-col items-center justify-center py-5">
                  <div className="w-20 h-24 bg-white/70 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                    {currentProducts.length > 0 ? '📦' : '🥤'}
                  </div>
                  <span className="text-[11px] font-extrabold text-[#1D1430] mt-2">
                    {currentProducts[0]?.name || 'BlendGo 400ml'}
                  </span>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="font-extrabold" style={{ color: customization.primaryColor }}>
                      {(currentProducts[0]?.price || 15900).toLocaleString('fr-FR')} FCFA
                    </span>
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
                      className="w-full text-white text-[10px] font-bold py-2 rounded-lg shadow-sm cursor-pointer"
                      style={{ backgroundColor: customization.primaryColor }}
                    >
                      Commander – Payer à la livraison
                    </button>
                  </div>
                </div>

                {/* Simulated Footer */}
                <div className="p-2.5 bg-[#16131F] text-white text-center text-[9px]">
                  © 2026 {selectedStore?.name || 'Ma Boutique'} · Propulsé par Kolix COD
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DOMAINE & FORMULAIRE COD */}
      {/* ========================================================================= */}
      {activeTab === 'domains' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start max-w-5xl">
          {/* Domain configuration card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#241D5E]">Nom de domaine</h3>
              <p className="text-xs sm:text-sm text-[#5E5A70] mt-1">
                Connectez votre propre nom de domaine (.ci, .com, .shop) pour renforcer la crédibilité de votre boutique.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-[#F4F1FE] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#5E5A70]">Sous-domaine par défaut Kolix</span>
                  <div className="font-extrabold text-sm text-[#241D5E]">
                    https://{selectedStore?.domain || 'maboutique.kolix.shop'}
                  </div>
                </div>
                <Badge variant="optimal">Actif & SSL sécurisé</Badge>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <span className="text-xs font-bold text-[#16131F]">Domaine personnalisé</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    placeholder="Ex: www.maboutique.ci"
                    className="flex-1 min-h-[46px] rounded-2xl bg-white border border-[#E2DCF8] px-4 text-sm font-semibold"
                  />
                  <Button
                    variant="primary"
                    disabled={isSavingDomain}
                    onClick={handleSaveCustomDomain}
                    className="rounded-2xl"
                  >
                    {isSavingDomain ? 'Liaison...' : 'Lier le domaine'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* COD Form Fields configuration */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#241D5E]">Formulaire de commande COD</h3>
              <p className="text-xs sm:text-sm text-[#5E5A70] mt-1">
                Configurez les champs demandés à vos clients lors du paiement à la livraison.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Nom complet', req: true },
                { name: 'Numéro WhatsApp / Téléphone', req: true },
                { name: 'Ville et commune de livraison', req: true },
                { name: 'Quartier et repère précis', req: true },
                { name: 'Note spéciale pour le livreur', req: false },
              ].map((f) => (
                <div key={f.name} className="flex items-center justify-between p-3.5 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8]/60 text-xs sm:text-sm font-bold text-[#16131F]">
                  <span>{f.name}</span>
                  <Badge variant={f.req ? 'optimal' : 'default'}>
                    {f.req ? 'Obligatoire' : 'Facultatif'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRÉER UNE NOUVELLE BOUTIQUE */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#16131F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2DCF8] flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-[#16131F]">Créer une nouvelle boutique</h3>
                <p className="text-xs text-[#5E5A70] mt-0.5">
                  Configurez une boutique supplémentaire pour une nouvelle marque ou niche COD.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF8FF] text-[#5E5A70] hover:text-[#16131F] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-[#F4F1FE] rounded-2xl border border-[#E2DCF8] text-xs text-[#3F25A8] font-medium leading-relaxed">
              ℹ️ <strong>Rappel :</strong> Créer une boutique supplémentaire revient à souscrire à un abonnement dédié pour cette nouvelle boutique.
            </div>

            <form onSubmit={handleCreateStoreSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#16131F]">Nom de la boutique *</label>
                <input
                  type="text"
                  required
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="Ex: Kaly Cosmétiques, Abidjan Tech..."
                  className="rounded-2xl border border-[#E2DCF8] px-4 py-2.5 text-sm font-semibold text-[#16131F] bg-[#FAF8FF]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#16131F]">Niche / Type d’activité</label>
                <select
                  value={newStoreActivity}
                  onChange={(e) => setNewStoreActivity(e.target.value)}
                  className="rounded-2xl border border-[#E2DCF8] px-4 py-2.5 text-sm font-semibold text-[#16131F] bg-[#FAF8FF]"
                >
                  <option value="Mode & Vêtements">Mode & Vêtements</option>
                  <option value="Beauté & Cosmétiques">Beauté & Cosmétiques</option>
                  <option value="Électronique & High-Tech">Électronique & High-Tech</option>
                  <option value="Maison & Cuisine">Maison & Cuisine</option>
                  <option value="Santé & Bien-être">Santé & Bien-être</option>
                  <option value="Généraliste / Autres">Généraliste / Autres</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#16131F]">Forfait associé</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Start', 'Grow', 'Pro', 'Empire'].map((pl) => (
                    <button
                      key={pl}
                      type="button"
                      onClick={() => setNewStorePlan(pl)}
                      className={cn(
                        'py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center',
                        newStorePlan === pl
                          ? 'bg-[#6C4CF1] text-white border-[#6C4CF1]'
                          : 'bg-[#FAF8FF] text-[#5E5A70] border-[#E2DCF8]'
                      )}
                    >
                      {pl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#16131F]">Couleur d'accent de la marque</label>
                <div className="flex gap-2">
                  {colorSwatches.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setNewStoreColor(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={cn(
                        'w-8 h-8 rounded-xl transition-all cursor-pointer relative',
                        newStoreColor === c.hex && 'ring-2 ring-offset-2 ring-[#6C4CF1]'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-2xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmittingStore}
                  className="rounded-2xl font-extrabold"
                >
                  {isSubmittingStore ? 'Création...' : 'Créer ma boutique'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AJOUTER / MODIFIER UN PRODUIT COMPLET */}
      <ProductCreateModal
        isOpen={showAddProductModal}
        onClose={() => {
          setShowAddProductModal(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          if (selectedStore) {
            loadStoreProducts(selectedStore.id);
          }
        }}
        defaultShopId={selectedStore?.id || activeStore?.id}
        productToEdit={editingProduct}
      />
    </div>
  );
};
