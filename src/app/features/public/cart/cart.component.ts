import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '@/app/core/services/cart.service';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { CartItem } from '@/app/core/models/cart.model';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    if (confirm('Remove this item from cart?')) {
      this.cartService.removeFromCart(productId);
      this.notificationService.success('Item removed from cart');
    }
  }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTotal(): number {
    return this.getSubtotal() + 2000; // Tax
  }

  checkout(): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.warning('Please login to continue');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }
    this.router.navigate(['/user/checkout']);
  }

  getImageUrl(filename: string): string {
    return `${environment.uploadUrl}/${filename}`;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('id-ID');
  }

}
