export interface Product {
  _id: string;
  itemId: string;
  name: string;
  category: string;
  brand: string;
  cover: string;
  stock: number;
  price: number;
  description: string;
  averageRating: number;
  createdAt: Date;
  
  // Optional properties for display purposes
  discount?: number;  // For flash sale/promo display
  sold?: number;      // Number of items sold
  isNew?: boolean;    // New arrival flag
  isFeatured?: boolean; // Featured product flag
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  sortBy?: 'price' | 'rating' | 'newest' | 'popular';
  order?: 'asc' | 'desc';
}