import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { PageResponse } from '../../models/page-response.model';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">Actualizar Producto</h3>
          
          <!-- Loading spinner -->
          <div *ngIf="loading" class="flex justify-center items-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>

          <!-- Error message -->
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {{ errorMessage }}
          </div>

          <!-- Product selection -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Seleccionar Producto
            </label>
            <select 
              [(ngModel)]="selectedProductId"
              (change)="onProductSelect()"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option [ngValue]="null">Seleccione un producto</option>
              <option *ngFor="let product of products" [ngValue]="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>

          <!-- Update form -->
          <form *ngIf="selectedProduct" (ngSubmit)="onSubmit()" #updateForm="ngForm">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Nombre
              </label>
              <input 
                type="text"
                [(ngModel)]="selectedProduct.name"
                name="name"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Descripción
              </label>
              <textarea 
                [(ngModel)]="selectedProduct.description"
                name="description"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              </textarea>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Precio
              </label>
              <input 
                type="number"
                [(ngModel)]="selectedProduct.price"
                name="price"
                required
                min="0"
                step="0.01"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Stock
              </label>
              <input 
                type="number"
                [(ngModel)]="selectedProduct.stock"
                name="stock"
                required
                min="0"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                Nueva Imagen (opcional)
              </label>
              <input 
                type="file"
                (change)="onFileSelected($event)"
                accept="image/*"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="flex items-center justify-between mt-6">
              <button 
                type="button"
                (click)="close.emit()"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Cancelar
              </button>
              <button 
                type="submit"
                [disabled]="!updateForm.form.valid || loading"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class UpdateProductComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() productUpdated = new EventEmitter<void>();

  products: Product[] = [];
  selectedProductId: number | null = null;
  selectedProduct: Product | null = null;
  selectedFile: File | undefined;
  loading = false;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (response: PageResponse<Product>) => {
        this.products = response.data.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.errorMessage = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  onProductSelect(): void {
    if (this.selectedProductId) {
      const product = this.products.find(p => p.id === this.selectedProductId);
      if (product) {
        this.selectedProduct = { ...product };
      }
    } else {
      this.selectedProduct = null;
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (!this.selectedProduct || !this.selectedProductId) {
      this.errorMessage = 'Por favor seleccione un producto';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.productService.updateProduct(this.selectedProductId, this.selectedProduct, this.selectedFile).subscribe({
      next: () => {
        this.loading = false;
        this.productUpdated.emit();
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el producto';
        this.loading = false;
        console.error('Error updating product:', error);
      }
    });
  }
} 