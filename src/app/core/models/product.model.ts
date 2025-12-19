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
}