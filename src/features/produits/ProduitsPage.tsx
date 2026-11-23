import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useRealtime } from '../../context/RealtimeContext';
import { productsApi } from '../../api/products.api';
import { Product, ProductStatus } from '../../types/product';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { ProductCreateModal } from '../../components/products/ProductCreateModal';
import { 
  Plus, 
  Download, 
  Upload, 
  Search, 
  ExternalLink, 
  Trash2, 
  Timer,
  Eye,
  Package,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const ProduitsPage: React.FC = () => {
  const { user } = useAuth();
  const { stores, activeStore } = useStore();
  const { subscribe } = useRealtime();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>('Tous');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  // Écoute des mises à jour temps réel via WebSocket pour les produits
  useEffect(() => {
    const onRealtimeUpdate = () => {
      loadProducts();
    };

    const unsubProduct = subscribe('PRODUCT_CREATED', onRealtimeUpdate);
    const unsubStock = subscribe('STOCK_UPDATED', onRealtimeUpdate);
    const unsubDashboard = subscribe('DASHBOARD_UPDATE', onRealtimeUpdate);

    return () => {
      unsubProduct();
      unsubStock();
      unsubDashboard();
    };
  }, [subscribe]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-[#5E5A70]">Chargement de votre catalogue produits...</span>
      </div>
    );
  }

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
            onClick={() => setIsAddModalOpen(true)}
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
                          to={`/boutique-en-ligne?product=${encodeURIComponent(targetParam)}&shop=${encodeURIComponent(product.shop_id || activeStore?.id || user?.currentShop?.id || '')}`}
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

      {/* Comprehensive Product & Multi-fiche COD Modal */}
      <ProductCreateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadProducts}
        defaultShopId={activeStore?.id || user?.currentShop?.id}
      />
    </div>
  );
};
