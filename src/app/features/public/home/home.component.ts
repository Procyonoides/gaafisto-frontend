import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '@/app/core/services/product.service';
import { CartService } from '@/app/core/services/cart.service';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { Product } from '@/app/core/models/product.model';
import { environment } from '@/environments/environment';

// Extended Product interface for home page with extra properties
interface ProductWithExtras extends Product {
  discount?: number;
  sold?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  flashSaleProducts: ProductWithExtras[] = [];
  loading = false;

  categories = [
    { name: 'Action Figures', icon: 'fa fa-robot fa-2x' },
    { name: 'Building Sets & Blocks', icon: 'fa fa-cubes fa-2x' },
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
    this.productService.getProducts({ page: 1, limit: 12 }).subscribe({
      next: (response) => {
        this.products = response.products || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.notificationService.error('Failed to load products');
      }
    });
  }

  loadFlashSale(): void {
    this.productService.getProducts({ page: 1, limit: 6 }).subscribe({
      next: (response) => {
        // Add discount and sold properties for flash sale display
        this.flashSaleProducts = (response.products || []).map(p => ({
          ...p,
          discount: Math.floor(Math.random() * 50) + 10, // Random 10-60%
          sold: Math.floor(Math.random() * 500) + 50     // Random 50-550
        }));
      },
      error: (error) => {
        console.error('Error loading flash sale:', error);
        this.flashSaleProducts = [];
      }
    });
  }

  addToCart(product: Product): void {
    // Prevent event bubbling to parent link
    event?.stopPropagation();
    event?.preventDefault();

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
    switch(sort) {
      case 'popular':
        this.products = [...this.products].sort((a, b) => 
          (b.averageRating || 0) - (a.averageRating || 0)
        );
        break;
      case 'latest':
        this.products = [...this.products].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'price-low':
        this.products = [...this.products].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.products = [...this.products].sort((a, b) => b.price - a.price);
        break;
    }
  }

  getImageUrl(filename: string): string {
    if (!filename) {
      return 'https://via.placeholder.com/200x200/667eea/ffffff?text=No+Image';
    }
    return `${environment.uploadUrl}/${filename}`;
  }

  formatPrice(price: number): string {
    return price?.toLocaleString('id-ID') || '0';
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating || 0)).fill(0);
  }

}
