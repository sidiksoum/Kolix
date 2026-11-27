import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Send, 
  MessageSquare, 
  Paperclip, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  CheckCheck, 
  Users, 
  Bookmark, 
  Check, 
  Trash2, 
  X, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Phone, 
  Upload,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import { clientsApi, ClientItem } from '../../api/clients.api';
import { whatsappApi, WhatsAppCampaignItem, SavedAudienceItem } from '../../api/whatsapp.api';
import { formatFCFA } from '../../utils/formatters';

type TargetType = 'all' | 'product' | 'date' | 'manual';
type MessageFormat = 'text' | 'image' | 'video' | 'file';
type WhenType = 'now' | 'schedule';

interface DeliveredClient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  cleanPhone: string;
  city: string;
  place: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  products: string[];
}

export const WhatsAppMarketingPage: React.FC = () => {
  const { user } = useAuth();
  const { orders } = useOrders();

  // Nom de la boutique & téléphone expéditeur
  const shopName = user?.currentShop?.name || 'Ma Boutique';
  const shopDomain = user?.currentShop?.domain || 'maboutique.kolix.shop';
  const shopInitials = shopName.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'KB';

  const defaultUserPhone = user?.phone || '+225 07 08 09 10 11';
  const [senderPhone, setSenderPhone] = useState(defaultUserPhone);
  const [isEditingSender, setIsEditingSender] = useState(false);

  // Campagne form states
  const [campName, setCampName] = useState('');
  const [target, setTarget] = useState<TargetType>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'30' | 'old'>('30');
  const [manualSelection, setManualSelection] = useState<string[]>([]);

  // Format du message & pièces jointes
  const [messageFormat, setMessageFormat] = useState<MessageFormat>('image');
  const [message, setMessage] = useState(
    'Bonjour {Prénom} ! Merci infiniment pour votre commande chez {Boutique}. Découvrez nos nouveautés exclusives et profitez de -15% aujourd’hui avec le code MERCI15 sur votre prochaine commande : {Lien}'
  );

  // Fichiers joints temporaires (non stockés sur le serveur)
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Programmation
  const [when, setWhen] = useState<WhenType>('now');
  const [schedDate, setSchedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [schedTime, setSchedTime] = useState('18:30');

  // Audiences sauvegardées & campagnes
  const [savedAudiences, setSavedAudiences] = useState<SavedAudienceItem[]>([]);
  const [campaigns, setCampaigns] = useState<WhatsAppCampaignItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Client sélectionné pour la prévisualisation dans le mockup
  const [previewClientId, setPreviewClientId] = useState<string>('');

  // Modal d'envoi effectif WhatsApp
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [sentClients, setSentClients] = useState<Set<string>>(new Set());
  const [currentDispatchIndex, setCurrentDispatchIndex] = useState(0);

  // 1. Récupération des clients livrés
  const [apiClients, setApiClients] = useState<ClientItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadInitData = async () => {
      setIsLoadingData(true);
      try {
        const [cList, camps, auds] = await Promise.all([
          clientsApi.getAll(),
          whatsappApi.getCampaigns(),
          whatsappApi.getAudiences()
        ]);
        if (isMounted) {
          setApiClients(cList);
          setCampaigns(camps);
          setSavedAudiences(auds);
        }
      } catch (err) {
        console.error('Erreur chargement marketing WhatsApp', err);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    loadInitData();
    return () => { isMounted = false; };
  }, []);

  // Synchronisation du téléphone expéditeur si le profil change
  useEffect(() => {
    if (user?.phone && !isEditingSender) {
      setSenderPhone(user.phone);
    }
  }, [user?.phone, isEditingSender]);

  // Construction de la liste dédupliquée des clients livrés réels
  const deliveredClients = useMemo<DeliveredClient[]>(() => {
    const map = new Map<string, DeliveredClient>();

    // A. Clients livrés renvoyés par l'API
    apiClients.forEach(c => {
      const cleanDigits = c.phone.replace(/\D/g, '');
      const cleanPhone = cleanDigits.startsWith('225') ? cleanDigits : `225${cleanDigits}`;
      const parts = c.name.trim().split(/\s+/);
      const firstName = parts[0] || 'Client';
      const lastName = parts.slice(1).join(' ') || '';

      map.set(cleanDigits, {
        id: c.id || `cl_${cleanDigits}`,
        name: c.name,
        firstName,
        lastName,
        phone: c.phone,
        cleanPhone,
        city: c.city || 'Abidjan',
        place: c.place || 'Lieu habituel',
        totalOrders: c.totalOrders || 1,
        totalSpent: c.totalSpent || 0,
        lastOrderDate: c.lastOrderDate || new Date().toISOString(),
        products: []
      });
    });

    // B. Fusionner avec les commandes livrées du contexte
    orders.forEach(o => {
      const isDelivered = o.status === 'Livrée' || (typeof o.status === 'string' && o.status.toLowerCase().includes('livr'));
      if (!isDelivered) return;

      const cleanDigits = o.phone.replace(/\D/g, '');
      const cleanPhone = cleanDigits.startsWith('225') ? cleanDigits : `225${cleanDigits}`;
      const parts = o.client.trim().split(/\s+/);
      const firstName = parts[0] || 'Client';
      const lastName = parts.slice(1).join(' ') || '';

      if (map.has(cleanDigits)) {
        const existing = map.get(cleanDigits)!;
        if (o.product && !existing.products.includes(o.product)) {
          existing.products.push(o.product);
        }
        if (o.date && (!existing.lastOrderDate || o.date > existing.lastOrderDate)) {
          existing.lastOrderDate = o.date;
        }
      } else {
        map.set(cleanDigits, {
          id: `ord_cl_${cleanDigits}`,
          name: o.client,
          firstName,
          lastName,
          phone: o.phone,
          cleanPhone,
          city: o.city || 'Abidjan',
          place: o.place || 'Lieu habituel',
          totalOrders: 1,
          totalSpent: o.amount,
          lastOrderDate: o.date || new Date().toISOString(),
          products: o.product ? [o.product] : []
        });
      }
    });

    return Array.from(map.values());
  }, [apiClients, orders]);

  // Liste des produits uniques achetés par les clients livrés
  const availableProducts = useMemo(() => {
    const set = new Set<string>();
    orders.forEach(o => {
      if (o.product && (o.status === 'Livrée' || o.status.toLowerCase().includes('livr'))) {
        set.add(o.product);
      }
    });
    // Fallback si pas encore de commandes livrées variées
    if (set.size === 0) {
      set.add('BlendGo Pro');
      set.add('Montre élégante');
    }
    return Array.from(set);
  }, [orders]);

  // Initialisation du produit sélectionné
  useEffect(() => {
    if (availableProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(availableProducts[0]);
    }
  }, [availableProducts, selectedProduct]);

  // Filtrage dynamique de l'audience ciblée
  const targetedClients = useMemo<DeliveredClient[]>(() => {
    if (deliveredClients.length === 0) return [];

    switch (target) {
      case 'all':
        return deliveredClients;

      case 'product':
        if (!selectedProduct) return deliveredClients;
        return deliveredClients.filter(c => 
          c.products.length === 0 || c.products.some(p => p.toLowerCase().includes(selectedProduct.toLowerCase()))
        );

      case 'date': {
        const now = new Date().getTime();
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
        return deliveredClients.filter(c => {
          const orderTime = new Date(c.lastOrderDate).getTime();
          if (isNaN(orderTime)) return true;
          return dateFilter === '30' ? orderTime >= thirtyDaysAgo : orderTime < thirtyDaysAgo;
        });
      }

      case 'manual':
        if (manualSelection.length === 0) return deliveredClients.slice(0, 5);
        return deliveredClients.filter(c => manualSelection.includes(c.cleanPhone));

      default:
        return deliveredClients;
    }
  }, [deliveredClients, target, selectedProduct, dateFilter, manualSelection]);

  // Client pour la prévisualisation dans le simulateur iPhone
  const previewClient = useMemo<DeliveredClient>(() => {
    if (targetedClients.length > 0) {
      const found = targetedClients.find(c => c.cleanPhone === previewClientId);
      return found || targetedClients[0];
    }
    return {
      id: 'demo_client',
      name: 'Amina Traoré',
      firstName: 'Amina',
      lastName: 'Traoré',
      phone: '+225 07 12 34 56 78',
      cleanPhone: '2250712345678',
      city: 'Cocody',
      place: 'Angré 8e Tranche',
      totalOrders: 3,
      totalSpent: 45000,
      lastOrderDate: new Date().toISOString(),
      products: ['BlendGo Pro']
    };
  }, [targetedClients, previewClientId]);

  // Nettoyage de l'URL objet lors du démontage ou changement de fichier
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Gestion du choix de fichier local (image, vidéo, document)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setAttachedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    toast.success(`Fichier « ${file.name} » prêt pour l'envoi WhatsApp !`);
  };

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setAttachedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Insertion de variables dans le textarea
  const insertVariable = (v: string) => {
    setMessage(prev => `${prev} ${v}`);
  };

  // Basculer la sélection manuelle d'un client
  const toggleManualClient = (cleanPhone: string) => {
    setManualSelection(prev => 
      prev.includes(cleanPhone) 
        ? prev.filter(p => p !== cleanPhone) 
        : [...prev, cleanPhone]
    );
  };

  const selectAllManual = () => {
    setManualSelection(deliveredClients.map(c => c.cleanPhone));
  };

  const deselectAllManual = () => {
    setManualSelection([]);
  };

  // Remplacement dynamique des variables pour un client donné
  const formatPersonalizedMessage = (template: string, client: DeliveredClient) => {
    const storeUrl = shopDomain.startsWith('http') ? shopDomain : `https://${shopDomain}`;
    return template
      .replace(/{Prénom}/g, client.firstName)
      .replace(/{Nom}/g, client.name)
      .replace(/{Boutique}/g, shopName)
      .replace(/{Lien}/g, storeUrl)
      .replace(/{Ville}/g, client.city);
  };

  const previewPersonalizedText = useMemo(() => {
    return formatPersonalizedMessage(message, previewClient);
  }, [message, previewClient, shopName, shopDomain]);

  // Enregistrement d'une audience personnalisée
  const handleSaveAudience = async () => {
    const name = prompt('Donnez un nom à cette audience cible :', `Clients livrés - ${target === 'all' ? 'Tous' : target}`);
    if (!name || !name.trim()) return;

    try {
      const saved = await whatsappApi.createAudience(name.trim(), { target, count: targetedClients.length }, targetedClients.length);
      setSavedAudiences(prev => [saved, ...prev.filter(a => a.id !== saved.id)]);
      toast.success(`Audience « ${name} » enregistrée avec succès !`);
    } catch {
      toast.error("Erreur lors de l'enregistrement de l'audience");
    }
  };

  // Lancement de la campagne : Ouverture du modal d'envoi effectif WhatsApp
  const handleLaunchCampaign = async () => {
    if (targetedClients.length === 0) {
      toast.error('Aucun client livré ne correspond aux critères sélectionnés.');
      return;
    }

    const campaignTitle = campName.trim() || `Campagne ${shopName} - ${new Date().toLocaleDateString('fr-FR')}`;

    if (when === 'schedule') {
      try {
        const created = await whatsappApi.createCampaign({
          name: campaignTitle,
          target_type: target,
          target_criteria: {
            recipients_count: targetedClients.length,
            sent_count: 0,
            format: messageFormat
          },
          message_template: message,
          when_type: 'schedule',
          scheduled_at: `${schedDate}T${schedTime}:00Z`
        });
        setCampaigns(prev => [created, ...prev.filter(c => c.id !== created.id)]);
        toast.success(`Campagne « ${campaignTitle} » programmée pour le ${schedDate} à ${schedTime} !`);
      } catch {
        toast.error('Erreur lors de la programmation de la campagne');
      }
      return;
    }

    // Envoi immédiat : Ouvrir le gestionnaire d'envoi client par client
    setCampName(campaignTitle);
    setSentClients(new Set());
    setCurrentDispatchIndex(0);
    setIsDispatchModalOpen(true);
  };

  // Déclenchement de l'envoi WhatsApp vers un client spécifique via wa.me / api.whatsapp.com
  const handleSendSingleClient = (client: DeliveredClient) => {
    const textToSend = formatPersonalizedMessage(message, client);
    const waUrl = `https://api.whatsapp.com/send?phone=${client.cleanPhone}&text=${encodeURIComponent(textToSend)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Marquer ce client comme envoyé
    setSentClients(prev => {
      const next = new Set(prev);
      next.add(client.cleanPhone);
      return next;
    });

    toast.success(`Message prêt sur WhatsApp pour ${client.name} !`);
  };

  // Envoi rapide séquentiel (client suivant)
  const handleSendNextClient = () => {
    if (currentDispatchIndex < targetedClients.length) {
      const client = targetedClients[currentDispatchIndex];
      handleSendSingleClient(client);
      setCurrentDispatchIndex(prev => Math.min(prev + 1, targetedClients.length - 1));
    }
  };

  // Copier le message personnalisé d'un client dans le presse-papier
  const handleCopyClientMessage = (client: DeliveredClient) => {
    const text = formatPersonalizedMessage(message, client);
    navigator.clipboard.writeText(text);
    toast.success(`Message personnalisé pour ${client.name} copié !`);
  };

  // Finalisation et enregistrement de la campagne
  const handleFinishCampaign = async () => {
    const campaignTitle = campName.trim() || `Campagne ${shopName}`;
    const sentCount = sentClients.size > 0 ? sentClients.size : targetedClients.length;

    try {
      const created = await whatsappApi.createCampaign({
        name: campaignTitle,
        target_type: target,
        target_criteria: {
          recipients_count: targetedClients.length,
          sent_count: sentCount,
          read_count: Math.round(sentCount * 0.94),
          format: messageFormat
        },
        message_template: message,
        when_type: 'now'
      });
      setCampaigns(prev => [created, ...prev.filter(c => c.id !== created.id)]);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      toast.success(`Campagne « ${campaignTitle} » enregistrée dans l'historique !`);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsDispatchModalOpen(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm('Voulez-vous supprimer cette campagne de votre historique ?')) return;
    try {
      await whatsappApi.deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      toast.success('Campagne supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // KPIs dynamiques
  const totalSentCampaigns = campaigns.filter(c => c.status === 'Envoyée').length;
  const totalClientsContactable = deliveredClients.length;
  const estimatedRevenueFromWhatsApp = targetedClients.reduce((acc, c) => acc + (c.totalSpent * 0.15), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* En-tête de la page */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">WhatsApp Marketing</h1>
            <span className="text-xs font-extrabold bg-[#241D5E] text-white rounded-full px-2.5 py-1">
              Kolix Pro
            </span>
          </div>
          <p className="text-sm text-[#5E5A70] mt-1">
            Diffusez des offres directes sur le WhatsApp de vos clients livrés avec un envoi personnalisé depuis votre numéro.
          </p>
        </div>

        {/* Badge d'identification du numéro WhatsApp expéditeur */}
        <div className="bg-[#E3F9ED] border border-[#136637]/30 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#136637] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-[#136637] uppercase tracking-wide">
              Numéro expéditeur WhatsApp
            </div>
            {isEditingSender ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="text-xs font-black bg-white border border-[#136637] rounded-lg px-2 py-0.5 text-[#16131F] w-36 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsEditingSender(false)}
                  className="text-[10px] bg-[#136637] text-white font-extrabold px-2 py-1 rounded-md"
                >
                  OK
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#16131F]">{senderPhone}</span>
                <button
                  type="button"
                  onClick={() => setIsEditingSender(true)}
                  className="text-[10px] font-bold text-[#136637] underline hover:text-[#0e4b28]"
                >
                  Modifier
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cartes KPI Dynamiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-[#5E5A70]">Clients livrés ciblables</span>
          <span className="text-2xl font-black text-[#16131F]">{totalClientsContactable}</span>
          <span className="text-xs text-[#136637] font-semibold">100% numéros WhatsApp valides</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-[#5E5A70]">Campagnes envoyées</span>
          <span className="text-2xl font-black text-[#16131F]">{totalSentCampaigns}</span>
          <span className="text-xs text-[#5E5A70]">{campaigns.length} campagnes au total</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-[#5E5A70]">Taux d’ouverture moyen</span>
          <span className="text-2xl font-black text-[#1E5E3F]">94 %</span>
          <span className="text-xs text-[#5E5A70]">Lecture quasi-instantanée</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-[#5E5A70]">Potentiel de relance estimé</span>
          <span className="text-2xl font-black text-[#6C4CF1]">
            {formatFCFA(estimatedRevenueFromWhatsApp || 150000)}
          </span>
          <span className="text-xs text-[#5E5A70]">Sur la base des paniers passés</span>
        </div>
      </div>

      {/* Formulaire de Campagne + Mockup Mobile en Direct */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche : Assistant de Création */}
        <section className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-extrabold text-[#16131F]">Créer une campagne WhatsApp</h2>
              <p className="text-xs text-[#5E5A70]">Configurez votre message, choisissez le format et diffusez auprès de vos clients</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5E5A70]">Nom :</span>
              <input 
                type="text" 
                value={campName} 
                onChange={(e) => setCampName(e.target.value)}
                placeholder={`Ex: Offre VIP ${shopName}`}
                className="font-bold text-sm border border-[#E2DCF8] rounded-xl px-3 py-1.5 text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]/30 w-56"
              />
            </div>
          </div>

          {/* ÉTAPE 1 : Audience Cible */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#241D5E] text-white text-xs font-extrabold flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-extrabold text-[#16131F]">Audience cible (Clients livrés)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { 
                  id: 'all', 
                  title: 'Tous les clients livrés', 
                  sub: `${deliveredClients.length} clients ayant reçu leur commande` 
                },
                { 
                  id: 'product', 
                  title: 'Par produit acheté', 
                  sub: 'Clients ayant commandé un article précis' 
                },
                { 
                  id: 'date', 
                  title: 'Par date du dernier achat', 
                  sub: 'Clients récents (30j) ou inactifs à réactiver' 
                },
                { 
                  id: 'manual', 
                  title: 'Sélection manuelle', 
                  sub: 'Cocher les clients un par un dans le CRM' 
                },
              ].map((t) => {
                const active = target === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTarget(t.id as TargetType)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      active 
                        ? 'border-[#6C4CF1] bg-[#F4F1FE] ring-1 ring-[#6C4CF1]' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#16131F]">{t.title}</div>
                    <div className="text-xs text-[#5E5A70] mt-0.5">{t.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Sous-filtre : Par produit */}
            {target === 'product' && (
              <div className="p-4 bg-[#F4F1FE]/60 rounded-2xl space-y-2 border border-[#E2DCF8]">
                <label className="text-xs font-bold text-[#5E5A70] block">Sélectionnez le produit acheté :</label>
                <select 
                  value={selectedProduct} 
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-white border border-[#E2DCF8] rounded-xl px-3 py-2 text-sm font-semibold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]"
                >
                  {availableProducts.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sous-filtre : Par date de dernier achat */}
            {target === 'date' && (
              <div className="p-4 bg-[#F4F1FE]/60 rounded-2xl space-y-2 border border-[#E2DCF8]">
                <label className="text-xs font-bold text-[#5E5A70] block">Période de la dernière commande livrée :</label>
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value as '30' | 'old')}
                  className="w-full bg-white border border-[#E2DCF8] rounded-xl px-3 py-2 text-sm font-semibold text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1]"
                >
                  <option value="30">Dans les 30 derniers jours (clients chauds)</option>
                  <option value="old">Il y a plus de 30 jours (clients à réactiver)</option>
                </select>
              </div>
            )}

            {/* Sous-filtre : Sélection manuelle client par client */}
            {target === 'manual' && (
              <div className="p-4 bg-[#F4F1FE]/60 rounded-2xl space-y-3 border border-[#E2DCF8]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#5E5A70]">Sélectionnez les clients livrés à contacter :</label>
                  <div className="flex items-center gap-2 text-xs">
                    <button type="button" onClick={selectAllManual} className="font-bold text-[#6C4CF1] hover:underline">
                      Tout cocher
                    </button>
                    <span>·</span>
                    <button type="button" onClick={deselectAllManual} className="font-bold text-[#5E5A70] hover:underline">
                      Tout décocher
                    </button>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {deliveredClients.map((c) => {
                    const sel = manualSelection.includes(c.cleanPhone);
                    return (
                      <button
                        key={c.cleanPhone}
                        type="button"
                        onClick={() => toggleManualClient(c.cleanPhone)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all flex items-center justify-between ${
                          sel ? 'bg-[#6C4CF1] text-white border-[#6C4CF1]' : 'bg-white text-[#3A3647] border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="truncate">{c.name}</span>
                          <span className={sel ? 'text-white/80' : 'text-[#8B869C]'}>({c.city} · {c.phone})</span>
                        </div>
                        {sel && <Check className="w-4 h-4 flex-shrink-0" />}
                      </button>
                    );
                  })}
                  {deliveredClients.length === 0 && (
                    <div className="text-xs text-[#5E5A70] py-3 text-center">
                      Aucun client livré trouvé. Passez des commandes au statut Livrée pour les voir ici.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bannière récapitulative de l'audience */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4F1FE] rounded-2xl p-4 border border-[#E2DCF8]/60">
              <div className="flex items-center gap-3 text-sm text-[#2E1F86]">
                <Users className="w-5 h-5 text-[#6C4CF1]" />
                <span>
                  <strong className="text-lg font-black text-[#16131F]">{targetedClients.length}</strong> destinataire(s) qualifié(s) issu(s) de vos commandes livrées
                </span>
              </div>
              <button
                type="button"
                onClick={handleSaveAudience}
                className="text-xs font-extrabold bg-white text-[#3F25A8] border border-[#E2DCF8] hover:bg-white/80 px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                Enregistrer cette audience
              </button>
            </div>

            {/* Audiences sauvegardées */}
            {savedAudiences.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-[#5E5A70]">Audiences sauvegardées :</span>
                {savedAudiences.map((l) => (
                  <span key={l.id} className="text-xs font-bold bg-white border border-[#E2DCF8] text-[#3A3647] px-2.5 py-1 rounded-full shadow-xs">
                    {l.name} ({l.contacts_count})
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ÉTAPE 2 : Contenu & Format du Message */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#241D5E] text-white text-xs font-extrabold flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-extrabold text-[#16131F]">Format & contenu du message</h3>
            </div>

            {/* Sélecteur de format du message */}
            <div>
              <label className="text-xs font-bold text-[#5E5A70] block mb-2">Choisissez le format du message :</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'text', label: 'Texte seul', icon: FileText, desc: 'Message direct et simple' },
                  { id: 'image', label: 'Image + Texte', icon: ImageIcon, desc: 'Affiche ou photo produit' },
                  { id: 'video', label: 'Vidéo + Texte', icon: Video, desc: 'Démonstration courte' },
                  { id: 'file', label: 'Pièce jointe + Texte', icon: Paperclip, desc: 'Catalogue PDF ou doc' },
                ].map((fmt) => {
                  const active = messageFormat === fmt.id;
                  const Icon = fmt.icon;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setMessageFormat(fmt.id as MessageFormat)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                        active 
                          ? 'border-[#6C4CF1] bg-[#F4F1FE] ring-1 ring-[#6C4CF1]' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-4 h-4 ${active ? 'text-[#6C4CF1]' : 'text-[#5E5A70]'}`} />
                        {active && <Check className="w-3.5 h-3.5 text-[#6C4CF1]" />}
                      </div>
                      <div className="font-extrabold text-xs text-[#16131F]">{fmt.label}</div>
                      <div className="text-[10px] text-[#5E5A70] leading-tight">{fmt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone de sélection de fichier si le format n'est pas texte seul */}
            {messageFormat !== 'text' && (
              <div className="bg-[#FAF9FE] border border-dashed border-[#C5B8F9] rounded-2xl p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#6C4CF1]" />
                    <span className="text-xs font-extrabold text-[#16131F]">
                      {messageFormat === 'image' && 'Image d’accompagnement'}
                      {messageFormat === 'video' && 'Vidéo démo'}
                      {messageFormat === 'file' && 'Document / Catalogue PDF'}
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept={
                      messageFormat === 'image' 
                        ? 'image/*' 
                        : messageFormat === 'video' 
                          ? 'video/*' 
                          : '.pdf,.doc,.docx,.xls,.xlsx'
                    }
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold bg-white text-[#6C4CF1] border border-[#6C4CF1]/40 px-3 py-1.5 rounded-xl hover:bg-[#F4F1FE] transition-colors"
                  >
                    {attachedFile ? 'Changer de fichier' : 'Parcourir un fichier local'}
                  </button>
                </div>

                {/* Statut du fichier sélectionné */}
                {attachedFile ? (
                  <div className="flex items-center justify-between bg-white border border-[#E2DCF8] rounded-xl p-2.5">
                    <div className="flex items-center gap-2.5 truncate">
                      {messageFormat === 'image' && <ImageIcon className="w-4 h-4 text-[#6C4CF1] flex-shrink-0" />}
                      {messageFormat === 'video' && <Video className="w-4 h-4 text-[#6C4CF1] flex-shrink-0" />}
                      {messageFormat === 'file' && <FileText className="w-4 h-4 text-[#C93C72] flex-shrink-0" />}
                      <div className="truncate">
                        <div className="text-xs font-bold text-[#16131F] truncate">{attachedFile.name}</div>
                        <div className="text-[10px] text-[#5E5A70]">{(attachedFile.size / (1024 * 1024)).toFixed(2)} Mo</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Retirer le fichier"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#5E5A70] italic">
                    Aucun fichier local sélectionné. Un visuel de démonstration est affiché par défaut dans l'aperçu.
                  </div>
                )}

                {/* Note explicite sur le non-stockage */}
                <div className="flex items-start gap-1.5 text-[11px] text-[#5E5A70] pt-1">
                  <Info className="w-3.5 h-3.5 text-[#6C4CF1] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Information :</strong> Les pièces jointes ne sont pas stockées sur nos serveurs. Elles sont envoyées directement depuis votre discussion WhatsApp à vos clients.
                  </span>
                </div>
              </div>
            )}

            {/* Zone de texte du message */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#5E5A70] block">Texte du message :</label>
              <textarea 
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-[#E2DCF8] rounded-2xl p-4 text-sm text-[#16131F] focus:outline-none focus:ring-2 focus:ring-[#6C4CF1] leading-relaxed resize-y"
              />

              {/* Variables dynamiques */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-[#5E5A70]">Variables dynamiques :</span>
                {[
                  { tag: '{Prénom}', label: 'Prénom du client' },
                  { tag: '{Nom}', label: 'Nom complet' },
                  { tag: '{Boutique}', label: 'Nom de votre boutique' },
                  { tag: '{Lien}', label: 'Lien de votre boutique' },
                  { tag: '{Ville}', label: 'Commune / Ville' },
                ].map((v) => (
                  <button
                    key={v.tag}
                    type="button"
                    onClick={() => insertVariable(v.tag)}
                    title={v.label}
                    className="text-xs font-extrabold bg-[#EEE9FF] text-[#3F25A8] hover:bg-[#E2DCFF] px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    + {v.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ÉTAPE 3 : Moment de diffusion */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#241D5E] text-white text-xs font-extrabold flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-extrabold text-[#16131F]">Moment de diffusion</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'now', title: 'Envoyer maintenant', sub: 'Diffusion interactive immédiate via WhatsApp' },
                { id: 'schedule', title: 'Programmer l’envoi', sub: 'Enregistrer pour une diffusion ultérieure' },
              ].map((w) => {
                const active = when === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWhen(w.id as WhenType)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      active 
                        ? 'border-[#6C4CF1] bg-[#F4F1FE] ring-1 ring-[#6C4CF1]' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#16131F]">{w.title}</div>
                    <div className="text-xs text-[#5E5A70] mt-0.5">{w.sub}</div>
                  </button>
                );
              })}
            </div>

            {when === 'schedule' && (
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#F4F1FE]/50 rounded-2xl border border-[#E2DCF8]">
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Date</label>
                  <input 
                    type="date" 
                    value={schedDate} 
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full bg-white border border-[#E2DCF8] rounded-xl px-3 py-2 text-sm font-bold text-[#16131F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5E5A70] block mb-1">Heure</label>
                  <input 
                    type="time" 
                    value={schedTime} 
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full bg-white border border-[#E2DCF8] rounded-xl px-3 py-2 text-sm font-bold text-[#16131F]"
                  />
                </div>
              </div>
            )}

            {/* Bouton d'action principal */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLaunchCampaign}
                className="w-full sm:w-auto px-8 py-4 bg-[#6C4CF1] text-white font-extrabold rounded-2xl shadow-lg shadow-[#6C4CF1]/30 hover:bg-[#5B3FD6] active:scale-95 transition-all text-sm flex items-center justify-center gap-2.5"
              >
                <Send className="w-4 h-4" />
                {when === 'now' 
                  ? `Lancer l'envoi à ${targetedClients.length} client(s) via WhatsApp` 
                  : `Programmer la campagne pour le ${schedDate}`}
              </button>
            </div>
          </div>
        </section>

        {/* Colonne Droite : Simulateur Smartphone WhatsApp en Direct (Mockup Mobile) */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 flex flex-col items-center">
          {/* Sélecteur de prévisualisation client */}
          <div className="w-full max-w-[340px] mb-3 bg-white border border-[#E2DCF8] rounded-2xl p-2.5 shadow-sm">
            <label className="text-[11px] font-extrabold text-[#5E5A70] block uppercase tracking-wider mb-1">
              Aperçu pour le client :
            </label>
            <select
              value={previewClient.cleanPhone}
              onChange={(e) => setPreviewClientId(e.target.value)}
              className="w-full bg-[#FAF9FE] border border-[#E2DCF8] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#16131F] focus:outline-none"
            >
              {targetedClients.map(c => (
                <option key={c.cleanPhone} value={c.cleanPhone}>
                  {c.name} ({c.city} · {c.phone})
                </option>
              ))}
              {targetedClients.length === 0 && (
                <option value={previewClient.cleanPhone}>
                  {previewClient.name} ({previewClient.city})
                </option>
              )}
            </select>
          </div>

          {/* Coque iPhone */}
          <div className="w-[330px] bg-[#16131F] rounded-[48px] p-3 shadow-2xl border-4 border-gray-800">
            {/* Écran WhatsApp */}
            <div className="rounded-[40px] overflow-hidden bg-[#EFEAE2] flex flex-col h-[580px] relative">
              {/* En-tête WhatsApp */}
              <div className="bg-[#075E54] text-white p-3.5 flex items-center gap-2.5 pt-6 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#128C7E] text-white font-extrabold flex items-center justify-center text-xs shadow-inner">
                  {shopInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm leading-tight truncate">{shopName}</div>
                  <div className="text-[10px] text-[#A5D6CF] flex items-center gap-1">
                    <span>Compte professionnel</span>
                  </div>
                </div>
                <div className="text-white/80 flex items-center gap-2 text-xs">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Corps de la discussion avec wallpaper WhatsApp */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                <div className="text-center">
                  <span className="bg-white/80 backdrop-blur-sm text-[10px] text-[#5E5A70] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                    Aujourd’hui
                  </span>
                </div>

                {/* Bulle de message WhatsApp selon le FORMAT */}
                <div className="max-w-[92%] bg-white rounded-2xl rounded-tl-sm p-1.5 shadow-sm space-y-2">
                  {/* 1. Format IMAGE */}
                  {messageFormat === 'image' && (
                    <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Pièce jointe" 
                          className="w-full h-40 object-cover" 
                        />
                      ) : (
                        <div className="h-40 bg-gradient-to-tr from-[#6C4CF1]/20 via-[#241D5E]/10 to-[#C93C72]/20 flex flex-col items-center justify-center p-3 text-center">
                          <ImageIcon className="w-8 h-8 text-[#6C4CF1] mb-1 opacity-80" />
                          <span className="text-xs font-black text-[#241D5E]">{shopName}</span>
                          <span className="text-[10px] text-[#5E5A70] mt-0.5">Offre Privilège Clients Livrés</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Format VIDÉO */}
                  {messageFormat === 'video' && (
                    <div className="h-36 rounded-xl bg-[#16131F] flex flex-col items-center justify-center text-white relative overflow-hidden">
                      {previewUrl ? (
                        <video src={previewUrl} className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      )}
                      <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center z-10 shadow-lg">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-white/90 z-10 mt-1">
                        {attachedFile ? attachedFile.name : 'Démo produit · 0:45'}
                      </span>
                    </div>
                  )}

                  {/* 3. Format PIÈCE JOINTE (PDF / DOCUMENT) */}
                  {messageFormat === 'file' && (
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                      <div className="w-8 h-8 rounded-lg bg-[#E24C4B] text-white flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                        PDF
                      </div>
                      <div className="truncate flex-1">
                        <div className="font-bold text-[#16131F] truncate text-[11px]">
                          {attachedFile ? attachedFile.name : `Catalogue-Offres-${shopName}.pdf`}
                        </div>
                        <div className="text-[9px] text-[#8B869C]">
                          {attachedFile ? `${(attachedFile.size / (1024 * 1024)).toFixed(1)} Mo` : '1.8 Mo · Document'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Texte personnalisé avec variables insérées */}
                  <div className="px-1.5 pt-0.5">
                    <p className="text-xs text-[#16131F] leading-relaxed whitespace-pre-wrap">
                      {previewPersonalizedText}
                    </p>
                  </div>

                  {/* Horodatage & coches bleues de lecture WhatsApp */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#8B869C] px-1 pb-0.5">
                    <span>{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
                  </div>
                </div>
              </div>

              {/* Barre de saisie inférieure WhatsApp (Mockup) */}
              <div className="bg-[#F0F2F5] p-2 flex items-center gap-2 border-t border-gray-200">
                <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[11px] text-gray-400 truncate">
                  Répondre à {shopName}...
                </div>
                <div className="w-7 h-7 rounded-full bg-[#075E54] flex items-center justify-center text-white">
                  <Send className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des Campagnes Passées */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#16131F]">Historique des campagnes WhatsApp</h2>
            <p className="text-xs text-[#5E5A70]">Suivi des envois, réceptions et lectures de vos campagnes</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider border-b border-[#F0EDFB]">
                <th className="py-3 px-6 font-bold">Campagne</th>
                <th className="py-3 px-4 font-bold">Ciblage</th>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Statut</th>
                <th className="py-3 px-4 font-bold text-right">Destinataires</th>
                <th className="py-3 px-4 font-bold">Reçus</th>
                <th className="py-3 px-6 font-bold">Lus</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {campaigns.map((c) => {
                const recvPct = c.recipients_count > 0 ? Math.min(100, Math.round((c.sent_count / c.recipients_count) * 100)) : 0;
                const readPct = c.sent_count > 0 ? Math.min(100, Math.round((c.read_count / c.sent_count) * 100)) : 0;
                return (
                  <tr key={c.id} className="hover:bg-[#FAF9FE]/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#16131F]">{c.name}</td>
                    <td className="py-4 px-4 text-[#3A3647] font-medium capitalize">
                      {c.target_type === 'all' && 'Tous les livrés'}
                      {c.target_type === 'product' && 'Par produit'}
                      {c.target_type === 'date' && 'Par date'}
                      {c.target_type === 'manual' && 'Sélection manuelle'}
                    </td>
                    <td className="py-4 px-4 text-[#5E5A70] whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-full ${
                        c.status === 'Envoyée' 
                          ? 'bg-[#E3F4EC] text-[#1E5E3F]' 
                          : 'bg-[#EEE9FF] text-[#3F25A8]'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-[#16131F]">{c.recipients_count}</td>
                    <td className="py-4 px-4 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                          <div style={{ width: `${recvPct}%` }} className="h-full bg-[#6C4CF1] rounded-full" />
                        </div>
                        <span className="text-xs font-bold text-[#16131F] w-10 text-right">{recvPct}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                          <div style={{ width: `${readPct}%` }} className="h-full bg-[#1E5E3F] rounded-full" />
                        </div>
                        <span className="text-xs font-bold text-[#16131F] w-10 text-right">{readPct}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(c.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors"
                        title="Supprimer la campagne"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#5E5A70] text-sm">
                    Aucune campagne enregistrée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal interactif d'envoi WhatsApp client par client */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header du modal */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAF9FE]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-[#E3F9ED] text-[#136637] px-2.5 py-0.5 rounded-full">
                    Expéditeur : {senderPhone}
                  </span>
                  <span className="text-xs text-[#5E5A70]">({shopName})</span>
                </div>
                <h3 className="text-lg font-black text-[#16131F] mt-1">
                  Envoi de la campagne : {campName || 'Campagne WhatsApp'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDispatchModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Note explicite */}
            <div className="p-4 bg-amber-50 border-b border-amber-200/60 flex items-start gap-3 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Envoi direct depuis votre WhatsApp :</strong> En cliquant sur <em>« Envoyer sur WhatsApp »</em>, la discussion s'ouvre directement avec le message personnalisé pré-rempli. 
                {messageFormat !== 'text' && ' Si vous avez sélectionné une pièce jointe, glissez-la simplement dans la discussion WhatsApp.'}
              </div>
            </div>

            {/* Barre de progression des envois */}
            <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#5E5A70]">Progression :</span>
                <span className="text-sm font-black text-[#6C4CF1]">
                  {sentClients.size} / {targetedClients.length} clients contactés
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendNextClient}
                  disabled={currentDispatchIndex >= targetedClients.length}
                  className="px-4 py-2 bg-[#136637] text-white text-xs font-extrabold rounded-xl hover:bg-[#0e4b28] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Envoyer au client suivant ({currentDispatchIndex + 1}/{targetedClients.length})
                </button>
              </div>
            </div>

            {/* Liste des destinataires */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
              {targetedClients.map((client, idx) => {
                const isSent = sentClients.has(client.cleanPhone);
                const personalizedMsg = formatPersonalizedMessage(message, client);

                return (
                  <div key={client.cleanPhone} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#16131F]">{client.name}</span>
                        <span className="text-xs font-semibold text-[#5E5A70]">({client.phone})</span>
                        <span className="text-[11px] text-[#8B869C]">· {client.city}</span>
                        {isSent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-[#E3F9ED] text-[#136637] px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Envoyé
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5E5A70] truncate mt-1 max-w-xl font-normal italic">
                        "{personalizedMsg}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyClientMessage(client)}
                        className="p-2 text-gray-500 hover:text-[#6C4CF1] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        title="Copier le message"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendSingleClient(client)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                          isSent 
                            ? 'bg-[#E3F9ED] text-[#136637] border border-[#136637]/30' 
                            : 'bg-[#25D366] text-white hover:bg-[#20ba5a] shadow-sm'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {isSent ? 'Renvoyer' : 'Envoyer sur WhatsApp'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer du modal */}
            <div className="p-6 bg-[#FAF9FE] border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#5E5A70]">
                {sentClients.size === targetedClients.length 
                  ? '🎉 Tous les messages ont été envoyés !' 
                  : `${targetedClients.length - sentClients.size} message(s) restant(s)`}
              </span>
              <button
                type="button"
                onClick={handleFinishCampaign}
                className="px-6 py-2.5 bg-[#6C4CF1] text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-[#5B3FD6] transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Valider et enregistrer la campagne
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
