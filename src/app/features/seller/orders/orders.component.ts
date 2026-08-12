import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, SellerOrder } from '@/app/core/services/order.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class SellerOrdersComponent implements OnInit {

  orders: SellerOrder[] = [];
  loading = false;

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.orderService.getSellerOrders().subscribe({
      next: (response) => {
        this.orders = response.orders || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load orders');
      }
    });
  }

  getImageUrl(filename: string): string {
    if (!filename) {
      return 'https://via.placeholder.com/40x40/667eea/ffffff?text=No+Image';
    }
    return `${environment.uploadUrl}/${filename}`;
  }

  formatPrice(price: number): string {
    return price?.toLocaleString('id-ID') || '0';
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'badge-warning',
      'processing': 'badge-info',
      'completed': 'badge-success',
      'cancelled': 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  }

}
