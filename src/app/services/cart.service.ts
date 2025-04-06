import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  private isBrowser: boolean;
  private readonly CART_KEY = 'shopping_cart';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    console.log('CartService initialized, isBrowser:', this.isBrowser);
    if (this.isBrowser) {
      this.loadCart();
    }
  }

  private loadCart(): void {
    if (!this.isBrowser) {
      console.log('No se carga el carrito en SSR');
      return;
    }

    try {
      console.log('Intentando cargar carrito desde localStorage');
      const savedCart = localStorage.getItem(this.CART_KEY);
      console.log('Carrito guardado:', savedCart);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Carrito parseado:', parsedCart);
        this.cartItems.next(parsedCart);
      } else {
        console.log('No hay carrito guardado');
        this.cartItems.next([]);
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      this.cartItems.next([]);
    }
  }

  private saveCart(items: CartItem[]): void {
    if (!this.isBrowser) {
      console.log('No se guarda el carrito en SSR');
      return;
    }

    try {
      console.log('Guardando carrito:', items);
      localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }

  addToCart(product: Product, quantity: number): void {
    console.log('Añadiendo al carrito:', { product, quantity });
    const currentItems = [...this.cartItems.value];
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    console.log('Nuevo estado del carrito:', currentItems);
    this.cartItems.next(currentItems);
    this.saveCart(currentItems);
  }

  removeFromCart(productId: number): void {
    console.log('Removiendo del carrito:', productId);
    const currentItems = this.cartItems.value.filter(item => item.product.id !== productId);
    this.cartItems.next(currentItems);
    this.saveCart(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 0) {
      console.log('Cantidad no válida:', quantity);
      return;
    }

    console.log('Actualizando cantidad:', { productId, quantity });
    const currentItems = [...this.cartItems.value];
    const item = currentItems.find(item => item.product.id === productId);
    
    if (item) {
      item.quantity = quantity;
      if (quantity === 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItems.next(currentItems);
        this.saveCart(currentItems);
      }
    }
  }

  getItems(): CartItem[] {
    return this.cartItems.value;
  }

  clearCart(): void {
    console.log('Limpiando carrito');
    this.cartItems.next([]);
    this.saveCart([]);
  }

  getTotal(): string {
    try {
      const total = this.cartItems.value.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);
      return this.formatNumber(total);
    } catch (error) {
      console.error('Error al calcular el total:', error);
      return '0';
    }
  }

  formatNumber(value: number): string {
    try {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(value);
    } catch (error) {
      console.error('Error al formatear número:', error);
      return value.toString();
    }
  }
} 