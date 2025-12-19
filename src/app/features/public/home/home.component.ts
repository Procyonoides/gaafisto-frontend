import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '@/app/core/services/product.service';
import { CartService } from '@/app/core/services/cart.service';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { Product } from '@/app/core/models/product.model';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  flashSaleProducts: Product[] = [];
  loading = false;

  categories = [
    { name: 'Action Figures', icon: 'fa fa-robot fa-2x' },
    { name: 'Building Sets', icon: 'fa fa-cubes fa-2x' },
    { name: 'Model Kit', icon: 'fa fa-plane fa-2x' },
    { name: 'Video Games', icon: 'fa fa-gamepad fa-2x' },
    { name: 'Collectibles', icon: 'fa fa-gem fa-2x' },
    { name: 'Puzzles', icon: 'fa fa-puzzle-piece fa-2x' }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadFlashSale();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ page: 1, limit: 6 }).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadFlashSale(): void {
    this.productService.getProducts({ page: 1, limit: 6 }).subscribe({
      next: (response) => {
        this.flashSaleProducts = response.products.map(p => ({
          ...p,
          discount: Math.floor(Math.random() * 50) + 10,
          sold: Math.floor(Math.random() * 500) + 50
        }));
      },
      error: () => {}
    });
  }

  addToCart(product: Product): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.warning('Please login to add items to cart');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/' } });
      return;
    }

    if (product.stock === 0) {
      this.notificationService.error('Product is out of stock');
      return;
    }

    this.cartService.addToCart(product);
    this.notificationService.success('Product added to cart!');
  }

  filterByCategory(category: string): void {
    this.router.navigate(['/products'], { queryParams: { category } });
  }

  sortBy(sort: string): void {
    // Implement sorting logic
    console.log('Sort by:', sort);
  }

  getImageUrl(filename: string): string {
    return `${environment.uploadUrl}/${filename}`;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('id-ID');
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

}
