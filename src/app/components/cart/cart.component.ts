import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, PurchaseModalComponent],
  templateUrl: './cart.component.html',
  styles: []
})
export class CartComponent implements OnInit, OnDestroy {
  @Output() purchaseCompleted = new EventEmitter<void>();
  
  items: CartItem[] = [];
  total: string = '0';
  showPurchaseModal = false;
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

  checkout(): void {
    if (this.items.length === 0) {
      console.log('No hay productos en el carrito');
      return;
    }
    
    this.showPurchaseModal = true;
  }

  onPurchaseConfirmed(): void {
    this.showPurchaseModal = false;
    this.clearCart();
    this.purchaseCompleted.emit();
  }

  onPurchaseCancelled(): void {
    this.showPurchaseModal = false;
  }
} 