import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/products.api';
import { Product, ProductStatus, FicheProduitData } from '../../types/product';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { 
  Plus, 
  Download, 
  Upload, 
  Search, 
  ExternalLink, 
  Trash2, 
  Timer,
  Package,
  Layers,
  Sparkles,
  Tag,
  ShieldCheck,
  HelpCircle,
  Eye,
  Loader2,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const ProduitsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>('Tous');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState<'base' | 'hero' | 'packs' | 'benefits' | 'specs' | 'faq'>('base');

  // Form State - Shopify Core
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Électronique & Maison');
  const [type, setType] = useState('Simple');
  const [price, setPrice] = useState('15900');
  const [priceOld, setPriceOld] = useState('25000');
  const [stockQuantity, setStockQuantity] = useState('14');
  const [stockMain, setStockMain] = useState('Entrepôt Abidjan');
  const [imageUrl, setImageUrl] = useState('');

  // Form State - Fiche Produit COD
  const [headline, setHeadline] = useState('');
  const [leadSubtitle, setLeadSubtitle] = useState('');
  const [hasCountdown, setHasCountdown] = useState(true);
  const [stockUrgency, setStockUrgency] = useState('14');

  // Offers / Packs
  const [offer1Label, setOffer1Label] = useState('1 unité');
  const [offer1Price, setOffer1Price] = useState('15900');
  const [offer2Label, setOffer2Label] = useState('Pack Duo (2 unités)');
  const [offer2Price, setOffer2Price] = useState('28900');
  const [offer3Label, setOffer3Label] = useState('Pack Famille (3 unités)');
  const [offer3Price, setOffer3Price] = useState('39900');

  // Benefits
  const [b1Icon, setB1Icon] = useState('🔋');
  const [b1Title, setB1Title] = useState('15 mixages par charge');
  const [b1Desc, setB1Desc] = useState('Rechargez avec n’importe quel chargeur de téléphone USB-C en 2h.');

  const [b2Icon, setB2Icon] = useState('🥭');
  const [b2Title, setB2Title] = useState('Puissant & Lames Inox');
  const [b2Desc, setB2Desc] = useState('Moteur 22 000 tours/min : fruits, légumes et glaçons passent sans effort.');

  const [b3Icon, setB3Icon] = useState('🛡️');
  const [b3Title, setB3Title] = useState('Sécurité intégrée');
  const [b3Desc, setB3Desc] = useState('Le moteur ne démarre que si le gobelet est parfaitement vissé.');

  const [b4Icon, setB4Icon] = useState('💧');
  const [b4Title, setB4Title] = useState('Nettoyage en 10 secondes');
  const [b4Desc, setB4Desc] = useState('Un peu d’eau savonneuse, deux pressions, rincez. C’est propre.');

  // Specs & In The Box
  const [specCapacity, setSpecCapacity] = useState('400 ml');
  const [specBattery, setSpecBattery] = useState('2 000 mAh, recharge USB-C');
  const [specSpeed, setSpecSpeed] = useState('22 000 tours/min');
  const [specMaterial, setSpecMaterial] = useState('Tritan sans BPA & Lames inox');
  const [specWarranty, setSpecWarranty] = useState('6 mois échange à neuf');
  const [inTheBox, setInTheBox] = useState('Dans la boîte : 1 appareil, 1 câble USB-C, 1 couvercle de transport, 1 notice en français.');

  // FAQ
  const [faq1Q, setFaq1Q] = useState('Comment fonctionne le paiement à la livraison ?');
  const [faq1A, setFaq1A] = useState('Vous ne payez rien d’avance. Vous réglez directement au livreur en espèces ou par Mobile Money lors de la réception.');
  const [faq2Q, setFaq2Q] = useState('Quels sont les délais de livraison ?');
  const [faq2A, setFaq2A] = useState('24 h à Abidjan et 48 à 72 h dans les villes de l’intérieur.');

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handlePreFillPresets = () => {
    setName('BlendGo – Mixeur portable 400 ml');
    setCategory('Électronique & Maison');
    setPrice('15900');
    setPriceOld('25000');
    setStockQuantity('14');
    setStockUrgency('14');
    setHeadline('BlendGo, le mixeur qui tient dans votre sac');
    setLeadSubtitle('Jus, smoothies et laits frappés en 30 secondes, partout. Rechargeable par USB-C, 15 mixages par charge.');
    setOffer1Label('1 mixeur');
    setOffer1Price('15900');
    setOffer2Label('Pack 2 mixeurs');
    setOffer2Price('28900');
    setOffer3Label('Pack 3 mixeurs');
    setOffer3Price('39900');
    toast.info('Modèle pré-rempli avec la fiche produit BlendGo !');
  };

  const tabCounts = {
    Tous: products.length,
    Actifs: products.filter(p => p.status === 'Actif').length,
    Brouillons: products.filter(p => p.status === 'Brouillon').length,
    Archivés: products.filter(p => p.status === 'Archivé').length
  };

  const filtered = products
    .filter(p => {
      if (selectedTab === 'Actifs') return p.status === 'Actif';
      if (selectedTab === 'Brouillons') return p.status === 'Brouillon';
      if (selectedTab === 'Archivés') return p.status === 'Archivé';
      return true;
    })
    .filter(p => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = async (status: ProductStatus) => {
    if (selectedIds.length === 0) return;
    try {
      const updated = await productsApi.bulkUpdateStatus(selectedIds, status);
      setProducts(updated);
      toast.success(`${selectedIds.length} produit(s) passé(s) à « ${status} »`);
      setSelectedIds([]);
    } catch {
      toast.error('Erreur lors de la mise à jour des statuts');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Confirmer la suppression de ${selectedIds.length} produit(s) ?`)) return;
    for (const id of selectedIds) {
      await productsApi.delete(id);
    }
    await loadProducts();
    toast.success(`${selectedIds.length} produit(s) supprimé(s)`);
    setSelectedIds([]);
  };

  const handleDeleteOne = async (id: string, prodName: string) => {
    if (!window.confirm(`Supprimer le produit « ${prodName} » ?`)) return;
    await productsApi.delete(id);
    await loadProducts();
    toast.success(`Produit ${prodName} supprimé`);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      toast.error('Veuillez renseigner le nom et le prix du produit');
      return;
    }

    setIsSubmitting(true);
    try {
      const ficheProduitData: FicheProduitData = {
        headline: headline.trim() || name.trim(),
        leadSubtitle: leadSubtitle.trim(),
        stockUrgency: parseInt(stockUrgency, 10) || parseInt(stockQuantity, 10) || 14,
        countdownEnabled: hasCountdown,
        offers: [
          {
            qty: 1,
            label: offer1Label.trim() || '1 unité',
            price: parseInt(offer1Price, 10) || parseInt(price, 10)
          },
          {
            qty: 2,
            label: offer2Label.trim() || 'Pack Duo (2 unités)',
            price: parseInt(offer2Price, 10) || (parseInt(price, 10) * 1.8),
            best: true
          },
          {
            qty: 3,
            label: offer3Label.trim() || 'Pack Famille (3 unités)',
            price: parseInt(offer3Price, 10) || (parseInt(price, 10) * 2.5)
          }
        ],
        benefits: [
          { icon: b1Icon, title: b1Title, description: b1Desc },
          { icon: b2Icon, title: b2Title, description: b2Desc },
          { icon: b3Icon, title: b3Title, description: b3Desc },
          { icon: b4Icon, title: b4Title, description: b4Desc }
        ],
        specs: [
          { label: 'Capacité', value: specCapacity },
          { label: 'Batterie & Alimentation', value: specBattery },
          { label: 'Vitesse / Puissance', value: specSpeed },
          { label: 'Matériau', value: specMaterial },
          { label: 'Garantie', value: specWarranty }
        ],
        inTheBox: inTheBox.trim(),
        faqs: [
          { question: faq1Q.trim(), answer: faq1A.trim() },
          { question: faq2Q.trim(), answer: faq2A.trim() }
        ]
      };

      await productsApi.create({
        name: name.trim(),
        price: parseInt(price, 10),
        priceOld: priceOld ? parseInt(priceOld, 10) : undefined,
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        stockMain,
        category,
        type,
        hasCountdown,
        images: imageUrl.trim() ? [imageUrl.trim()] : [],
        fiche_produit: ficheProduitData
      });

      await loadProducts();
      setIsAddModalOpen(false);
      toast.success('Produit et fiche produit COD créés avec succès !');

      // Reset
      setName('');
      setHeadline('');
      setLeadSubtitle('');
      setImageUrl('');
    } catch {
      toast.error('Erreur lors de la création du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Produits & Catalogue
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Chaque produit intègre sa fiche de vente COD haute conversion avec packs dégressifs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => toast.success('Export du catalogue produit téléchargé')}
            className="rounded-full shadow-kolix-sm"
          >
            <Download className="w-4 h-4 mr-1 text-[#5E5A70]" />
            Exporter
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Import CSV/Excel prêt')}
            className="rounded-full shadow-kolix-sm"
          >
            <Upload className="w-4 h-4 mr-1 text-[#5E5A70]" />
            Importer
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setModalActiveTab('base');
              setIsAddModalOpen(true);
            }}
            className="rounded-full shadow-kolix-cta"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nouveau produit (Modèle Shopify)
          </Button>
        </div>
      </div>

      {/* Main Catalog Card */}
      <div className="bg-white rounded-3xl shadow-kolix border border-[#E2DCF8]/60 overflow-hidden flex flex-col">
        {/* Tabs Bar & Search */}
        <div className="flex flex-wrap justify-between items-center gap-3 p-4 border-b border-[#F0EDFB]">
          <div className="flex flex-wrap gap-1">
            {Object.entries(tabCounts).map(([tab, count]) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  selectedTab === tab
                    ? 'bg-[#241D5E] text-white shadow-sm'
                    : 'bg-transparent text-[#5E5A70] hover:text-[#16131F]'
                )}
              >
                <span>{tab}</span>
                <span className="opacity-70 text-xs">({count})</span>
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Rechercher par nom ou niche…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-[#EEE9FF] px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm border-b border-[#D6CFF7] animate-in fade-in">
            <span className="font-extrabold text-[#3F25A8]">
              {selectedIds.length} produit(s) sélectionné(s)
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkStatus('Actif')}>
                Mettre en ligne
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatus('Brouillon')}>
                Passer en brouillon
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatus('Archivé')}>
                Archiver
              </Button>
              <Button size="sm" variant="danger" onClick={handleBulkDelete}>
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#5E5A70]">
              <Loader2 className="w-8 h-8 animate-spin text-[#6C4CF1]" />
              <p className="font-semibold text-sm">Chargement du catalogue connecté au backend…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-[#5E5A70]">
              <Package className="w-12 h-12 mx-auto text-[#B8B2C8] mb-3" />
              <p className="font-bold text-base text-[#1D1430]">Aucun produit trouvé</p>
              <p className="text-sm mt-1">Créez votre premier produit pour générer sa fiche boutique COD.</p>
              <Button
                variant="primary"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 rounded-full"
              >
                <Plus className="w-4 h-4 mr-1" /> Ajouter un produit
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse min-w-[960px]">
              <thead>
                <tr className="text-xs text-[#5E5A70] uppercase tracking-wider bg-[#FAF9FE] border-b border-[#F0EDFB]">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-[#6C4CF1] accent-[#6C4CF1] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 font-bold">Produit</th>
                  <th className="py-3 px-3 font-bold">Statut</th>
                  <th className="py-3 px-3 font-bold">Stock</th>
                  <th className="py-3 px-3 font-bold">Prix</th>
                  <th className="py-3 px-3 font-bold">Ventes (30 j)</th>
                  <th className="py-3 px-3 font-bold">Catégorie</th>
                  <th className="py-3 px-3 font-bold">Fiche Produit COD</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDFB]">
                {filtered.map(product => {
                  const isChecked = selectedIds.includes(product.id);
                  const targetParam = product.slug || product.id;

                  return (
                    <tr
                      key={product.id}
                      className={cn(
                        'hover:bg-[#FAF8FF] transition-colors',
                        isChecked && 'bg-[#F4F1FE]/80'
                      )}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(product.id)}
                          className="w-4 h-4 rounded text-[#6C4CF1] accent-[#6C4CF1] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-[#F4F1FE] text-[#6C4CF1] flex items-center justify-center shrink-0 border border-[#E2DCF8]">
                            <Package className="w-5 h-5" />
                          </span>
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#16131F] text-sm">
                              {product.name}
                            </span>
                            {product.hasCountdown && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#8A3D0A] bg-[#FFEBDD] px-2 py-0.5 rounded-md mt-0.5 w-fit">
                                <Timer className="w-3 h-3" />
                                Urgence promo active
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={product.status === 'Actif' ? 'optimal' : 'rupture'}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-[#16131F]">{product.stockMain}</span>
                        {product.stockRest && (
                          <span className="text-xs text-[#5E5A70] block">{product.stockRest}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-extrabold text-[#16131F]">{formatFCFA(product.price)}</div>
                        {product.priceOld && (
                          <div className="text-xs text-[#8B869C] line-through">
                            {formatFCFA(product.priceOld)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-[#241D5E]">
                        {product.sales30d}
                      </td>
                      <td className="py-3 px-3 text-[#3A3647] font-medium">
                        {product.category}
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          to={`/boutique-en-ligne?product=${encodeURIComponent(targetParam)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F1FE] hover:bg-[#EAE5FC] text-[#6C4CF1] font-bold text-xs transition-colors border border-[#6C4CF1]/20 shadow-xs"
                          title="Voir la page de vente mono-produit COD"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Voir la fiche</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteOne(product.id, product.name)}
                          className="w-8 h-8 rounded-lg hover:bg-rose-50 text-[#8B869C] hover:text-rose-600 inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Supprimer le produit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF9FE] border-t border-[#F0EDFB] text-xs text-[#5E5A70] flex justify-between items-center">
          <span>Affichage de {filtered.length} produit(s)</span>
          <span className="font-semibold text-[#6C4CF1]">Catalogue Connecté Backend PostgreSQL</span>
        </div>
      </div>

      {/* Comprehensive Shopify-Style Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Créer un produit avec sa fiche de vente COD"
        description="Associez directement toutes les informations de votre fiche produit (accroches, packs dégressifs, urgence, caractéristiques, FAQ) selon le standard Shopify."
        maxWidth="xl"
      >
        <div className="flex flex-col gap-4 mt-2">
          {/* Preset Auto-fill Helper */}
          <div className="bg-[#FAF8FF] border border-[#D6CFF7] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6C4CF1]" />
              <span className="text-xs font-bold text-[#241D5E]">
                Besoin d'un exemple clé en main ? Remplissez instantanément les champs avec un modèle à fort taux de conversion.
              </span>
            </div>
            <button
              type="button"
              onClick={handlePreFillPresets}
              className="text-xs font-extrabold text-[#6C4CF1] hover:underline cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#6C4CF1]/30 shadow-xs"
            >
              Pré-remplir modèle BlendGo
            </button>
          </div>

          {/* Navigation Tabs in Modal */}
          <div className="flex overflow-x-auto gap-2 border-b border-[#E2DCF8] pb-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setModalActiveTab('base')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                modalActiveTab === 'base'
                  ? 'bg-[#241D5E] text-white shadow-xs'
                  : 'bg-gray-100 text-[#5E5A70] hover:text-black'
              )}
            >
              1. Base & Tarification
            </button>
            <button
              type="button"
              onClick={() => setModalActiveTab('hero')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                modalActiveTab === 'hero'
                  ? 'bg-[#241D5E] text-white shadow-xs'
                  : 'bg-gray-100 text-[#5E5A70] hover:text-black'
              )}
            >
              2. Accroche COD & Rareté
            </button>
            <button
              type="button"
              onClick={() => setModalActiveTab('packs')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                modalActiveTab === 'packs'
                  ? 'bg-[#241D5E] text-white shadow-xs'
                  : 'bg-gray-100 text-[#5E5A70] hover:text-black'
              )}
            >
              3. Offres & Multi-packs
            </button>
            <button
              type="button"
              onClick={() => setModalActiveTab('benefits')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                modalActiveTab === 'benefits'
                  ? 'bg-[#241D5E] text-white shadow-xs'
                  : 'bg-gray-100 text-[#5E5A70] hover:text-black'
              )}
            >
              4. Bénéfices Clés (4)
            </button>
            <button
              type="button"
              onClick={() => setModalActiveTab('specs')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                modalActiveTab === 'specs'
                  ? 'bg-[#241D5E] text-white shadow-xs'
                  : 'bg-gray-100 text-[#5E5A70] hover:text-black'
              )}
            >
              5. Spécifications & Coffret
            </button>
            <button
              type="button"
              onClick={() => setModalActiveTab('faq')}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap',
                modalActiveTab === 'faq'
                  ? 'bg-[#241D5E] text-white shadow-xs'
                  : 'bg-gray-100 text-[#5E5A70] hover:text-black'
              )}
            >
              6. FAQ & Réassurance
            </button>
          </div>

          <form onSubmit={handleAddProduct} className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* TAB 1: Base & Pricing */}
            {modalActiveTab === 'base' && (
              <div className="flex flex-col gap-3.5 animate-in fade-in">
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
                      Quantité en stock initial *
                    </label>
                    <Input
                      type="number"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                      Emplacement principal du stock
                    </label>
                    <Input
                      placeholder="Ex: Entrepôt Abidjan"
                      value={stockMain}
                      onChange={(e) => setStockMain(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Image du produit (URL externe ou visuel)
                  </label>
                  <Input
                    placeholder="https://... (Laissez vide pour utiliser l'illustration vectorielle dynamique)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Accroche COD & Rareté */}
            {modalActiveTab === 'hero' && (
              <div className="flex flex-col gap-3.5 animate-in fade-in">
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Titre d'accroche principal de la page de vente (H1)
                  </label>
                  <Input
                    placeholder="Ex: BlendGo, le mixeur qui tient dans votre sac"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                  <small className="text-[11px] text-[#5E5A70] block mt-1">
                    Ce titre s'affiche en grand au-dessus du formulaire de commande.
                  </small>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                    Sous-titre / Lead marketing persuasif
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Jus, smoothies et laits frappés en 30 secondes, partout. Rechargeable par USB-C, 15 mixages par charge."
                    value={leadSubtitle}
                    onChange={(e) => setLeadSubtitle(e.target.value)}
                    className="w-full rounded-2xl bg-white border border-[#E2DCF8] p-3 text-sm outline-none focus:border-[#6C4CF1]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E2DCF8]">
                    <input
                      type="checkbox"
                      id="countdownToggle"
                      checked={hasCountdown}
                      onChange={(e) => setHasCountdown(e.target.checked)}
                      className="w-4 h-4 rounded text-[#6C4CF1] accent-[#6C4CF1] cursor-pointer"
                    />
                    <label htmlFor="countdownToggle" className="text-xs font-bold text-[#16131F] cursor-pointer">
                      Activer le compte à rebours d'urgence ("Le prix promo se termine dans...")
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">
                      Nombre d'articles affichés en stock d'urgence
                    </label>
                    <Input
                      type="number"
                      value={stockUrgency}
                      onChange={(e) => setStockUrgency(e.target.value)}
                      placeholder="Ex: 14"
                    />
                    <small className="text-[11px] text-[#5E5A70] block mt-1">
                      Affiche « Plus que X en stock » avec barre d'urgence.
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Offres & Packs Dégressifs */}
            {modalActiveTab === 'packs' && (
              <div className="flex flex-col gap-3.5 animate-in fade-in">
                <p className="text-xs text-[#5E5A70]">
                  Configurez la tarification dégressive présentée à l'acheteur COD sur la fiche produit :
                </p>

                {/* Offer 1 */}
                <div className="p-3.5 rounded-2xl border border-[#E2DCF8] bg-white flex flex-col gap-2">
                  <span className="font-extrabold text-xs text-[#241D5E]">Offre 1 (Unité simple)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Libellé (ex: 1 mixeur)"
                      value={offer1Label}
                      onChange={(e) => setOffer1Label(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Prix FCFA (ex: 15900)"
                      value={offer1Price}
                      onChange={(e) => setOffer1Price(e.target.value)}
                    />
                  </div>
                </div>

                {/* Offer 2 */}
                <div className="p-3.5 rounded-2xl border-2 border-[#6C4CF1] bg-[#FAF8FF] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#6C4CF1]">Offre 2 (Pack Duo - Badge « Le plus choisi »)</span>
                    <span className="text-[10px] bg-[#6C4CF1] text-white px-2 py-0.5 rounded-full font-bold">Best-Seller</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Libellé (ex: Pack 2 mixeurs)"
                      value={offer2Label}
                      onChange={(e) => setOffer2Label(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Prix FCFA (ex: 28900)"
                      value={offer2Price}
                      onChange={(e) => setOffer2Price(e.target.value)}
                    />
                  </div>
                </div>

                {/* Offer 3 */}
                <div className="p-3.5 rounded-2xl border border-[#E2DCF8] bg-white flex flex-col gap-2">
                  <span className="font-extrabold text-xs text-[#241D5E]">Offre 3 (Pack Trio / Famille)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Libellé (ex: Pack 3 mixeurs)"
                      value={offer3Label}
                      onChange={(e) => setOffer3Label(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Prix FCFA (ex: 39900)"
                      value={offer3Price}
                      onChange={(e) => setOffer3Price(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Bénéfices Clés */}
            {modalActiveTab === 'benefits' && (
              <div className="flex flex-col gap-3 animate-in fade-in">
                <p className="text-xs text-[#5E5A70]">
                  Les 4 arguments de vente principaux affichés sous la fiche produit avec icône :
                </p>

                {/* B1 */}
                <div className="grid grid-cols-[50px_1fr_2fr] gap-2 items-center">
                  <Input value={b1Icon} onChange={(e) => setB1Icon(e.target.value)} />
                  <Input value={b1Title} onChange={(e) => setB1Title(e.target.value)} placeholder="Titre 1" />
                  <Input value={b1Desc} onChange={(e) => setB1Desc(e.target.value)} placeholder="Description 1" />
                </div>

                {/* B2 */}
                <div className="grid grid-cols-[50px_1fr_2fr] gap-2 items-center">
                  <Input value={b2Icon} onChange={(e) => setB2Icon(e.target.value)} />
                  <Input value={b2Title} onChange={(e) => setB2Title(e.target.value)} placeholder="Titre 2" />
                  <Input value={b2Desc} onChange={(e) => setB2Desc(e.target.value)} placeholder="Description 2" />
                </div>

                {/* B3 */}
                <div className="grid grid-cols-[50px_1fr_2fr] gap-2 items-center">
                  <Input value={b3Icon} onChange={(e) => setB3Icon(e.target.value)} />
                  <Input value={b3Title} onChange={(e) => setB3Title(e.target.value)} placeholder="Titre 3" />
                  <Input value={b3Desc} onChange={(e) => setB3Desc(e.target.value)} placeholder="Description 3" />
                </div>

                {/* B4 */}
                <div className="grid grid-cols-[50px_1fr_2fr] gap-2 items-center">
                  <Input value={b4Icon} onChange={(e) => setB4Icon(e.target.value)} />
                  <Input value={b4Title} onChange={(e) => setB4Title(e.target.value)} placeholder="Titre 4" />
                  <Input value={b4Desc} onChange={(e) => setB4Desc(e.target.value)} placeholder="Description 4" />
                </div>
              </div>
            )}

            {/* TAB 5: Spécifications & Coffret */}
            {modalActiveTab === 'specs' && (
              <div className="flex flex-col gap-3 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">Capacité</label>
                    <Input value={specCapacity} onChange={(e) => setSpecCapacity(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">Batterie & Charge</label>
                    <Input value={specBattery} onChange={(e) => setSpecBattery(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">Vitesse / Moteur</label>
                    <Input value={specSpeed} onChange={(e) => setSpecSpeed(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">Matériaux</label>
                    <Input value={specMaterial} onChange={(e) => setSpecMaterial(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#5E5A70] block mb-1">Garantie</label>
                    <Input value={specWarranty} onChange={(e) => setSpecWarranty(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Contenu dans la boîte</label>
                  <textarea
                    rows={2}
                    value={inTheBox}
                    onChange={(e) => setInTheBox(e.target.value)}
                    className="w-full rounded-2xl bg-white border border-[#E2DCF8] p-3 text-sm outline-none focus:border-[#6C4CF1]"
                  />
                </div>
              </div>
            )}

            {/* TAB 6: FAQ & Réassurance */}
            {modalActiveTab === 'faq' && (
              <div className="flex flex-col gap-3 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E2DCF8] flex flex-col gap-2">
                  <span className="font-bold text-xs text-[#241D5E]">Question fréquente 1</span>
                  <Input value={faq1Q} onChange={(e) => setFaq1Q(e.target.value)} placeholder="Question" />
                  <textarea
                    rows={2}
                    value={faq1A}
                    onChange={(e) => setFaq1A(e.target.value)}
                    className="w-full rounded-xl bg-white border border-[#E2DCF8] p-2.5 text-xs outline-none"
                    placeholder="Réponse"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E2DCF8] flex flex-col gap-2">
                  <span className="font-bold text-xs text-[#241D5E]">Question fréquente 2</span>
                  <Input value={faq2Q} onChange={(e) => setFaq2Q(e.target.value)} placeholder="Question" />
                  <textarea
                    rows={2}
                    value={faq2A}
                    onChange={(e) => setFaq2A(e.target.value)}
                    className="w-full rounded-xl bg-white border border-[#E2DCF8] p-2.5 text-xs outline-none"
                    placeholder="Réponse"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0EDFB]">
              <div className="text-xs text-[#5E5A70] hidden sm:block">
                Toutes les sections sont automatiquement intégrées dans la boutique.
              </div>
              <div className="flex gap-2.5">
                <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      Création en cours…
                    </>
                  ) : (
                    'Enregistrer le produit'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
