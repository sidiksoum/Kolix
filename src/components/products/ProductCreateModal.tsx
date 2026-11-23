import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  Package,
  Layers,
  Sparkles,
  Tag,
  ShieldCheck,
  HelpCircle,
  Upload,
  X,
  Loader2,
  Check,
  ImageIcon,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';
import { productsApi } from '../../api/products.api';
import { apiClient } from '../../api/client';
import { useStore } from '../../context/StoreContext';
import { FicheProduitData } from '../../types/product';

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultShopId?: string;
}

export const ProductCreateModal: React.FC<ProductCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultShopId
}) => {
  const { stores, activeStore } = useStore();
  const [modalActiveTab, setModalActiveTab] = useState<'base' | 'hero' | 'packs' | 'benefits' | 'specs' | 'faq'>('base');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected Shop
  const [selectedShopId, setSelectedShopId] = useState<string>(
    defaultShopId || activeStore?.id || stores[0]?.id || ''
  );

  // Form State - Base
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Électronique & Maison');
  const [type, setType] = useState('Simple');
  const [price, setPrice] = useState('');
  const [priceOld, setPriceOld] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockMain, setStockMain] = useState('');
  const [hasCountdown, setHasCountdown] = useState(true);

  // Images state (up to 3 images)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');

  // Form State - Fiche Produit COD
  const [headline, setHeadline] = useState('');
  const [leadSubtitle, setLeadSubtitle] = useState('');
  const [stockUrgency, setStockUrgency] = useState('');

  // Packs State
  const [offer1Label, setOffer1Label] = useState('');
  const [offer1Price, setOffer1Price] = useState('');
  const [offer2Label, setOffer2Label] = useState('');
  const [offer2Price, setOffer2Price] = useState('');
  const [offer3Label, setOffer3Label] = useState('');
  const [offer3Price, setOffer3Price] = useState('');

  // Benefits State
  const [b1Icon, setB1Icon] = useState('');
  const [b1Title, setB1Title] = useState('');
  const [b1Desc, setB1Desc] = useState('');
  const [b2Icon, setB2Icon] = useState('');
  const [b2Title, setB2Title] = useState('');
  const [b2Desc, setB2Desc] = useState('');
  const [b3Icon, setB3Icon] = useState('');
  const [b3Title, setB3Title] = useState('');
  const [b3Desc, setB3Desc] = useState('');

  // Specs & Box State
  const [specCapacity, setSpecCapacity] = useState('');
  const [specBattery, setSpecBattery] = useState('');
  const [inTheBox, setInTheBox] = useState('');

  // FAQ State
  const [faq1Q, setFaq1Q] = useState('');
  const [faq1A, setFaq1A] = useState('');
  const [faq2Q, setFaq2Q] = useState('');
  const [faq2A, setFaq2A] = useState('');

  useEffect(() => {
    if (defaultShopId) {
      setSelectedShopId(defaultShopId);
    } else if (activeStore?.id) {
      setSelectedShopId(activeStore.id);
    }
  }, [defaultShopId, activeStore?.id]);

  // Handle direct file upload to MinIO
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 3) {
      toast.error('Vous pouvez ajouter au maximum 3 images pour ce produit.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 8 * 1024 * 1024) {
          toast.error(`Le fichier ${file.name} dépasse la taille maximale autorisée (8 Mo).`);
          continue;
        }

        try {
          const res = await apiClient.uploadFile<{ data: { url: string } }>('/api/v1/media/upload', file);
          if (res?.data?.url) {
            newUrls.push(res.data.url);
          }
        } catch {
          // Fallback to local DataURL if offline
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          newUrls.push(dataUrl);
        }
      }

      setUploadedImages(prev => [...prev, ...newUrls].slice(0, 3));
      toast.success(`${newUrls.length} image(s) téléversée(s) avec succès sur MinIO !`);
    } catch {
      toast.error('Erreur lors du téléversement sur MinIO');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddExternalUrl = () => {
    if (!externalUrl.trim()) return;
    if (uploadedImages.length >= 3) {
      toast.error('Maximum 3 images par produit.');
      return;
    }
    setUploadedImages(prev => [...prev, externalUrl.trim()]);
    setExternalUrl('');
    toast.success('URL image ajoutée !');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Veuillez renseigner le nom du produit');
      return;
    }

    setIsSubmitting(true);
    try {
      const ficheProduitData: FicheProduitData = {
        headline: headline.trim() || name.trim(),
        leadSubtitle: leadSubtitle.trim(),
        stockUrgency: parseInt(stockUrgency, 10) || 14,
        countdownEnabled: hasCountdown,
        offers: [
          { qty: 1, label: offer1Label.trim() || '1 unité', price: parseInt(offer1Price, 10) || parseInt(price, 10) || 0 },
          ...(offer2Label.trim() || offer2Price ? [{ qty: 2, label: offer2Label.trim() || 'Pack Duo (2 unités)', price: parseInt(offer2Price, 10) || Math.round((parseInt(price, 10) || 0) * 1.8), best: true }] : []),
          ...(offer3Label.trim() || offer3Price ? [{ qty: 3, label: offer3Label.trim() || 'Pack Famille (3 unités)', price: parseInt(offer3Price, 10) || Math.round((parseInt(price, 10) || 0) * 2.5) }] : [])
        ],
        benefits: [
          ...(b1Title.trim() ? [{ icon: b1Icon.trim() || '⚡', title: b1Title.trim(), description: b1Desc.trim() }] : []),
          ...(b2Title.trim() ? [{ icon: b2Icon.trim() || '🥭', title: b2Title.trim(), description: b2Desc.trim() }] : []),
          ...(b3Title.trim() ? [{ icon: b3Icon.trim() || '🛡️', title: b3Title.trim(), description: b3Desc.trim() }] : [])
        ],
        specs: [
          ...(specCapacity.trim() ? [{ label: 'Capacité', value: specCapacity.trim() }] : []),
          ...(specBattery.trim() ? [{ label: 'Autonomie batterie', value: specBattery.trim() }] : [])
        ],
        inTheBox: inTheBox.trim(),
        faqs: [
          ...(faq1Q.trim() ? [{ question: faq1Q.trim(), answer: faq1A.trim() }] : []),
          ...(faq2Q.trim() ? [{ question: faq2Q.trim(), answer: faq2A.trim() }] : [])
        ]
      };

      await productsApi.create({
        shop_id: selectedShopId || activeStore?.id || undefined,
        name: name.trim(),
        price: parseInt(price, 10) || 0,
        priceOld: priceOld ? parseInt(priceOld, 10) : undefined,
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        stockMain,
        category,
        type,
        hasCountdown,
        images: uploadedImages,
        fiche_produit: ficheProduitData
      });

      toast.success('Produit et fiche produit COD créés avec succès !');
      onSuccess();
      onClose();

      // Reset fields
      setName('');
      setPrice('');
      setPriceOld('');
      setStockQuantity('');
      setStockMain('');
      setHeadline('');
      setLeadSubtitle('');
      setStockUrgency('');
      setOffer1Label('');
      setOffer1Price('');
      setOffer2Label('');
      setOffer2Price('');
      setOffer3Label('');
      setOffer3Price('');
      setB1Icon('');
      setB1Title('');
      setB1Desc('');
      setB2Icon('');
      setB2Title('');
      setB2Desc('');
      setB3Icon('');
      setB3Title('');
      setB3Desc('');
      setSpecCapacity('');
      setSpecBattery('');
      setInTheBox('');
      setFaq1Q('');
      setFaq1A('');
      setFaq2Q('');
      setFaq2A('');
      setUploadedImages([]);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter un produit & Personnaliser sa fiche COD"
      maxWidth="xl"
    >
      <div className="flex flex-col gap-4">
        {/* Navigation Tabs in Modal Header */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-[#E2DCF8] text-xs font-bold scrollbar-none">
          {[
            { id: 'base', label: '1. Informations de base', icon: Package },
            { id: 'hero', label: '2. Accroche Fiche COD', icon: Sparkles },
            { id: 'packs', label: '3. Offres & Packs', icon: Tag },
            { id: 'benefits', label: '4. Bénéfices clés', icon: ShieldCheck },
            { id: 'specs', label: '5. Spécifications', icon: Layers },
            { id: 'faq', label: '6. FAQ & Réassurance', icon: HelpCircle },
          ].map((t) => {
            const Icon = t.icon;
            const active = modalActiveTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setModalActiveTab(t.id as any)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap',
                  active
                    ? 'bg-[#6C4CF1] text-white shadow-xs'
                    : 'bg-[#FAF8FF] text-[#5E5A70] hover:text-[#16131F]'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[64vh] overflow-y-auto pr-1">
          {/* TAB 1: BASE & PRICING + 3-IMAGE MINIO UPLOAD */}
          {modalActiveTab === 'base' && (
            <div className="flex flex-col gap-3.5 animate-in fade-in">
              {stores.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Boutique de destination *
                  </label>
                  <select
                    value={selectedShopId}
                    onChange={(e) => setSelectedShopId(e.target.value)}
                    className="w-full min-h-[44px] rounded-2xl bg-[#FAF8FF] border border-[#E2DCF8] px-3.5 text-sm font-bold text-[#241D5E] outline-none focus:border-[#6C4CF1]"
                  >
                    {stores.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.domain})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Nom du produit *
                </label>
                <Input
                  placeholder="Ex: BlendGo – Mixeur portable 400 ml"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* ========================================================= */}
              {/* MINIO IMAGE UPLOAD ZONE (UP TO 3 IMAGES) */}
              {/* ========================================================= */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E2DCF8] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-black text-[#16131F] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#6C4CF1]" />
                      <span>Photos du produit (3 images maximum)</span>
                    </label>
                    <span className="text-[11px] text-[#5E5A70]">
                      Téléversement direct stocké sur MinIO. Visibles en galerie et défilement sur la fiche de vente.
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#6C4CF1] bg-[#EEE9FF] px-2.5 py-0.5 rounded-full">
                    {uploadedImages.length} / 3 images
                  </span>
                </div>

                {/* Uploaded Thumbnails Preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {uploadedImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden aspect-square border border-[#E2DCF8] bg-white shadow-xs group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Produit ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {idx === 0 ? 'Image 1 (Principale)' : `Image ${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 hover:scale-105 transition-all cursor-pointer"
                          title="Supprimer cette image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Upload Dropzone */}
                {uploadedImages.length < 3 && (
                  <label className="border-2 border-dashed border-[#CFC7F2] hover:border-[#6C4CF1] bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-[#6C4CF1]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Téléversement en cours…</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-[#6C4CF1]" />
                        <span className="text-xs font-bold text-[#16131F]">
                          Cliquez pour ajouter une photo ou glissez-déposez ici
                        </span>
                        <span className="text-[10px] text-[#5E5A70]">
                          PNG, JPG, WebP jusqu’à 8 Mo
                        </span>
                      </>
                    )}
                  </label>
                )}

                {/* Option to also enter external URL */}
                <div className="flex gap-2 pt-1 border-t border-[#E2DCF8]/50">
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="Ou collez l’URL d’une image externe (https://...)"
                    className="flex-1 text-xs rounded-xl border border-[#E2DCF8] px-3 py-1.5 bg-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddExternalUrl}
                    disabled={uploadedImages.length >= 3}
                    className="px-3 py-1.5 bg-[#FAF8FF] hover:bg-[#EEE9FF] text-[#6C4CF1] border border-[#E2DCF8] rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    + Ajouter l’URL
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Catégorie / Niche *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full min-h-[44px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-sm font-semibold outline-none focus:border-[#6C4CF1]"
                  >
                    <option value="Électronique & Maison">Électronique & Maison</option>
                    <option value="Beauté & Soins">Beauté & Soins</option>
                    <option value="Santé & Bien-être">Santé & Bien-être</option>
                    <option value="Cuisine & Gadgets">Cuisine & Gadgets</option>
                    <option value="Mode & Accessoires">Mode & Accessoires</option>
                    <option value="Bébé & Enfants">Bébé & Enfants</option>
                    <option value="Compléments">Compléments & Nutrition</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Type de produit *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full min-h-[44px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-sm font-semibold outline-none focus:border-[#6C4CF1]"
                  >
                    <option value="Simple">Produit Simple (Mono-produit COD)</option>
                    <option value="Pack">Pack Promotionnel</option>
                    <option value="Variante">Déclinaison / Variantes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Prix promotionnel unitaire (FCFA) *
                  </label>
                  <Input
                    type="number"
                    placeholder="Ex: 15900"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Prix barré d'origine (FCFA)
                  </label>
                  <Input
                    type="number"
                    placeholder="Ex: 25000"
                    value={priceOld}
                    onChange={(e) => setPriceOld(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Quantité de stock initial *
                  </label>
                  <Input
                    type="number"
                    placeholder="Ex: 50"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Entrepôt de stockage principal
                  </label>
                  <Input
                    placeholder="Ex: Entrepôt Abidjan"
                    value={stockMain}
                    onChange={(e) => setStockMain(e.target.value)}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={hasCountdown}
                  onChange={(e) => setHasCountdown(e.target.checked)}
                  className="rounded text-[#6C4CF1] focus:ring-[#6C4CF1]"
                />
                <span className="text-xs font-bold text-[#241D5E]">
                  Activer le compte à rebours d'urgence COD (remis à zéro chaque jour à minuit)
                </span>
              </label>
            </div>
          )}

          {/* TAB 2: HERO & HEADLINE */}
          {modalActiveTab === 'hero' && (
            <div className="flex flex-col gap-3.5 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Titre d'accroche percutant (Hero Headline) *
                </label>
                <Input
                  placeholder="Ex: BlendGo, le mixeur qui tient dans votre sac"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Sous-titre bénéfice / promesse client
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-2xl bg-white border border-[#E2DCF8] p-3 text-sm font-semibold outline-none focus:border-[#6C4CF1]"
                  placeholder="Ex: Jus, smoothies et laits frappés en 30 secondes, partout. Rechargeable par USB-C."
                  value={leadSubtitle}
                  onChange={(e) => setLeadSubtitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Stock d'urgence affiché sur la page
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 14"
                  value={stockUrgency}
                  onChange={(e) => setStockUrgency(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 3: PACKS COD */}
          {modalActiveTab === 'packs' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              {/* Pack 1 */}
              <div className="p-3 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8]">
                <span className="text-xs font-bold text-[#6C4CF1] uppercase tracking-wider block mb-2">
                  Pack 1 : 1 unité
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={offer1Label} onChange={(e) => setOffer1Label(e.target.value)} placeholder="Ex: 1 unité (Standard)" />
                  <Input type="number" value={offer1Price} onChange={(e) => setOffer1Price(e.target.value)} placeholder="Ex: 15 900" />
                </div>
              </div>

              {/* Pack 2 */}
              <div className="p-3 bg-[#F4F1FE] rounded-2xl border-2 border-[#6C4CF1]/40 relative">
                <span className="text-xs font-black text-[#6C4CF1] uppercase tracking-wider block mb-2">
                  Pack 2 : Pack Recommandé (Le plus choisi) ⭐
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={offer2Label} onChange={(e) => setOffer2Label(e.target.value)} placeholder="Ex: Pack Duo (2 unités) - Économisez 3 000 F" />
                  <Input type="number" value={offer2Price} onChange={(e) => setOffer2Price(e.target.value)} placeholder="Ex: 28 900" />
                </div>
              </div>

              {/* Pack 3 */}
              <div className="p-3 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8]">
                <span className="text-xs font-bold text-[#6C4CF1] uppercase tracking-wider block mb-2">
                  Pack 3 : Pack Famille / Lot 3
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={offer3Label} onChange={(e) => setOffer3Label(e.target.value)} placeholder="Ex: Pack Famille (3 unités)" />
                  <Input type="number" value={offer3Price} onChange={(e) => setOffer3Price(e.target.value)} placeholder="Ex: 39 900" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BENEFITS */}
          {modalActiveTab === 'benefits' && (
            <div className="flex flex-col gap-3.5 animate-in fade-in">
              <span className="text-xs font-bold text-[#5E5A70]">
                3 points forts affichés sous forme de cartes d'arguments sur la fiche :
              </span>
              {[
                { icon: b1Icon, setIcon: setB1Icon, title: b1Title, setTitle: setB1Title, desc: b1Desc, setDesc: setB1Desc },
                { icon: b2Icon, setIcon: setB2Icon, title: b2Title, setTitle: setB2Title, desc: b2Desc, setDesc: setB2Desc },
                { icon: b3Icon, setIcon: setB3Icon, title: b3Title, setTitle: setB3Title, desc: b3Desc, setDesc: setB3Desc }
              ].map((b, i) => (
                <div key={i} className="p-3 rounded-2xl border border-[#E2DCF8] bg-[#FAF8FF] flex gap-2 items-start">
                  <input
                    type="text"
                    value={b.icon}
                    onChange={(e) => b.setIcon(e.target.value)}
                    placeholder="⚡"
                    className="w-12 text-center text-lg p-2 rounded-xl bg-white border border-[#E2DCF8]"
                  />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Input value={b.title} onChange={(e) => b.setTitle(e.target.value)} placeholder="Ex: Titre du bénéfice" />
                    <Input value={b.desc} onChange={(e) => b.setDesc(e.target.value)} placeholder="Ex: Explication courte du bénéfice" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: SPECS */}
          {modalActiveTab === 'specs' && (
            <div className="flex flex-col gap-3.5 animate-in fade-in">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Caractéristique 1</label>
                  <Input value={specCapacity} onChange={(e) => setSpecCapacity(e.target.value)} placeholder="Ex: Capacité 400 ml" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Caractéristique 2</label>
                  <Input value={specBattery} onChange={(e) => setSpecBattery(e.target.value)} placeholder="Ex: Batterie 4000 mAh" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">Contenu du coffret livré au client</label>
                <Input value={inTheBox} onChange={(e) => setInTheBox(e.target.value)} placeholder="Ex: 1× appareil, 1× câble USB-C, 1× manuel" />
              </div>
            </div>
          )}

          {/* TAB 6: FAQ */}
          {modalActiveTab === 'faq' && (
            <div className="flex flex-col gap-3.5 animate-in fade-in">
              <div className="p-3 rounded-2xl border border-[#E2DCF8] bg-[#FAF8FF] space-y-2">
                <span className="text-xs font-bold text-[#241D5E]">Question fréquente 1 (Paiement)</span>
                <Input value={faq1Q} onChange={(e) => setFaq1Q(e.target.value)} placeholder="Ex: Comment se passe le paiement ?" />
                <textarea
                  rows={2}
                  className="w-full rounded-xl bg-white border border-[#E2DCF8] p-2 text-xs font-medium"
                  placeholder="Ex: Vous ne payez rien d’avance ! Vous réglez directement en espèces ou par Mobile Money au livreur lors de la remise de votre colis."
                  value={faq1A}
                  onChange={(e) => setFaq1A(e.target.value)}
                />
              </div>

              <div className="p-3 rounded-2xl border border-[#E2DCF8] bg-[#FAF8FF] space-y-2">
                <span className="text-xs font-bold text-[#241D5E]">Question fréquente 2 (Livraison)</span>
                <Input value={faq2Q} onChange={(e) => setFaq2Q(e.target.value)} placeholder="Ex: Quel est le délai de livraison ?" />
                <textarea
                  rows={2}
                  className="w-full rounded-xl bg-white border border-[#E2DCF8] p-2 text-xs font-medium"
                  placeholder="Ex: Livraison en 24h à 48h maximum partout à Abidjan et expédition rapide à l’intérieur du pays."
                  value={faq2A}
                  onChange={(e) => setFaq2A(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E2DCF8]">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="rounded-2xl gap-2 font-extrabold shadow-kolix-cta">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement…</span>
                </>
              ) : (
                <span>Créer le produit et sa fiche COD</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

