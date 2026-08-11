import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

export interface RecentOrder {
  _id: string;
  user: { firstName: string; lastName: string };
  items: { product: { name: string }; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: RecentOrder[];
  visitorStats: {
    todayVisitors: number;
    todayHits: number;
    totalVisitors: number;
    totalHits: number;
    onlineVisitors: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/dashboard`);
  }
}