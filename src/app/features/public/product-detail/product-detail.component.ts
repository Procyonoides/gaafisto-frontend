import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '@/app/core/services/product.service';
import { CartService } from '@/app/core/services/cart.service';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { Product } from '@/app/core/models/product.model';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  product: Product | null = null;
  loading = false;
  userRating = 0;
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    this.route.params.subscribe(params => {
      const itemId = params['id'];
      this.loadProduct(itemId);
    });
  }

  loadProduct(itemId: string): void {
    this.loading = true;
    this.productService.getProductById(itemId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Product not found');
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.notificationService.success('Product added to cart!');
    }
  }

  rateProduct(rating: number): void {
    if (this.product) {
      this.userRating = rating;
      this.productService.rateProduct(this.product._id, rating).subscribe({
        next: (response) => {
          this.notificationService.success('Thank you for rating!');
          if (this.product) {
            this.product.averageRating = response.averageRating;
          }
        },
        error: () => {
          this.notificationService.error('Failed to submit rating');
        }
      });
    }
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
