import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@/app/core/services/product.service';
import { CartService } from '@/app/core/services/cart.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { Product } from '@/app/core/models/product.model';
import { environment } from '@/environments/environment';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  total = 0;
  
  searchQuery = '';
  selectedCategory = '';
  selectedBrand = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.selectedBrand = params['brand'] || '';
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    const params = {
      page: this.currentPage,
      limit: 9,
      category: this.selectedCategory,
      brand: this.selectedBrand,
      search: this.searchQuery
    };

    this.productService.getProducts(params).subscribe({
      next: (response) => {
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
