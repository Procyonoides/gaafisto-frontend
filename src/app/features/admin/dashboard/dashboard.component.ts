import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats } from '@/app/core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID').format(price);
  }

  getProductLabel(order: any): string {
    if (!order.items || order.items.length === 0) return '-';
    const first = order.items[0].product?.name || '-';
    return order.items.length > 1 ? `${first} +${order.items.length - 1} lainnya` : first;
  }

}
