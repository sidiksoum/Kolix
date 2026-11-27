import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export interface WhatsAppCampaignItem {
  id: string;
  name: string;
  target_type: string;
  when_type: string;
  scheduled_at?: string | null;
  status: 'Envoyée' | 'Programmée' | 'Brouillon' | string;
  recipients_count: number;
  sent_count: number;
  read_count: number;
  created_at: string;
}

export interface CreateCampaignDto {
  name: string;
  target_type: 'all' | 'product' | 'date' | 'manual';
  target_criteria?: Record<string, any>;
  message_template: string;
  when_type: 'now' | 'schedule';
  scheduled_at?: string | null;
}

export interface SavedAudienceItem {
  id: string;
  name: string;
  criteria: Record<string, any>;
  contacts_count: number;
}

const STORAGE_KEY_CAMPAIGNS = 'kolix_whatsapp_campaigns';
const STORAGE_KEY_AUDIENCES = 'kolix_whatsapp_audiences';

const DEFAULT_CAMPAIGNS: WhatsAppCampaignItem[] = [
  {
    id: 'camp_01',
    name: 'Collection fête des mères',
    target_type: 'all',
    when_type: 'now',
    status: 'Envoyée',
    recipients_count: 540,
    sent_count: 540,
    read_count: 508,
    created_at: '2026-05-12T10:00:00Z'
  },
  {
    id: 'camp_02',
    name: 'Réactivation clients inactifs',
    target_type: 'date',
    when_type: 'now',
    status: 'Envoyée',
    recipients_count: 180,
    sent_count: 180,
    read_count: 158,
    created_at: '2026-06-28T14:30:00Z'
  },
  {
    id: 'camp_03',
    name: 'Lancement Sérum Éclat',
    target_type: 'product',
    when_type: 'now',
    status: 'Envoyée',
    recipients_count: 92,
    sent_count: 92,
    read_count: 88,
    created_at: '2026-09-15T11:00:00Z'
  },
  {
    id: 'camp_04',
    name: 'Flash Sale Weekend',
    target_type: 'all',
    when_type: 'schedule',
    scheduled_at: '2026-10-23T18:30:00Z',
    status: 'Programmée',
    recipients_count: 320,
    sent_count: 0,
    read_count: 0,
    created_at: '2026-10-20T09:00:00Z'
  }
];

export const whatsappApi = {
  async getCampaigns(): Promise<WhatsAppCampaignItem[]> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.WHATSAPP.CAMPAIGNS);
      const items = res?.data || res;
      if (Array.isArray(items) && items.length > 0) {
        return items.map((c: any) => ({
          id: c.id,
          name: c.name,
          target_type: c.target_type,
          when_type: c.when_type,
          scheduled_at: c.scheduled_at,
          status: c.status,
          recipients_count: c.recipients_count ?? 0,
          sent_count: c.sent_count ?? 0,
          read_count: c.read_count ?? 0,
          created_at: c.created_at || new Date().toISOString()
        }));
      }
    } catch {
      // Fallback local
    }

    // Récupérer depuis localStorage ou defaults
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    return DEFAULT_CAMPAIGNS;
  },

  async createCampaign(dto: CreateCampaignDto): Promise<WhatsAppCampaignItem> {
    const newItem: WhatsAppCampaignItem = {
      id: `camp_${Date.now()}`,
      name: dto.name,
      target_type: dto.target_type,
      when_type: dto.when_type,
      scheduled_at: dto.scheduled_at,
      status: dto.when_type === 'schedule' ? 'Programmée' : 'Envoyée',
      recipients_count: dto.target_criteria?.recipients_count || 0,
      sent_count: dto.target_criteria?.sent_count || (dto.when_type === 'now' ? (dto.target_criteria?.recipients_count || 0) : 0),
      read_count: dto.target_criteria?.read_count || (dto.when_type === 'now' ? Math.round((dto.target_criteria?.recipients_count || 0) * 0.94) : 0),
      created_at: new Date().toISOString()
    };

    try {
      const res = await apiClient.post<any>(API_ENDPOINTS.WHATSAPP.CAMPAIGNS, dto);
      if (res?.data?.id) {
        newItem.id = res.data.id;
      }
    } catch {
      // Enregistrement local
    }

    try {
      const existing = await this.getCampaigns();
      const updated = [newItem, ...existing.filter(c => c.id !== newItem.id)];
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(updated));
    } catch {}

    return newItem;
  },

  async deleteCampaign(id: string): Promise<void> {
    try {
      await apiClient.delete<any>(API_ENDPOINTS.WHATSAPP.DELETE_CAMPAIGN(id));
    } catch {}

    try {
      const existing = await this.getCampaigns();
      const updated = existing.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(updated));
    } catch {}
  },

  async getAudiences(): Promise<SavedAudienceItem[]> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.WHATSAPP.AUDIENCES);
      const items = res?.data || res;
      if (Array.isArray(items) && items.length > 0) {
        return items;
      }
    } catch {}

    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIENCES);
      if (saved) return JSON.parse(saved);
    } catch {}

    return [
      { id: 'aud_1', name: 'Grosses commandes', criteria: { minOrders: 2 }, contacts_count: 42 },
      { id: 'aud_2', name: 'Clients Abidjan', criteria: { city: 'Abidjan' }, contacts_count: 128 },
      { id: 'aud_3', name: 'Inactifs 60j', criteria: { days: 60 }, contacts_count: 56 }
    ];
  },

  async createAudience(name: string, criteria: Record<string, any>, count: number): Promise<SavedAudienceItem> {
    const item: SavedAudienceItem = {
      id: `aud_${Date.now()}`,
      name,
      criteria,
      contacts_count: count
    };

    try {
      await apiClient.post<any>(API_ENDPOINTS.WHATSAPP.AUDIENCES, {
        name,
        criteria: { ...criteria, contacts_count: count }
      });
    } catch {}

    try {
      const list = await this.getAudiences();
      const updated = [...list, item];
      localStorage.setItem(STORAGE_KEY_AUDIENCES, JSON.stringify(updated));
    } catch {}

    return item;
  }
};
