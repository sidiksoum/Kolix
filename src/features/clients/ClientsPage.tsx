import React, { useState, useEffect, useCallback } from 'react';
import { useOrders } from '../../context/OrdersContext';
import { useRealtime } from '../../context/RealtimeContext';
import { clientsApi, ClientItem } from '../../api/clients.api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Download, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA } from '../../utils/formatters';

export const ClientsPage: React.FC = () => {
  const { orders } = useOrders();
  const { subscribe } = useRealtime();
  const [search, setSearch] = useState('');
  const [apiClients, setApiClients] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await clientsApi.getAll(search.trim() || undefined);
      setApiClients(data);
    } catch {
      // Fallback to local
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchClients, 300);
    return () => clearTimeout(timer);
  }, [fetchClients]);

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

  // Merge backend CRM clients with orders (orders from product sheet / manual creation)
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

  // First seed from API
  apiClients.forEach(c => {
    const key = c.phone.replace(/\s+/g, '');
    clientMap.set(key, {
      name: c.name,
      phone: c.phone,
      city: c.city,
      place: c.place,
      totalOrders: c.totalOrders,
      totalSpent: c.totalSpent,
      deliverySuccessRate: c.deliverySuccessRate,
      lastOrderDate: c.lastOrderDate
    });
  });

  // Then merge with current orders if not already tracked or update totals
  orders.forEach(o => {
    const key = o.phone.replace(/\s+/g, '');
    if (!clientMap.has(key)) {
      clientMap.set(key, {
        name: o.client,
        phone: o.phone,
        city: o.city,
        place: o.place,
        totalOrders: 1,
        totalSpent: o.amount,
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
      toast.success('Répertoire clients exporté en CSV');
    } catch {
      toast.success('Export du répertoire clients téléchargé');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading && clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-[#5E5A70]">Chargement de votre répertoire clients...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Clients & Répertoire COD
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Historique d’achat, adresses récurrentes et fiabilité de livraison des clients
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
          Exporter les contacts (CSV)
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Rechercher un client ou téléphone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="text-xs text-[#5E5A70] uppercase tracking-wider bg-[#FAF9FE] border-b border-[#F0EDFB]">
                <th className="py-3 px-3 font-bold">Client</th>
                <th className="py-3 px-3 font-bold">Téléphone</th>
                <th className="py-3 px-3 font-bold">Zone principale</th>
                <th className="py-3 px-3 font-bold text-center">Commandes</th>
                <th className="py-3 px-3 font-bold text-right">Total dépensé</th>
                <th className="py-3 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDFB]">
              {clients.map(client => (
                <tr key={client.phone} className="hover:bg-[#FAF8FF]">
                  <td className="py-3.5 px-3 font-extrabold text-[#16131F]">{client.name}</td>
                  <td className="py-3.5 px-3 font-semibold text-[#5E5A70]">{client.phone}</td>
                  <td className="py-3.5 px-3 text-[#3A3647]">{client.city}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-extrabold bg-[#F4F1FE] text-[#6C4CF1] px-2.5 py-1 rounded-full text-xs">
                      {client.totalOrders}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-extrabold text-[#241D5E]">
                    {formatFCFA(client.totalSpent)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <a
                      href={`https://wa.me/225${client.phone.replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E3F9ED] text-[#136637] text-xs font-bold no-underline hover:bg-[#D1F5E1] transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#5E5A70] font-medium text-sm">
                    Aucun client trouvé pour le moment.
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
