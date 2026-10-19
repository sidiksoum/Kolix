import React, { useState } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { Order, OrderStatus } from '../../types/order';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Plus, 
  Download, 
  Phone, 
  Copy, 
  Check, 
  X, 
  Search, 
  ChevronDown, 
  QrCode, 
  MessageCircle, 
  FileSpreadsheet, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const CommandesPage: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    selectedOrder,
    setSelectedOrderId,
    activeTab,
    setActiveTab,
    updateOrderStatus,
    confirmPayment,
    createOrder
  } = useOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7d');
  const [sortBy, setSortBy] = useState<'recent' | 'amount' | 'client'>('recent');
  
  // Dropdown states
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);

  // New Order Form State
  const [newClient, setNewClient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Cocody');
  const [newPlace, setNewPlace] = useState('');
  const [newProduct, setNewProduct] = useState('Montre connectée X2');
  const [newAmount, setNewAmount] = useState('22000');
  const [newNote, setNewNote] = useState('');

  // Status metadata for tabs & badges
  const statusMeta: Record<string, { label: string; dot: string; variant: any }> = {
    'all': { label: 'Toutes', dot: '#A99BFA', variant: 'default' },
    'En cours': { label: 'En cours', dot: '#6C4CF1', variant: 'encours' },
    'Livrée': { label: 'Livrées', dot: '#241D5E', variant: 'livree' },
    'Reportée': { label: 'Reportées', dot: '#E0A33A', variant: 'reportee' },
    'Contestée': { label: 'Contestées', dot: '#E3807A', variant: 'contestee' },
    'Injoignable': { label: 'Injoignables', dot: '#8B869C', variant: 'injoignable' },
    'Annulée': { label: 'Annulées', dot: '#B4AFC4', variant: 'annulee' },
  };

  const statusList: OrderStatus[] = ['En cours', 'Livrée', 'Reportée', 'Annulée', 'Contestée', 'Injoignable'];

  // Filter & Search Logic
  const filteredOrders = orders
    .filter(o => activeTab === 'all' || o.status === activeTab)
    .filter(o => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.client.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    })
    .filter(o => {
      if (productFilter === 'all') return true;
      return o.product.includes(productFilter);
    })
    .sort((a, b) => {
      if (sortBy === 'amount') return b.amount - a.amount;
      if (sortBy === 'client') return a.client.localeCompare(b.client);
      return 0; // Default recent
    });

  const handleCopy = (order: Order) => {
    const text = `Commande ${order.id}\nClient : ${order.client} (${order.phone})\nLieu : ${order.place}\nProduit : ${order.product}\nMontant : ${formatFCFA(order.amount)}`;
    navigator.clipboard.writeText(text);
    setCopiedId(order.id);
    toast.success('Détails de livraison copiés dans le presse-papiers');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim() || !newPhone.trim() || !newPlace.trim()) {
      toast.error('Veuillez renseigner les champs obligatoires');
      return;
    }

    await createOrder({
      client: newClient.trim(),
      phone: newPhone.trim(),
      city: newCity,
      place: newPlace.trim(),
      product: newProduct,
      amount: parseInt(newAmount, 10) || 10000,
      note: newNote.trim()
    });

    setNewOrderModalOpen(false);
    // Reset form
    setNewClient('');
    setNewPhone('');
    setNewPlace('');
    setNewNote('');
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Header with Title and New Order CTA */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Commandes
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Gérez vos commandes de la réception à la livraison finale
          </p>
        </div>

        <div className="flex items-center gap-3 relative">
          <Button
            variant="outline"
            onClick={() => toast.success('Export du fichier CSV généré')}
            className="rounded-full shadow-kolix-sm"
          >
            <Download className="w-4 h-4 mr-1 text-[#5E5A70]" />
            Exporter
          </Button>

          {/* New Order Button with Dropdown */}
          <div className="relative">
            <Button
              variant="primary"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-full shadow-kolix-cta"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nouvelle commande
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-kolix-lg border border-[#E2DCF8] p-2 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setNewOrderModalOpen(true);
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#F4F1FE] transition-colors flex items-center gap-3"
                >
                  <span className="w-9 h-9 rounded-lg bg-[#F4F1FE] text-[#6C4CF1] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-extrabold text-sm text-[#16131F]">Commande manuelle</div>
                    <div className="text-xs text-[#5E5A70]">Saisir une commande reçue</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    toast.info('Connexion avec WhatsApp Business active');
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#F4F1FE] transition-colors flex items-center gap-3"
                >
                  <span className="w-9 h-9 rounded-lg bg-[#E3F9ED] text-[#136637] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-extrabold text-sm text-[#16131F]">WhatsApp Express</div>
                    <div className="text-xs text-[#5E5A70]">Importer depuis une discussion</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    toast.info('Générateur de formulaire COD activé');
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#F4F1FE] transition-colors flex items-center gap-3"
                >
                  <span className="w-9 h-9 rounded-lg bg-[#FFEBDD] text-[#8A3D0A] flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-extrabold text-sm text-[#16131F]">Formulaire express COD</div>
                    <div className="text-xs text-[#5E5A70]">Lien court pour TikTok/FB Ads</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Filter Tabs Grid */}
      <div
        role="tablist"
        aria-label="Filtrer par statut"
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5"
      >
        {Object.entries(statusMeta).map(([statusKey, meta]) => {
          const isSelected = activeTab === statusKey;
          const count = statusKey === 'all'
            ? orders.length
            : orders.filter(o => o.status === statusKey).length;

          return (
            <button
              key={statusKey}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTab(statusKey)}
              className={cn(
                'flex items-start gap-2.5 p-3.5 rounded-2xl transition-all duration-150 text-left border-0 cursor-pointer min-h-[64px]',
                isSelected
                  ? 'bg-[#241D5E] text-white shadow-kolix-navy'
                  : 'bg-white text-[#16131F] shadow-kolix-sm hover:shadow-kolix'
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                style={{ backgroundColor: isSelected ? '#FFFFFF' : meta.dot }}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none">
                  {count}
                </span>
                <span className="text-xs font-bold opacity-80 leading-tight">
                  {meta.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area: Table + Side Drawer */}
      <div className="flex flex-wrap lg:flex-nowrap gap-5 items-start">
        {/* Orders Table Container */}
        <section className="flex-1 min-w-0 bg-white rounded-3xl p-5 sm:p-6 shadow-kolix flex flex-col gap-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#5E5A70] block mb-1.5">Client ou téléphone</label>
              <Input
                placeholder="Rechercher par nom, téléphone, ville…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1.5">Produit</label>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full min-h-[44px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-xs font-semibold text-[#16131F] outline-none cursor-pointer"
              >
                <option value="all">Tous les produits</option>
                <option value="Montre connectée">Montre connectée X2</option>
                <option value="Sérum éclat">Sérum éclat 30 ml</option>
                <option value="Écouteurs">Écouteurs sans fil Pro</option>
                <option value="Lisseur">Lisseur céramique Pro</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1.5">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full min-h-[44px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-xs font-semibold text-[#16131F] outline-none cursor-pointer"
              >
                <option value="recent">Plus récentes</option>
                <option value="amount">Montant élevé</option>
                <option value="client">Nom du client</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="text-xs text-[#5E5A70] uppercase tracking-wider border-b border-[#F0EDFB]">
                  <th className="py-3 px-2 font-bold">Commande</th>
                  <th className="py-3 px-2 font-bold">Client</th>
                  <th className="py-3 px-2 font-bold">Lieu</th>
                  <th className="py-3 px-2 font-bold">Produit</th>
                  <th className="py-3 px-2 font-bold">Montant</th>
                  <th className="py-3 px-2 font-bold">Statut</th>
                  <th className="py-3 px-2 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDFB]">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrderId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className={cn(
                        'hover:bg-[#FAF8FF] transition-colors',
                        isSelected && 'bg-[#F4F1FE]/80'
                      )}
                    >
                      <td className="py-3.5 px-2">
                        <div className="font-extrabold text-[#16131F]">{order.id}</div>
                        <div className="text-xs text-[#5E5A70]">{order.date}</div>
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="font-bold text-[#16131F]">{order.client}</div>
                        <div className="text-xs text-[#5E5A70]">{order.phone}</div>
                      </td>
                      <td className="py-3.5 px-2 font-medium text-[#3A3647]">
                        {order.city}
                      </td>
                      <td className="py-3.5 px-2 font-medium text-[#16131F] max-w-[180px] truncate">
                        {order.product}
                      </td>
                      <td className="py-3.5 px-2 font-extrabold text-[#16131F] whitespace-nowrap">
                        {formatFCFA(order.amount)}
                      </td>
                      <td className="py-3.5 px-2">
                        <Badge variant={statusMeta[order.status]?.variant || 'default'}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-2 text-right whitespace-nowrap">
                        <a
                          href={`tel:${order.phone.replace(/\s+/g, '')}`}
                          title="Appeler le client"
                          className="inline-flex w-9 h-9 rounded-full bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#4B2FC9] items-center justify-center transition-colors align-middle"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleCopy(order)}
                          title="Copier les détails"
                          className="inline-flex w-9 h-9 rounded-full bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#4B2FC9] items-center justify-center transition-colors align-middle ml-1.5"
                        >
                          {copiedId === order.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className={cn(
                            'inline-flex items-center text-xs font-extrabold px-3.5 h-9 rounded-full ml-1.5 align-middle transition-colors cursor-pointer',
                            isSelected
                              ? 'bg-[#6C4CF1] text-white shadow-sm'
                              : 'bg-[#241D5E] hover:bg-[#1B1640] text-white'
                          )}
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="py-12 text-center text-sm text-[#5E5A70]">
              Aucune commande trouvée pour ces critères de recherche.
            </div>
          )}
        </section>

        {/* Side Drawer: Selected Order Detail with QR Code & Momo */}
        {selectedOrder && (
          <aside
            aria-label="Détails de la commande"
            className="w-full lg:w-[380px] bg-white rounded-3xl p-6 shadow-kolix-lg border border-[#E2DCF8]/60 flex flex-col gap-4.5 shrink-0 animate-in fade-in slide-in-from-right-4"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-start gap-3">
              <div>
                <span className="text-xs font-bold text-[#5E5A70]">{selectedOrder.date}</span>
                <h2 className="text-2xl font-extrabold text-[#241D5E] tracking-tight">
                  Commande {selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                aria-label="Fermer"
                className="w-9 h-9 rounded-full bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#16131F] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Status Picker */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#5E5A70] uppercase tracking-wider">
                Changer le statut
              </span>
              <div className="flex flex-wrap gap-1.5">
                {statusList.map((st) => {
                  const isCurrent = selectedOrder.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(selectedOrder.id, st)}
                      className={cn(
                        'text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer',
                        isCurrent
                          ? 'bg-[#241D5E] text-white shadow-sm ring-2 ring-[#241D5E]'
                          : 'bg-[#F4F1FE] text-[#3F25A8] hover:bg-[#E9E3FD]'
                      )}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client & Delivery Info Card */}
            <div className="bg-[#F4F1FE] rounded-2xl p-4 flex flex-col gap-2.5 text-xs sm:text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-[#5E5A70]">Client</span>
                <span className="font-bold text-[#16131F] text-right">{selectedOrder.client}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#5E5A70]">Téléphone</span>
                <span className="font-bold text-[#16131F]">{selectedOrder.phone}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#5E5A70]">Lieu de livraison</span>
                <span className="font-bold text-[#16131F] text-right max-w-[200px]">{selectedOrder.place}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#5E5A70]">Produit</span>
                <span className="font-bold text-[#16131F] text-right">{selectedOrder.product}</span>
              </div>
              <div className="flex flex-col gap-1 pt-1 border-t border-[#E2DCF8]">
                <span className="text-[#5E5A70] text-xs">Note de commande</span>
                <span className="font-semibold italic text-[#3A3647]">{selectedOrder.note}</span>
              </div>
              <div className="flex justify-between items-center gap-2 pt-2 border-t border-[#E2DCF8]">
                <span className="font-extrabold text-[#16131F]">Montant à encaisser</span>
                <span className="text-lg font-extrabold text-[#241D5E]">
                  {formatFCFA(selectedOrder.amount)}
                </span>
              </div>
            </div>

            {/* Dynamic QR Code Section */}
            <div className="flex gap-3.5 items-center p-3.5 bg-white rounded-2xl border border-[#E2DCF8] shadow-sm">
              <div className="bg-white p-2 rounded-xl shadow-inner border border-[#F0EDFB] shrink-0">
                <QRCodeSVG
                  value={selectedOrder.qrPayload || `KOLIX-PAY:${selectedOrder.id}:${selectedOrder.amount}`}
                  size={96}
                  level="M"
                  fgColor="#241D5E"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-xs font-extrabold text-[#241D5E]">
                  QR code de la commande
                </div>
                <div className="text-[11px] text-[#5E5A70] leading-snug">
                  À présenter au client à la livraison. Compatible <strong>Wave, Orange Money, MTN MoMo</strong>.
                </div>
              </div>
            </div>

            {/* Payment Status / Action */}
            {selectedOrder.paid ? (
              <div className="bg-[#241D5E] text-white rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-extrabold shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#A99BFA] shrink-0" />
                <span>Paiement validé : {selectedOrder.paid}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => confirmPayment(selectedOrder.id, 'Espèces')}
                    className="text-xs font-extrabold rounded-full border-2 border-[#241D5E] text-[#241D5E]"
                  >
                    Payer en espèces
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => confirmPayment(selectedOrder.id, 'Mobile Money · Wave')}
                    className="text-xs font-extrabold rounded-full"
                  >
                    Mobile Money
                  </Button>
                </div>
                <div className="text-[11px] text-[#5E5A70] leading-tight text-center">
                  Après confirmation Mobile Money, la commande passe automatiquement à « Livrée » et crédite le Portefeuille.
                </div>
              </div>
            )}

            {/* Bottom Contact Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0EDFB]">
              <a
                href={`tel:${selectedOrder.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-1.5 min-h-[44px] rounded-full bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8] text-xs font-extrabold no-underline transition-colors"
              >
                <Phone className="w-4 h-4" />
                Appeler
              </a>
              <button
                onClick={() => handleCopy(selectedOrder)}
                className="flex items-center justify-center gap-1.5 min-h-[44px] rounded-full bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8] text-xs font-extrabold transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                {copiedId === selectedOrder.id ? 'Copié !' : 'Copier l\'adresse'}
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* New Order Modal */}
      <Modal
        isOpen={newOrderModalOpen}
        onClose={() => setNewOrderModalOpen(false)}
        title="Créer une nouvelle commande"
        description="Enregistrez une commande express pour livraison immédiate."
      >
        <form onSubmit={handleCreateOrderSubmit} className="flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Nom complet du client *</label>
              <Input
                placeholder="Ex: Kouamé N’Guessan"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Numéro de téléphone *</label>
              <Input
                placeholder="Ex: 07 08 12 34 56"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Commune / Ville *</label>
              <select
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full min-h-[44px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-sm font-semibold text-[#16131F]"
              >
                <option value="Cocody">Cocody (Abidjan)</option>
                <option value="Yopougon">Yopougon (Abidjan)</option>
                <option value="Marcory">Marcory (Abidjan)</option>
                <option value="Treichville">Treichville (Abidjan)</option>
                <option value="Abobo">Abobo (Abidjan)</option>
                <option value="Bouaké">Bouaké</option>
                <option value="Yamoussoukro">Yamoussoukro</option>
                <option value="San-Pédro">San-Pédro</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-1">Montant à encaisser (FCFA) *</label>
              <Input
                type="number"
                placeholder="22000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Adresse exacte / Repère de livraison *</label>
            <Input
              placeholder="Ex: Angré 8e tranche, en face de la pharmacie Sainte Famille"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Article commandé *</label>
            <Input
              placeholder="Ex: Montre connectée X2 ×1"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Instructions pour le livreur (optionnel)</label>
            <Input
              placeholder="Ex: Appeler 30 minutes avant d'arriver"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-[#F0EDFB]">
            <Button variant="ghost" type="button" onClick={() => setNewOrderModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer la commande
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
