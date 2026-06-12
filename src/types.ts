/**
 * Types for Violet Market e-commerce application
 */

export interface ProductPrereq {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string; // e.g., 'Hardware' | 'Periféricos' | 'Áudio High-End' | 'Wearables' | 'Acessórios'
  imageUrl: string;
  galleryUrls?: string[];
  bannerText?: string; // e.g., 'Novo' | 'Esgotando' | 'Restam 2'
  specs?: {
    [key: string]: string;
  };
  features?: string[];
}

export interface CartItem {
  product: ProductPrereq;
  quantity: number;
}

export interface FilterState {
  categories: string[];
  priceMin: number;
  priceMax: number;
  minRating: number;
  sortBy: 'relevance' | 'lowestPrice' | 'highestPrice';
  searchQuery: string;
}

export interface PromoCoupon {
  code: string;
  discountPercentage: number;
  description: string;
}
