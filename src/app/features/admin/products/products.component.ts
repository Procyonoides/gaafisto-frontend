import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '@/app/core/services/product.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { Product } from '@/app/core/models/product.model';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  showModal = false;
  isEditMode = false;
  productForm: FormGroup;
  selectedFile: File | null = null;
  currentProductId: string = '';

  categories = ['Action Figures', 'Building Sets & Blocks', 'Model Kit', 'Video Games'];
  brands = ['LEGO', 'Hasbro', 'Bandai', 'Mattel', 'Nintendo', 'Sony', 'Microsoft'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {
    this.productForm = this.fb.group({
      itemId: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ limit: 100 }).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load products');
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.productForm.reset();
    this.selectedFile = null;
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.currentProductId = product._id;
    this.productForm.patchValue({
      itemId: product.itemId,
      name: product.name,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      price: product.price,
      description: product.description
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productForm.reset();
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.productForm.value).forEach(key => {
      formData.append(key, this.productForm.value[key]);
    });

    if (this.selectedFile) {
      formData.append('cover', this.selectedFile);
    }

    if (this.isEditMode) {
      this.productService.updateProduct(this.currentProductId, formData).subscribe({
        next: () => {
          this.notificationService.success('Product updated successfully');
          this.closeModal();
          this.loadProducts();
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Failed to update product');
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.notificationService.success('Product created successfully');
          this.closeModal();
          this.loadProducts();
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Failed to create product');
        }
      });
    }
  }

  deleteProduct(productId: string): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.notificationService.success('Product deleted successfully');
        this.loadProducts();
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to delete product');
      }
    });
  }

  getImageUrl(filename: string): string {
    return `${environment.uploadUrl}/${filename}`;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('id-ID');
  }

}
