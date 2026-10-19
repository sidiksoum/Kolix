import React, { useState, useEffect } from 'react';
import { productsApi } from '../../api/products.api';
import { Product, ProductStatus } from '../../types/product';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { 
  Plus, 
  Download, 
  Upload, 
  MoreHorizontal, 
  Search, 
  ExternalLink, 
  Trash2, 
  Check, 
  Timer,
  Package,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const ProduitsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('Tous');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priceOld, setPriceOld] = useState('');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [category, setCategory] = useState('Électronique');
  const [type, setType] = useState('Standard');
  const [hasCountdown, setHasCountdown] = useState(false);

  const loadProducts = async () => {
    const data = await productsApi.getAll();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

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
    const updated = await productsApi.bulkUpdateStatus(selectedIds, status);
    setProducts(updated);
    toast.success(`${selectedIds.length} produit(s) passé(s) à « ${status} »`);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await productsApi.delete(id);
    }
    await loadProducts();
    toast.success(`${selectedIds.length} produit(s) supprimé(s)`);
    setSelectedIds([]);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      toast.error('Veuillez renseigner les champs obligatoires');
      return;
    }

    await productsApi.create({
      name: name.trim(),
      price: parseInt(price, 10),
      priceOld: priceOld ? parseInt(priceOld, 10) : undefined,
      stockQuantity: parseInt(stockQuantity, 10) || 0,
      category,
      type,
      hasCountdown
    });

    await loadProducts();
    setIsAddModalOpen(false);
    toast.success('Produit ajouté au catalogue');

    // Reset Form
    setName('');
    setPrice('');
    setPriceOld('');
    setStockQuantity('20');
    setHasCountdown(false);
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Produits
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Gérez votre catalogue de produits, vos déclinaisons et vos offres urgence COD
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
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-full shadow-kolix-cta"
          >
            <Plus className="w-4 h-4 mr-1" />
            Ajouter un produit
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
              placeholder="Filtrer un produit…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Bulk Action Bar (Visible when items selected) */}
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
          <table className="w-full text-left text-sm border-collapse min-w-[840px]">
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
                <th className="py-3 px-3 font-bold">Type</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {filtered.map(product => {
                const isChecked = selectedIds.includes(product.id);

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
                        <span className="w-10 h-10 rounded-xl bg-[#F4F1FE] text-[#6C4CF1] flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5" />
                        </span>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-[#16131F] text-sm">
                            {product.name}
                          </span>
                          {product.hasCountdown && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#8A3D0A] bg-[#FFEBDD] px-2 py-0.5 rounded-md mt-0.5 w-fit">
                              <Timer className="w-3 h-3" />
                              Compte à rebours actif
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
                      <span className="text-xs text-[#5E5A70]">{product.stockRest}</span>
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
                    <td className="py-3 px-3 text-[#3A3647] font-medium">
                      {product.type}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toast.info(`Options pour ${product.name}`)}
                        className="w-8 h-8 rounded-lg hover:bg-[#F4F1FE] text-[#5E5A70] flex items-center justify-center ml-auto transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF9FE] border-t border-[#F0EDFB] text-xs text-[#5E5A70] flex justify-between items-center">
          <span>Affichage de {filtered.length} produits</span>
          <span>Kolix Catalog Manager</span>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un nouveau produit"
        description="Créez un produit prêt à être vendu sur votre boutique ou via formulaire COD."
      >
        <form onSubmit={handleAddProduct} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Nom du produit *</label>
            <Input
              placeholder="Ex: Sérum Vitamine C 30 ml"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Prix de vente (FCFA) *</label>
              <Input
                type="number"
                placeholder="Ex: 15000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Prix barré / Promo (optionnel)</label>
              <Input
                type="number"
                placeholder="Ex: 19000"
                value={priceOld}
                onChange={(e) => setPriceOld(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Stock initial *</label>
              <Input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full min-h-[44px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-sm font-semibold"
              >
                <option value="Électronique">Électronique</option>
                <option value="Beauté & Soins">Beauté & Soins</option>
                <option value="Mode">Mode</option>
                <option value="Maison">Maison</option>
                <option value="Compléments">Compléments</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full min-h-[44px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-sm font-semibold"
              >
                <option value="Standard">Standard</option>
                <option value="Pack">Pack Promo</option>
                <option value="Variante">Variante</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF8FF] border border-[#E2DCF8]/60">
            <input
              type="checkbox"
              id="countdown"
              checked={hasCountdown}
              onChange={(e) => setHasCountdown(e.target.checked)}
              className="w-4 h-4 rounded text-[#6C4CF1] accent-[#6C4CF1] cursor-pointer"
            />
            <label htmlFor="countdown" className="text-xs font-bold text-[#16131F] cursor-pointer">
              Activer un compte à rebours d'urgence (Urgency timer) pour booster les conversions COD
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-[#F0EDFB]">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Créer le produit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
