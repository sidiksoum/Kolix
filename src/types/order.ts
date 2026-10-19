export type OrderStatus = 
  | 'En cours'
  | 'Livrée'
  | 'Reportée'
  | 'Annulée'
  | 'Contestée'
  | 'Injoignable';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  date: string;
  client: string;
  phone: string;
  city: string;
  place: string;
  product: string;
  amount: number;
  status: OrderStatus;
  note: string;
  paid: string | null;
  items?: OrderItem[];
  paymentMode?: 'COD_CASH' | 'COD_MOMO' | 'CARD' | null;
  qrPayload?: string;
}

export interface OrderFilterParams {
  status?: OrderStatus | 'all';
  search?: string;
  dateRange?: string;
  product?: string;
  sortBy?: 'recent' | 'amount' | 'client';
}

export interface CreateOrderDto {
  client: string;
  phone: string;
  city: string;
  place: string;
  product: string;
  amount: number;
  note?: string;
}
