import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface Shipping {
  _id?: string;
  wilayah: string;
  biaya: number;
  kurir?: string;
}

export interface ShippingsResponse {
  shippings: Shipping[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor(private http: HttpClient) { }

  getShippings(): Observable<ShippingsResponse> {
    return this.http.get<ShippingsResponse>(`${environment.apiUrl}/shipping`);
  }

  createShipping(data: { wilayah: string; biaya: number; kurir?: string }): Observable<Shipping> {
    return this.http.post<Shipping>(`${environment.apiUrl}/shipping`, data);
  }

  updateShipping(id: string, data: { wilayah: string; biaya: number; kurir?: string }): Observable<Shipping> {
    return this.http.put<Shipping>(`${environment.apiUrl}/shipping/${id}`, data);
  }

  deleteShipping(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/shipping/${id}`);
  }
}