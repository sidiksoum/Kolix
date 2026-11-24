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
  Plus,
  MessageSquareQuote
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';
import { productsApi } from '../../api/products.api';
import { apiClient } from '../../api/client';
import { useStore } from '../../context/StoreContext';
import { FicheProduitData, FicheProduitOffer, FicheProduitReview, Product } from '../../types/product';

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultShopId?: string;
  productToEdit?: Product | null;
}

export const ProductCreateModal: React.FC<ProductCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultShopId,
  productToEdit
}) => {
  const { stores, activeStore } = useStore();
  const [modalActiveTab, setModalActiveTab] = useState<'base' | 'hero' | 'packs' | 'benefits' | 'specs' | 'faq' | 'reviews'>('base');
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

  // Form State - Fiche Produit COD (Hero & Marketing Story)
  const [headline, setHeadline] = useState('');
  const [leadSubtitle, setLeadSubtitle] = useState('');
  const [stockUrgency, setStockUrgency] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyText, setStoryText] = useState('');

  // Packs / Offers State
  const [offer1Label, setOffer1Label] = useState('1 unité');
  const [offer1Price, setOffer1Price] = useState('');
  
  const [hasOffer2, setHasOffer2] = useState(false);
  const [offer2Label, setOffer2Label] = useState('Pack 2 unités');
  const [offer2Price, setOffer2Price] = useState('');
  const [offer2Best, setOffer2Best] = useState(true);

  const [hasOffer3, setHasOffer3] = useState(false);
  const [offer3Label, setOffer3Label] = useState('Pack 3 unités');
  const [offer3Price, setOffer3Price] = useState('');

  // Benefits State
  const [b1Icon, setB1Icon] = useState('⚡');
  const [b1Title, setB1Title] = useState('');
  const [b1Desc, setB1Desc] = useState('');
  const [b2Icon, setB2Icon] = useState('🥭');
  const [b2Title, setB2Title] = useState('');
  const [b2Desc, setB2Desc] = useState('');
  const [b3Icon, setB3Icon] = useState('🛡️');
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

  // Reviews State
  const [reviewsEnabled, setReviewsEnabled] = useState(true);
  const [rev1Author, setRev1Author] = useState('Mariam K.');
  const [rev1Loc, setRev1Loc] = useState('Cocody');
  const [rev1Rating, setRev1Rating] = useState(5);
  const [rev1Comment, setRev1Comment] = useState('« J’ai pris le pack de deux, un pour moi et un pour ma sœur. Très satisfaite du produit et de la livraison rapide. »');

  const [rev2Author, setRev2Author] = useState('Yao F.');
  const [rev2Loc, setRev2Loc] = useState('Bouaké');
  const [rev2Rating, setRev2Rating] = useState(5);
  const [rev2Comment, setRev2Comment] = useState('« Livré en 48 h à Bouaké. Le livreur a attendu que je teste avant de payer. Très sérieux. »');

  const [rev3Author, setRev3Author] = useState('Christelle A.');
  const [rev3Loc, setRev3Loc] = useState('Yopougon');
  const [rev3Rating, setRev3Rating] = useState(4);
  const [rev3Comment, setRev3Comment] = useState('« Petit mais très costaud, il fonctionne parfaitement. La batterie tient presque une semaine. »');

  // Populate form if editing an existing product, or reset for a new product
  useEffect(() => {
    if (productToEdit && isOpen) {
      setSelectedShopId(productToEdit.shop_id || defaultShopId || activeStore?.id || '');
      setName(productToEdit.name || '');
      setCategory(productToEdit.category || 'Électronique & Maison');
      setType(productToEdit.type || 'Simple');
      setPrice(productToEdit.price ? String(productToEdit.price) : '');
      setPriceOld(productToEdit.priceOld ? String(productToEdit.priceOld) : '');
      setStockQuantity(productToEdit.stockQuantity ? String(productToEdit.stockQuantity) : '0');
      setStockMain(productToEdit.stockMain || 'Entrepôt Abidjan');
      setHasCountdown(productToEdit.hasCountdown ?? productToEdit.fiche_produit?.countdownEnabled ?? true);
      setUploadedImages(productToEdit.images || []);

      const fp = productToEdit.fiche_produit;
      setHeadline(fp?.headline || productToEdit.name || '');
      setLeadSubtitle(fp?.leadSubtitle || productToEdit.description || '');
      setStockUrgency(fp?.stockUrgency ? String(fp.stockUrgency) : '14');
      setStoryTitle(fp?.storyTitle || '');
      setStoryText(fp?.storyText || productToEdit.description || '');

      // Offers
      const offers = fp?.offers || [];
      if (offers.length > 0) {
        setOffer1Label(offers[0]?.label || '1 unité');
        setOffer1Price(offers[0]?.price ? String(offers[0].price) : String(productToEdit.price));
      } else {
        setOffer1Label('1 unité');
        setOffer1Price(productToEdit.price ? String(productToEdit.price) : '');
      }

      if (offers.length > 1) {
        setHasOffer2(true);
        setOffer2Label(offers[1]?.label || 'Pack 2 unités');
        setOffer2Price(offers[1]?.price ? String(offers[1].price) : '');
        setOffer2Best(offers[1]?.best ?? true);
      } else {
        setHasOffer2(false);
        setOffer2Label('Pack 2 unités');
        setOffer2Price('');
        setOffer2Best(true);
      }

      if (offers.length > 2) {
        setHasOffer3(true);
        setOffer3Label(offers[2]?.label || 'Pack 3 unités');
        setOffer3Price(offers[2]?.price ? String(offers[2].price) : '');
      } else {
        setHasOffer3(false);
        setOffer3Label('Pack 3 unités');
        setOffer3Price('');
      }

      // Benefits
      const b = fp?.benefits || [];
      setB1Icon(b[0]?.icon || '⚡');
      setB1Title(b[0]?.title || '');
      setB1Desc(b[0]?.description || '');
      setB2Icon(b[1]?.icon || '🥭');
      setB2Title(b[1]?.title || '');
      setB2Desc(b[1]?.description || '');
      setB3Icon(b[2]?.icon || '🛡️');
      setB3Title(b[2]?.title || '');
      setB3Desc(b[2]?.description || '');

      // Specs
      const s = fp?.specs || [];
      setSpecCapacity(s[0]?.value || '');
      setSpecBattery(s[1]?.value || '');
      setInTheBox(fp?.inTheBox || '');

      // FAQs
      const f = fp?.faqs || [];
      setFaq1Q(f[0]?.question || '');
      setFaq1A(f[0]?.answer || '');
      setFaq2Q(f[1]?.question || '');
      setFaq2A(f[1]?.answer || '');

      // Reviews
      setReviewsEnabled(fp?.reviewsEnabled ?? true);
      const revs = fp?.reviews || [];
      if (revs.length > 0) {
        setRev1Author(revs[0]?.author || 'Mariam K.');
        setRev1Loc(revs[0]?.location || 'Cocody');
        setRev1Rating(revs[0]?.rating || 5);
        setRev1Comment(revs[0]?.comment || '');
      }
      if (revs.length > 1) {
        setRev2Author(revs[1]?.author || 'Yao F.');
        setRev2Loc(revs[1]?.location || 'Bouaké');
        setRev2Rating(revs[1]?.rating || 5);
        setRev2Comment(revs[1]?.comment || '');
      }
      if (revs.length > 2) {
        setRev3Author(revs[2]?.author || 'Christelle A.');
        setRev3Loc(revs[2]?.location || 'Yopougon');
        setRev3Rating(revs[2]?.rating || 4);
        setRev3Comment(revs[2]?.comment || '');
      }
    } else if (!productToEdit && isOpen) {
      // Create mode: reset
      setName('');
      setCategory('Électronique & Maison');
      setType('Simple');
      setPrice('');
      setPriceOld('');
      setStockQuantity('');
      setStockMain('Entrepôt Abidjan');
      setHasCountdown(true);
      setUploadedImages([]);
      setHeadline('');
      setLeadSubtitle('');
      setStockUrgency('14');
      setStoryTitle('');
      setStoryText('');
      setOffer1Label('1 unité');
      setOffer1Price('');
      setHasOffer2(false);
      setOffer2Label('Pack 2 unités');
      setOffer2Price('');
      setOffer2Best(true);
      setHasOffer3(false);
      setOffer3Label('Pack 3 unités');
      setOffer3Price('');
      setB1Icon('⚡');
      setB1Title('');
      setB1Desc('');
      setB2Icon('🥭');
      setB2Title('');
      setB2Desc('');
      setB3Icon('🛡️');
      setB3Title('');
      setB3Desc('');
      setSpecCapacity('');
      setSpecBattery('');
      setInTheBox('');
      setFaq1Q('');
      setFaq1A('');
      setFaq2Q('');
      setFaq2A('');
      setReviewsEnabled(true);
    }
  }, [productToEdit, isOpen, defaultShopId, activeStore?.id]);

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
      const basePriceNum = parseInt(price, 10) || 0;

      // Build offers array according to user configuration
      const offersList: FicheProduitOffer[] = [
        {
          qty: 1,
          label: offer1Label.trim() || '1 unité',
          price: parseInt(offer1Price, 10) || basePriceNum
        }
      ];

      if (hasOffer2) {
        offersList.push({
          qty: 2,
          label: offer2Label.trim() || 'Pack Duo (2 unités)',
          price: parseInt(offer2Price, 10) || Math.round(basePriceNum * 1.8),
          best: offer2Best
        });
      }

      if (hasOffer3) {
        offersList.push({
          qty: 3,
          label: offer3Label.trim() || 'Pack Famille (3 unités)',
          price: parseInt(offer3Price, 10) || Math.round(basePriceNum * 2.5),
          best: false
        });
      }

      // Build reviews list
      const reviewsList: FicheProduitReview[] = [];
      if (reviewsEnabled) {
        if (rev1Comment.trim()) {
          reviewsList.push({
            author: rev1Author.trim() || 'Client vérifié',
            location: rev1Loc.trim() || 'Abidjan',
            rating: rev1Rating,
            comment: rev1Comment.trim(),
            verified: true
          });
        }
        if (rev2Comment.trim()) {
          reviewsList.push({
            author: rev2Author.trim() || 'Client vérifié',
            location: rev2Loc.trim() || 'Bouaké',
            rating: rev2Rating,
            comment: rev2Comment.trim(),
            verified: true
          });
        }
        if (rev3Comment.trim()) {
          reviewsList.push({
            author: rev3Author.trim() || 'Client vérifié',
            location: rev3Loc.trim() || 'Yopougon',
            rating: rev3Rating,
            comment: rev3Comment.trim(),
            verified: true
          });
        }
      }

      const ficheProduitData: FicheProduitData = {
        headline: headline.trim() || name.trim(),
        leadSubtitle: leadSubtitle.trim(),
        stockUrgency: parseInt(stockUrgency, 10) || 14,
        countdownEnabled: hasCountdown,
        storyTitle: storyTitle.trim() || undefined,
        storyText: storyText.trim() || undefined,
        offers: offersList,
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
        ],
        reviews: reviewsList,
        reviewsEnabled
      };

      const payload = {
        shop_id: selectedShopId || activeStore?.id || undefined,
        name: name.trim(),
        price: basePriceNum,
        priceOld: priceOld ? parseInt(priceOld, 10) : undefined,
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        stockMain: stockMain.trim() || 'Entrepôt Abidjan',
        category,
        type,
        hasCountdown,
        images: uploadedImages,
        fiche_produit: ficheProduitData
      };

      if (productToEdit) {
        await productsApi.update(productToEdit.id, payload);
        toast.success(`Le produit « ${name.trim()} » a été mis à jour avec succès !`);
      } else {
        await productsApi.create(payload);
        toast.success('Nouveau produit et sa fiche COD créés avec succès !');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l’enregistrement du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? `Modifier le produit : ${productToEdit.name}` : "Ajouter un produit & Personnaliser sa fiche COD"}
      maxWidth="xl"
    >
      <div className="flex flex-col gap-4">
        {/* Navigation Tabs in Modal Header */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-[#E2DCF8] text-xs font-bold scrollbar-none">
          {[
            { id: 'base', label: '1. Informations de base', icon: Package },
            { id: 'hero', label: '2. Accroche & Argumentaire', icon: Sparkles },
            { id: 'packs', label: '3. Offres & Packs', icon: Tag },
            { id: 'benefits', label: '4. Bénéfices clés', icon: ShieldCheck },
            { id: 'specs', label: '5. Spécifications', icon: Layers },
            { id: 'faq', label: '6. FAQ & Réassurance', icon: HelpCircle },
            { id: 'reviews', label: '7. Avis clients', icon: MessageSquareQuote },
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

              {/* MINIO IMAGE UPLOAD ZONE (UP TO 3 IMAGES) */}
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

              {/* Countdown Urgency Toggle */}
              <label className="flex items-start gap-2.5 cursor-pointer p-3 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8] mt-1">
                <input
                  type="checkbox"
                  checked={hasCountdown}
                  onChange={(e) => setHasCountdown(e.target.checked)}
                  className="mt-0.5 rounded text-[#6C4CF1] focus:ring-[#6C4CF1]"
                />
                <div>
                  <span className="text-xs font-bold text-[#241D5E] block">
                    Activer le compte à rebours d'urgence COD sur la fiche produit
                  </span>
                  <span className="text-[11px] text-[#5E5A70]">
                    Affiche l'encart « Le prix promo se termine dans XX heures YY min » pour déclencher l'achat impulsif.
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* TAB 2: HERO & MARKETING STORY */}
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

              <div className="pt-3 border-t border-[#E2DCF8]">
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Titre de l'argumentaire / histoire produit (Section descriptive)
                </label>
                <Input
                  placeholder="Ex: Votre jus frais, où que vous soyez"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                  Texte descriptif et argumentaire détaillé
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-2xl bg-white border border-[#E2DCF8] p-3 text-sm font-semibold outline-none focus:border-[#6C4CF1]"
                  placeholder="Ex: Au bureau, à la salle de sport ou en voyage, découvrez une expérience simplifiée et efficace au quotidien..."
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                />
                <span className="text-[11px] text-[#5E5A70] block mt-1">
                  Vous pouvez sauter des lignes pour créer plusieurs paragraphes élégants sur la fiche produit.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: PACKS & OFFRES COD */}
          {modalActiveTab === 'packs' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <p className="text-xs text-[#5E5A70] m-0">
                Configurez le nombre d'offres affichées dans la section « Choisissez votre offre ». Par défaut, seule l'offre à l'unité est active. Cochez les options pour activer des packs multi-quantités.
              </p>

              {/* Pack 1 : Toujours actif */}
              <div className="p-3.5 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#6C4CF1] uppercase tracking-wider">
                    Offre 1 : Produit à l'unité (Obligatoire)
                  </span>
                  <span className="text-[10px] font-black text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#5E5A70] block mb-1">Libellé de l'offre</label>
                    <Input value={offer1Label} onChange={(e) => setOffer1Label(e.target.value)} placeholder="Ex: 1 unité ou 1 sachet" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5E5A70] block mb-1">Prix unitaire (FCFA)</label>
                    <Input type="number" value={offer1Price} onChange={(e) => setOffer1Price(e.target.value)} placeholder="Ex: 15900" />
                  </div>
                </div>
              </div>

              {/* Pack 2 : Checkbox */}
              <div className={cn(
                "p-3.5 rounded-2xl border transition-all",
                hasOffer2 ? "bg-[#F4F1FE] border-[#6C4CF1]" : "bg-[#FAF8FF] border-[#E2DCF8]"
              )}>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasOffer2}
                    onChange={(e) => setHasOffer2(e.target.checked)}
                    className="rounded text-[#6C4CF1] focus:ring-[#6C4CF1]"
                  />
                  <span className="text-xs font-extrabold text-[#241D5E]">
                    Proposer une 2ème offre (ex: Pack Duo / 2 sachets)
                  </span>
                </label>

                {hasOffer2 && (
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#E2DCF8]/70 animate-in fade-in">
                    <div>
                      <label className="text-[11px] font-bold text-[#5E5A70] block mb-1">Libellé du pack</label>
                      <Input value={offer2Label} onChange={(e) => setOffer2Label(e.target.value)} placeholder="Ex: Pack 2 sachets" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#5E5A70] block mb-1">Prix du pack (FCFA)</label>
                      <Input type="number" value={offer2Price} onChange={(e) => setOffer2Price(e.target.value)} placeholder="Ex: 28900" />
                    </div>
                    <div className="col-span-2 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#5E5A70]">
                        <input
                          type="checkbox"
                          checked={offer2Best}
                          onChange={(e) => setOffer2Best(e.target.checked)}
                          className="rounded text-[#6C4CF1]"
                        />
                        <span>Afficher le badge violet « Le plus choisi » sur ce pack</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Pack 3 : Checkbox */}
              <div className={cn(
                "p-3.5 rounded-2xl border transition-all",
                hasOffer3 ? "bg-[#F4F1FE] border-[#6C4CF1]" : "bg-[#FAF8FF] border-[#E2DCF8]"
              )}>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasOffer3}
                    onChange={(e) => setHasOffer3(e.target.checked)}
                    className="rounded text-[#6C4CF1] focus:ring-[#6C4CF1]"
                  />
                  <span className="text-xs font-extrabold text-[#241D5E]">
                    Proposer une 3ème offre (ex: Pack Famille / 3 sachets)
                  </span>
                </label>

                {hasOffer3 && (
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#E2DCF8]/70 animate-in fade-in">
                    <div>
                      <label className="text-[11px] font-bold text-[#5E5A70] block mb-1">Libellé du pack</label>
                      <Input value={offer3Label} onChange={(e) => setOffer3Label(e.target.value)} placeholder="Ex: Pack 3 sachets" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#5E5A70] block mb-1">Prix du pack (FCFA)</label>
                      <Input type="number" value={offer3Price} onChange={(e) => setOffer3Price(e.target.value)} placeholder="Ex: 39900" />
                    </div>
                  </div>
                )}
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

          {/* TAB 7: AVIS CLIENTS (FACULTATIF) */}
          {modalActiveTab === 'reviews' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <label className="flex items-start gap-2.5 cursor-pointer p-3.5 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8]">
                <input
                  type="checkbox"
                  checked={reviewsEnabled}
                  onChange={(e) => setReviewsEnabled(e.target.checked)}
                  className="mt-0.5 rounded text-[#6C4CF1] focus:ring-[#6C4CF1]"
                />
                <div>
                  <span className="text-xs font-extrabold text-[#241D5E] block">
                    Afficher la section Avis & Témoignages clients sur la fiche produit
                  </span>
                  <span className="text-[11px] text-[#5E5A70]">
                    Rassure considérablement les visiteurs et augmente votre taux de commande COD.
                  </span>
                </div>
              </label>

              {reviewsEnabled && (
                <div className="space-y-3.5">
                  {[
                    { author: rev1Author, setAuthor: setRev1Author, loc: rev1Loc, setLoc: setRev1Loc, rating: rev1Rating, setRating: setRev1Rating, comment: rev1Comment, setComment: setRev1Comment, title: "Avis client 1" },
                    { author: rev2Author, setAuthor: setRev2Author, loc: rev2Loc, setLoc: setRev2Loc, rating: rev2Rating, setRating: setRev2Rating, comment: rev2Comment, setComment: setRev2Comment, title: "Avis client 2" },
                    { author: rev3Author, setAuthor: setRev3Author, loc: rev3Loc, setLoc: setRev3Loc, rating: rev3Rating, setRating: setRev3Rating, comment: rev3Comment, setComment: setRev3Comment, title: "Avis client 3" }
                  ].map((r, i) => (
                    <div key={i} className="p-3.5 bg-white rounded-2xl border border-[#E2DCF8] space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#241D5E]">{r.title}</span>
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] font-bold text-[#5E5A70]">Note :</label>
                          <select
                            value={r.rating}
                            onChange={(e) => r.setRating(parseInt(e.target.value, 10))}
                            className="text-xs font-bold bg-[#FAF8FF] border border-[#E2DCF8] rounded-lg px-2 py-1 text-[#F2A516] outline-none"
                          >
                            <option value={5}>★★★★★ (5/5)</option>
                            <option value={4}>★★★★☆ (4/5)</option>
                            <option value={3}>★★★☆☆ (3/5)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input value={r.author} onChange={(e) => r.setAuthor(e.target.value)} placeholder="Nom client (ex: Mariam K.)" />
                        <Input value={r.loc} onChange={(e) => r.setLoc(e.target.value)} placeholder="Ville / Commune (ex: Cocody)" />
                      </div>
                      <textarea
                        rows={2}
                        className="w-full rounded-xl bg-[#FAF8FF] border border-[#E2DCF8] p-2.5 text-xs font-medium outline-none focus:border-[#6C4CF1]"
                        placeholder="Commentaire client vérifié..."
                        value={r.comment}
                        onChange={(e) => r.setComment(e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
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
                <span>{productToEdit ? 'Enregistrer les modifications' : 'Créer le produit et sa fiche COD'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
