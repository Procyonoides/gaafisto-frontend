import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '@/app/core/services/notification.service';
import { ShippingService, Shipping } from '@/app/core/services/shipping.service';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.scss'
})
export class ShippingComponent implements OnInit {
  shippings: Shipping[] = [];
  shippingForm: FormGroup;
  editForm: FormGroup;
  loading = false;
  showEditModal = false;

  constructor(
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private notificationService: NotificationService
  ) {
    this.shippingForm = this.fb.group({
      wilayah: ['', Validators.required],
      biaya: ['', [Validators.required, Validators.min(0)]],
      kurir: ['']
    });

    this.editForm = this.fb.group({
      _id: [''],
      wilayah: ['', Validators.required],
      biaya: ['', [Validators.required, Validators.min(0)]],
      kurir: ['']
    });
  }

  ngOnInit(): void {
    this.loadShippings();
  }

  loadShippings(): void {
    this.loading = true;
    this.shippingService.getShippings().subscribe({
      next: (response) => {
        this.shippings = response.shippings || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load shipping regions');
      }
    });
  }

  onSubmit(): void {
    if (this.shippingForm.invalid) {
      return;
    }

    this.shippingService.createShipping(this.shippingForm.value).subscribe({
      next: () => {
        this.notificationService.success('Shipping region added successfully');
        this.shippingForm.reset();
        this.loadShippings();
      },
      error: () => {
        this.notificationService.error('Failed to add shipping region');
      }
    });
  }

  openEditModal(shipping: Shipping): void {
    this.editForm.patchValue(shipping);
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm.reset();
  }

  onEditSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }

    const id = this.editForm.value._id;
    const { wilayah, biaya, kurir } = this.editForm.value;

    this.shippingService.updateShipping(id, { wilayah, biaya, kurir }).subscribe({
      next: () => {
        this.notificationService.success('Shipping region updated successfully');
        this.closeEditModal();
        this.loadShippings();
      },
      error: () => {
        this.notificationService.error('Failed to update shipping region');
      }
    });
  }

  deleteShipping(id: string): void {
    if (!confirm('Are you sure you want to delete this shipping region?')) {
      return;
    }

    this.shippingService.deleteShipping(id).subscribe({
      next: () => {
        this.notificationService.success('Shipping region deleted successfully');
        this.loadShippings();
      },
      error: () => {
        this.notificationService.error('Failed to delete shipping region');
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID').format(price);
  }

}
