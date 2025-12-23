import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '@/app/core/services/notification.service';
import { environment } from '@/environments/environment';

interface Category {
  id_kategori: number;
  kategori: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];
  categoryForm: FormGroup;
  editForm: FormGroup;
  loading = false;
  showEditModal = false;
  selectedCategory: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.categoryForm = this.fb.group({
      nmKategori: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id_kategori: [''],
      nm_kategori: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/categories`).subscribe({
      next: (response) => {
        this.categories = response.categories || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load categories');
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.http.post(`${environment.apiUrl}/categories`, this.categoryForm.value).subscribe({
      next: () => {
        this.notificationService.success('Category added successfully');
        this.categoryForm.reset();
        this.loadCategories();
      },
      error: () => {
        this.notificationService.error('Failed to add category');
      }
    });
  }

  openEditModal(category: Category): void {
    this.selectedCategory = category;
    this.editForm.patchValue({
      id_kategori: category.id_kategori,
      nm_kategori: category.kategori
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCategory = null;
    this.editForm.reset();
  }

  onEditSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }

    const id = this.editForm.value.id_kategori;
    const data = { kategori: this.editForm.value.nm_kategori };

    this.http.put(`${environment.apiUrl}/categories/${id}`, data).subscribe({
      next: () => {
        this.notificationService.success('Category updated successfully');
        this.closeEditModal();
        this.loadCategories();
      },
      error: () => {
        this.notificationService.error('Failed to update category');
      }
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    this.http.delete(`${environment.apiUrl}/categories/${id}`).subscribe({
      next: () => {
        this.notificationService.success('Category deleted successfully');
        this.loadCategories();
      },
      error: () => {
        this.notificationService.error('Failed to delete category');
      }
    });
  }
}
