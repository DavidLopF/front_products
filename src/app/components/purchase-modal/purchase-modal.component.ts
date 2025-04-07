import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../services/cart.service';
import { PurchaseService } from '../../services/purchase.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-purchase-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          @if (showSuccessAlert) {
            <div class="flex items-center p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50" role="alert">
              <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <div class="ms-3 text-sm font-medium">
                ¡Compra realizada con éxito! El pedido será procesado pronto.
              </div>
            </div>
          }
          
          @if (showErrorAlert) {
            <div class="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50" role="alert">
              <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <div class="ms-3 text-sm font-medium">
                {{alertMessage}}
              </div>
              <button type="button" 
                (click)="showErrorAlert = false"
                class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8">
                <span class="sr-only">Cerrar</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </button>
            </div>
          }
          
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-gray-900">Finalizar compra</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Por favor, ingresa tu correo electrónico para completar la compra.
                  </p>
                  <div class="mt-4">
                    <input 
                      type="email" 
                      [(ngModel)]="email"
                      (ngModelChange)="validateEmail()"
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                      placeholder="correo@ejemplo.com"
                    >
                    @if (emailError) {
                      <p class="mt-2 text-sm text-red-600">{{emailError}}</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button 
              type="button" 
              [disabled]="!isValidEmail || isLoading"
              (click)="onConfirm()"
              class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:bg-blue-300 disabled:cursor-not-allowed">
              @if (isLoading) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              } @else {
                Confirmar compra
              }
            </button>
            <button 
              type="button"
              (click)="onCancel()"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PurchaseModalComponent {
  @Input() items: CartItem[] = [];
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  email: string = '';
  emailError: string | null = null;
  isValidEmail = false;
  isLoading = false;
  showErrorAlert = false;
  showSuccessAlert = false;
  alertMessage = '';

  constructor(
    private purchaseService: PurchaseService,
    private cartService: CartService
  ) {}

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isValidEmail = emailRegex.test(this.email);
    this.emailError = this.isValidEmail ? null : 'Por favor, ingresa un correo electrónico válido';
  }

  onConfirm() {
    if (!this.isValidEmail || this.isLoading) return;

    this.isLoading = true;
    this.showErrorAlert = false;
    this.showSuccessAlert = false;
    
    this.purchaseService.createPurchase(this.email, this.items)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessAlert = true;
          
          // Esperar 2 segundos y luego recargar la página
          setTimeout(() => {
            this.confirmed.emit();
            window.location.reload();
          }, 2000);
        },
        error: (error) => {
          console.error('Error al procesar la compra:', error);
          this.isLoading = false;
          
          if (error.error?.message?.includes('Stock insuficiente')) {
            const productId = parseInt(error.error.message.match(/ID (\d+)/)[1]);
            this.alertMessage = `Stock insuficiente para uno de los productos seleccionados. Se eliminará del carrito.`;
            this.showErrorAlert = true;
            
            // Eliminar el producto del carrito
            this.cartService.removeFromCart(productId);
          } else {
            this.emailError = 'Error al procesar la compra. Por favor, intenta de nuevo.';
          }
        }
      });
  }

  onCancel() {
    this.cancelled.emit();
  }
} 