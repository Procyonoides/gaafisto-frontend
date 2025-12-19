import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Product, ProductsResponse, ProductQueryParams } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(params: ProductQueryParams = {}): Observable<ProductsResponse> {
    let httpParams = new HttpParams();
    
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.brand) httpParams = httpParams.set('brand', params.brand);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<ProductsResponse>(`${environment.apiUrl}/products`, { params: httpParams });
  }

  getProductById(itemId: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${itemId}`);
  }

  rateProduct(productId: string, rating: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/products/${productId}/rate`, { rating });
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, formData);
  }

  updateProduct(productId: string, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/products/${productId}`, formData);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/products/${productId}`);
  }
}