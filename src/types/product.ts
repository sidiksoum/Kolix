export type ProductStatus = 'Actif' | 'Brouillon' | 'Épuisé' | 'Archivé';

export interface FicheProduitOffer {
  qty: number;
  label: string;
  price: number;
  best?: boolean;
}

export interface FicheProduitBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface FicheProduitSpec {
  label: string;
  value: string;
}

export interface FicheProduitFAQ {
  question: string;
  answer: string;
}

export interface FicheProduitData {
  headline?: string;
  leadSubtitle?: string;
  offers?: FicheProduitOffer[];
  stockUrgency?: number;
  countdownEnabled?: boolean;
  benefits?: FicheProduitBenefit[];
  specs?: FicheProduitSpec[];
  inTheBox?: string;
  faqs?: FicheProduitFAQ[];
}

export interface Product {
  id: string;
  slug?: string;
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
  fiche_produit?: FicheProduitData;
}

export interface CreateProductDto {
  name: string;
  price: number;
  priceOld?: number;
  stockQuantity: number;
  stockMain?: string;
  stockRest?: string;
  category: string;
  type?: string;
  hasCountdown?: boolean;
  description?: string;
  images?: string[];
  fiche_produit?: FicheProduitData;
}
