export type StockStatus = 'Optimal' | 'Faible' | 'Critique' | 'Rupture';

export interface InventoryItem {
  id: string;
  num: string;
  name: string;
  q: number; // Quantité initiale
  qv: number; // Quantité vendue
  qr: number; // Quantité restante
  seuil: number; // Seuil d'alerte
  status: StockStatus;
  pu: number; // Prix unitaire
  total: number; // Coût total
}

export interface StockAlert {
  id: string;
  name: string;
  qr: number;
  seuil: number;
  status: 'Faible' | 'Critique' | 'Rupture';
}

export interface StockKpis {
  totalValue: number;
  underThresholdCount: number;
  pendingRestockCount: number;
  turnoverRate: string;
  outOfStockCount: number;
}
