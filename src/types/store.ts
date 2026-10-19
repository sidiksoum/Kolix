export type TemplateStyle = 'Épuré' | 'Moderne' | 'Audacieux' | 'Luxe';

export type TemplateNiche =
  | 'Mode féminine'
  | 'Beauté, cosmétiques et soins capillaires'
  | 'Électronique et gadgets'
  | 'Maison et électroménager'
  | 'Compléments alimentaires et bien-être'
  | 'Mode masculine'
  | 'Bijoux et accessoires'
  | 'Enfants et puériculture'
  | 'Articles religieux et spirituels'
  | 'Produits locaux et artisanat'
  | 'Standard & Généraliste';

export interface StoreTemplate {
  id: string;
  name: string;
  niche: TemplateNiche;
  style: TemplateStyle;
  price: number; // 0 for free, 9000 for 15 USD
  priceLabel: string;
  isFree: boolean;
  isActive?: boolean;
  isOwned?: boolean;
  accentColor: string;
  heroText?: string;
  subText?: string;
}

export interface MerchantStore {
  id: string;
  name: string;
  domain: string;
  templateId: string;
  templateName: string;
  productsCount: number;
  ordersCount7d: number;
  status: 'En ligne' | 'En maintenance';
  isActive: boolean;
  initials: string;
  accentColor: string;
}

export interface StoreSectionConfig {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface StoreCustomization {
  storeId: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  sections: StoreSectionConfig[];
}
