import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styles: []
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  total: string = '0';
  private subscription: Subscription = new Subscription();

  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.subscription.add(
      this.cartService.cartItems$.subscribe((items: CartItem[]) => {
        this.items = items;
        this.total = this.cartService.getTotal();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
} 