import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '@/app/core/services/order.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { environment } from '@/environments/environment';

// Define interfaces locally or import from order.service
interface OrderItem {
  product: {
    _id: string;
    name: string;
    cover: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface Order {
  _id: string;
  user?: any;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: ShippingAddress;
  createdAt: Date;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (orders: any) => {
        // Ensure orders is an array
        this.orders = Array.isArray(orders) ? orders : [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading orders:', error);
        this.notificationService.error('Failed to load orders');
      }
    });
  }

  cancelOrder(orderId: string): void {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        this.notificationService.success('Order cancelled successfully');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        this.notificationService.error(error.error?.message || 'Failed to cancel order');
      }
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

  getImageUrl(filename: string): string {
    if (!filename) {
      return 'https://via.placeholder.com/80x80/667eea/ffffff?text=No+Image';
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
      month: 'long',
      day: 'numeric'
    });
  }
}
