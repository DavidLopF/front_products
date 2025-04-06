import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
      <div class="flex flex-wrap justify-between items-center">
        <div class="flex items-center">
          <button (click)="toggleSidebar()" class="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
            <span class="sr-only">Abrir menú</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <a routerLink="/" class="flex items-center ml-4">
            <span class="self-center text-xl font-semibold whitespace-nowrap">Mi Tienda</span>
          </a>
        </div>
      </div>

      <!-- Sidebar -->
      <div [class.translate-x-0]="isSidebarOpen" [class.translate-x-full]="!isSidebarOpen" 
           class="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-64 border-l border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h5 class="text-base font-semibold text-gray-500">Menú</h5>
          <button (click)="toggleSidebar()" class="p-2 rounded-lg hover:bg-gray-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="py-4 overflow-y-auto">
          <ul class="space-y-2 font-medium">
            <li>
              <a routerLink="/" (click)="toggleSidebar()" 
                 class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span class="ml-3">Inicio</span>
              </a>
            </li>
            <li>
              <button (click)="onCreateProduct()" 
                     class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 4v16m8-8H4"></path>
                </svg>
                <span class="ml-3">Crear Producto</span>
              </button>
            </li>
            <li>
              <button (click)="onUpdateProduct()" 
                     class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                <span class="ml-3">Actualizar Producto</span>
              </button>
            </li>
            <li>
              <button (click)="onDeleteProduct()" 
                     class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span class="ml-3">Eliminar Producto</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Overlay -->
      <div *ngIf="isSidebarOpen" (click)="toggleSidebar()" 
           class="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 transition-opacity"></div>
    </nav>

    <!-- Espaciador para el contenido debajo del navbar fijo -->
    <div class="h-16"></div>
  `
})
export class NavbarComponent {
  @Output() createProduct = new EventEmitter<void>();
  @Output() updateProduct = new EventEmitter<void>();
  @Output() deleteProduct = new EventEmitter<void>();
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onCreateProduct(): void {
    this.createProduct.emit();
    this.toggleSidebar();
  }

  onUpdateProduct(): void {
    this.updateProduct.emit();
    this.toggleSidebar();
  }

  onDeleteProduct(): void {
    this.deleteProduct.emit();
    this.toggleSidebar();
  }
} 