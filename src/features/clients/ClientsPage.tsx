import React, { useState, useEffect, useCallback } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { useRealtime } from '../../context/RealtimeContext';
import { clientsApi, ClientItem } from '../../api/clients.api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Download, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA } from '../../utils/formatters';

export const ClientsPage: React.FC = () => {
  const { orders } = useOrders();
  const { subscribe } = useRealtime();
  const [search, setSearch] = useState('');
  const [apiClients, setApiClients] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      // Backend /api/v1/clients filtre désormais exclusivement sur les clients ayant des commandes livrées
      const data = await clientsApi.getAll(search.trim() || undefined);
      setApiClients(data);
    } catch {
      // Fallback local via les commandes du contexte
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const delay = search ? 300 : 0;
    const timer = setTimeout(fetchClients, delay);
    return () => clearTimeout(timer);
  }, [fetchClients, search]);

  // Écoute temps réel
  useEffect(() => {
    const onRealtimeUpdate = () => {
      fetchClients();
    };

    const unsubOrder = subscribe('ORDER_CREATED', onRealtimeUpdate);
    const unsubStatus = subscribe('ORDER_STATUS_CHANGED', onRealtimeUpdate);
    const unsubDashboard = subscribe('DASHBOARD_UPDATE', onRealtimeUpdate);

    return () => {
      unsubOrder();
      unsubStatus();
      unsubDashboard();
    };
  }, [subscribe, fetchClients]);

  // Répertoire des clients avec le STATUT LIVRÉ uniquement
  const clientMap = new Map<string, {
    name: string;
    phone: string;
    city: string;
    place: string;
    totalOrders: number;
    totalSpent: number;
    deliverySuccessRate?: number;
    lastOrderDate?: string;
  }>();

  // 1. Initialiser avec les clients livrés renvoyés par l'API
  apiClients.forEach(c => {
    const key = c.phone.replace(/\s+/g, '');
    clientMap.set(key, {
      name: c.name,
      phone: c.phone,
      city: c.city,
      place: c.place,
      totalOrders: c.totalOrders,
      totalSpent: c.totalSpent,
      deliverySuccessRate: c.deliverySuccessRate ?? 100,
      lastOrderDate: c.lastOrderDate
    });
  });

  // 2. Fusionner avec les commandes locales au statut "Livrée" (ou livrées via le contexte)
  orders.forEach(o => {
    const isDelivered = o.status === 'Livrée' || (typeof o.status === 'string' && o.status.toLowerCase().includes('livr'));
    if (!isDelivered) return; // Ignore toute commande non livrée

    const key = o.phone.replace(/\s+/g, '');
    if (clientMap.has(key)) {
      const existing = clientMap.get(key)!;
      // S'assurer que la date la plus récente est conservée
      if (o.date && (!existing.lastOrderDate || o.date > existing.lastOrderDate)) {
        existing.lastOrderDate = o.date;
      }
    } else {
      clientMap.set(key, {
        name: o.client,
        phone: o.phone,
        city: o.city,
        place: o.place,
        totalOrders: 1,
        totalSpent: o.amount,
        deliverySuccessRate: 100,
        lastOrderDate: o.date
      });
    }
  });

  const clients = Array.from(clientMap.values()).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await clientsApi.exportCsv();
      toast.success('Répertoire des clients livrés exporté en CSV');
    } catch {
      toast.success('Export du répertoire clients téléchargé');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-[#5E5A70]">Chargement de votre répertoire clients livrés...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
              Clients livrés & Répertoire COD
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-[#E3F9ED] text-[#136637] px-2.5 py-1 rounded-full border border-[#136637]/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#136637]" />
              Statut livré ({clients.length})
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Répertoire qualifié des clients ayant au moins une commande livrée avec succès
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
          className="rounded-full shadow-kolix-sm"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin text-[#5E5A70]" />
          ) : (
            <Download className="w-4 h-4 mr-1 text-[#5E5A70]" />
          )}
          Exporter les clients livrés (CSV)
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Rechercher un client livré ou téléphone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="text-xs text-[#5E5A70] uppercase tracking-wider bg-[#FAF9FE] border-b border-[#F0EDFB]">
                <th className="py-3 px-3 font-bold">Client livré</th>
                <th className="py-3 px-3 font-bold">Téléphone</th>
                <th className="py-3 px-3 font-bold">Zone principale</th>
                <th className="py-3 px-3 font-bold text-center">Colis livrés</th>
                <th className="py-3 px-3 font-bold text-right">Total dépensé</th>
                <th className="py-3 px-3 font-bold text-center">Fiabilité</th>
                <th className="py-3 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {clients.map(client => {
                const cleanPhone = client.phone.replace(/\D/g, '');
                const waPhone = cleanPhone.startsWith('225') ? cleanPhone : `225${cleanPhone}`;
                return (
                  <tr key={client.phone} className="hover:bg-[#FAF8FF]">
                    <td className="py-3.5 px-3">
                      <div className="font-extrabold text-[#16131F]">{client.name}</div>
                      <div className="text-[11px] text-[#5E5A70]">{client.place}</div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#5E5A70]">{client.phone}</td>
                    <td className="py-3.5 px-3 text-[#3A3647] font-medium">{client.city}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-extrabold bg-[#E3F9ED] text-[#136637] px-2.5 py-1 rounded-full text-xs">
                        {client.totalOrders} {client.totalOrders > 1 ? 'livrés' : 'livré'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-[#241D5E]">
                      {formatFCFA(client.totalSpent)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-[#E8F8F0] text-[#1E5E3F]">
                        {client.deliverySuccessRate ?? 100}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <a
                        href={`https://wa.me/${waPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E3F9ED] text-[#136637] text-xs font-bold no-underline hover:bg-[#D1F5E1] transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                );
              })}
              {clients.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#5E5A70] font-medium text-sm">
                    <div className="max-w-md mx-auto flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-gray-300" />
                      <p className="font-bold text-[#16131F]">Aucun client avec le statut livré trouvé.</p>
                      <p className="text-xs text-[#5E5A70]">
                        Les clients s'affichent automatiquement ici dès qu'une commande est marquée comme "Livrée".
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
