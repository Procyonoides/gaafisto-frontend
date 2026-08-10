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
}