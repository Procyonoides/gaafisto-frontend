import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private readonly CART_KEY = 'cart_items';

  constructor(private storageService: StorageService) {
    this.loadCart();
  }

  private loadCart(): void {
    const cartData = this.storageService.getItem(this.CART_KEY);
    if (cartData) {
      try {
        const items = JSON.parse(cartData);
        this.cartItemsSubject.next(items);
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
  }

  private saveCart(): void {
    const items = this.cartItemsSubject.value;
    this.storageService.setItem(this.CART_KEY, JSON.stringify(items));
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCart();
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.product._id !== productId);
    this.cartItemsSubject.next(updatedItems);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.product._id === productId);
    
    if (item) {
      item.quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.storageService.removeItem(this.CART_KEY);
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }
}