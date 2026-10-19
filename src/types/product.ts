export type ProductStatus = 'Actif' | 'Brouillon' | 'Épuisé' | 'Archivé';

export interface Product {
  id: string;
  name: string;
  status: ProductStatus;
  stockMain: string;
  stockRest: string;
  stockQuantity: number;
  price: number;
  priceOld?: number;
  sales30d: number;
  category: string;
  type: string;
  iconName?: string;
  hasCountdown?: boolean;
  images?: string[];
  description?: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  priceOld?: number;
  stockQuantity: number;
  category: string;
  type: string;
  hasCountdown?: boolean;
}
