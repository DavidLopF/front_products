import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models';
import { PageResponse } from '../../models/page-response.model';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Modal backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 z-40" (click)="onCancel()"></div>

    <!-- Modal container -->
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
             (click)="$event.stopPropagation()">
          
          <!-- Modal header -->
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between pb-4 border-b">
              <h3 class="text-xl font-semibold text-gray-900">Eliminar Producto</h3>
              <button 
                type="button"
                (click)="onCancel()"
                [disabled]="isLoading"
                class="text-gray-400 hover:text-gray-500 focus:outline-none disabled:opacity-50">
                <span class="sr-only">Cerrar</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-4">
              <p class="text-sm text-gray-500 mb-4">
                Selecciona el producto que deseas eliminar. Esta acción no se puede deshacer.
              </p>

              @if (isLoading) {
                <div class="flex justify-center py-4">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              } @else {
                <select 
                  [(ngModel)]="selectedProductId"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value="">Selecciona un producto</option>
                  @for (product of products; track product.id) {
                    <option [value]="product.id">{{product.name}}</option>
                  }
                </select>

                @if (error) {
                  <p class="text-red-500 text-sm mt-2">{{error}}</p>
                }
              }
            </div>
          </div>

          <!-- Modal footer -->
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button 
              type="button"
              (click)="onDelete()"
              [disabled]="!selectedProductId || isLoading"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:bg-red-300 disabled:cursor-not-allowed">
              @if (isLoading) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Eliminando...
              } @else {
                Eliminar Producto
              }
            </button>
            <button 
              type="button"
              (click)="onCancel()"
              [disabled]="isLoading"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DeleteProductComponent implements OnInit {
  @Output() deleted = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  products: Product[] = [];
  selectedProductId: string = '';
  isLoading = false;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response: PageResponse<Product>) => {
        this.products = response.data.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar los productos';
        this.isLoading = false;
      }
    });
  }

  onDelete() {
    if (!this.selectedProductId) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.productService.deleteProduct(Number(this.selectedProductId)).subscribe({
      next: () => {
        this.isLoading = false;
        this.deleted.emit();
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
        this.error = 'Error al eliminar el producto';
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    if (!this.isLoading) {
      this.cancel.emit();
    }
  }
} 