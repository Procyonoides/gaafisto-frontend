import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { OrderService } from '@/app/core/services/order.service';
import { User } from '@/app/core/models/user.model';

// Define order interface
interface Order {
  _id: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currentUser: User | null = null;
  stats = {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  };
  recentOrders: Order[] = [];
  loading = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (response: any) => {
        // Safely extract orders from response
        const orders: Order[] = Array.isArray(response) ? response : [];
        
        // Calculate statistics
        this.stats.totalOrders = orders.length;
        this.stats.pendingOrders = orders.filter(o => o.status === 'pending').length;
        this.stats.completedOrders = orders.filter(o => o.status === 'completed').length;
        this.stats.totalSpent = orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        // Get recent orders (last 5)
        this.recentOrders = orders.slice(0, 5);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
        // Set default values on error
        this.stats = {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalSpent: 0
        };
        this.recentOrders = [];
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

  formatPrice(price: number | undefined): string {
    if (price === undefined || price === null) return '0';
    return price.toLocaleString('id-ID');
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
