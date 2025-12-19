import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(private http: HttpClient) { }

  getPersonalizedRecommendations(limit: number = 6): Observable<any> {
    return this.http.get(`${environment.apiUrl}/recommendations/for-you?limit=${limit}`);
  }

  getSimilarProducts(productId: string, limit: number = 6): Observable<any> {
    return this.http.get(`${environment.apiUrl}/recommendations/similar/${productId}?limit=${limit}`);
  }
}