import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models';
import { PageResponse } from '../../models/page-response.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteProductComponent, CartComponent],
  templateUrl: './product-list.component.html',
  styles: []
})
export class ProductListComponent implements OnInit {
  protected readonly Math = Math;
  products: Product[] = [];
  isBrowser: boolean;
  selectedQuantities: { [key: number]: number } = {};
  showDeleteModal = false;

  // Paginación
  currentPage = 0;
  pageSize = 5;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    console.log('ProductListComponent initialized');
    if (this.isBrowser) {
      this.loadProducts();
    }
  }

  loadProducts() {
    console.log('Loading products...');
    this.productService.getProducts({ page: this.currentPage, size: this.pageSize }).subscribe({
      next: (response: PageResponse<Product>) => {
        console.log('Products received:', response);
        this.products = response.data.content;
        this.totalElements = response.data.totalElements;
        this.totalPages = response.data.totalPages;
        // Inicializar las cantidades seleccionadas en 0
        this.products.forEach(product => {
          this.selectedQuantities[product.id] = 0;
        });
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.products = [];
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  updateQuantity(productId: number, quantity: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      // Asegurar que la cantidad esté entre 0 y el stock disponible
      quantity = Math.max(0, Math.min(quantity, product.stock));
      this.selectedQuantities[productId] = quantity;
    }
  }

  addToCart(product: Product): void {
    const quantity = this.selectedQuantities[product.id];
    if (quantity > 0) {
      this.cartService.addToCart(product, quantity);
      // Resetear la cantidad seleccionada
      this.selectedQuantities[product.id] = 0;
    }
  }

  formatPrice(price: number): string {
    return this.cartService.formatNumber(price);
  }

  onProductDeleted() {
    this.showDeleteModal = false;
    this.loadProducts();
  }
} 