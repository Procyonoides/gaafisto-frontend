import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '@/app/core/services/order.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { environment } from '@/environments/environment';

// Define proper interfaces with user property
interface Product {
  _id: string;
  name: string;
  cover: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Order {
  _id: string;
  user: User; // Make it required, not optional
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  total = 0;
  selectedStatus = '';

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders(this.currentPage, 10, this.selectedStatus).subscribe({
      next: (response: any) => {
        // Safely extract data from response
        this.orders = Array.isArray(response.orders) ? response.orders : [];
        this.total = response.total || 0;
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading orders:', error);
        this.notificationService.error('Failed to load orders');
      }
    });
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Fix: Accept Event parameter and extract value safely
  updateOrderStatus(orderId: string, event: Event): void {
    // Cast EventTarget to HTMLSelectElement to access value
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement?.value;
    
    if (!newStatus) {
      this.notificationService.error('Invalid status selected');
      return;
    }

    if (!confirm(`Change order status to ${newStatus}?`)) {
      // Reset select value if user cancels
      this.loadOrders();
      return;
    }

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.notificationService.success('Order status updated');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order:', error);
        this.notificationService.error(error.error?.message || 'Failed to update status');
        this.loadOrders(); // Reload to reset UI
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
}
