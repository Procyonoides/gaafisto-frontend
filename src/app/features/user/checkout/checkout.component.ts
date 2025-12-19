import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@/app/core/services/cart.service';
import { OrderService } from '@/app/core/services/order.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { CartItem } from '@/app/core/models/cart.model';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  get f() { return this.checkoutForm.controls; }

  getSubtotal(): number {
    return this.cartService.getCartTotal();
  }

  getTotal(): number {
    return this.getSubtotal() + 2000;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.checkoutForm.invalid) {
      return;
    }

    this.loading = true;

    const orderData = {
      items: this.cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingAddress: this.checkoutForm.value
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        this.notificationService.success('Order placed successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/user/orders']);
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.error(error.error?.message || 'Failed to place order');
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
