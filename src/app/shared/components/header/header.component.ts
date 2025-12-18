import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { CartService } from '@/app/core/services/cart.service';
import { User } from '@/app/core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  currentUser: User | null = null;
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  getUserDashboardLink(): string {
    if (this.currentUser?.role === 'admin') {
      return '/admin/dashboard';
    }
    return '/user/dashboard';
  }

  logout(event: Event): void {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
