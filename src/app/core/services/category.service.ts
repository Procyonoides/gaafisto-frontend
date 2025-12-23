import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface Category {
  id_kategori?: number;
  kategori: string;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(`${environment.apiUrl}/categories`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${environment.apiUrl}/categories/${id}`);
  }

  createCategory(data: { kategori: string }): Observable<Category> {
    return this.http.post<Category>(`${environment.apiUrl}/categories`, data);
  }

  updateCategory(id: number, data: { kategori: string }): Observable<Category> {
    return this.http.put<Category>(`${environment.apiUrl}/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/categories/${id}`);
  }
}