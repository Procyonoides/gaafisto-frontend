import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '@/app/core/services/product.service';
import { CartService } from '@/app/core/services/cart.service';
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
  loading = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
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

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.notificationService.success('Product added to cart!');
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
