import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
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
  selectedQuantities: { [key: number]: number } = {};
  showDeleteModal = false;
  currentPage = 0;
  pageSize = 5;
  totalElements = 0;
  totalPages = 0;
  loading = false;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    console.log('ProductListComponent initialized');
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    const params: any = {
      page: this.currentPage,
      size: this.pageSize
    };

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.productService.getProducts(params).subscribe({
      next: (response) => {
        if (response?.data) {
          this.products = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
          this.products.forEach(product => {
            if (!this.selectedQuantities[product.id]) {
              this.selectedQuantities[product.id] = 0;
            }
          });
        } else {
          this.error = 'Respuesta inválida del servidor';
          this.products = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar los productos. Por favor, intente de nuevo.';
        this.products = [];
        this.loading = false;
      }
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  updateQuantity(productId: number, newQuantity: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.selectedQuantities[productId] = Math.max(0, Math.min(newQuantity, product.stock));
    }
  }

  addToCart(product: Product): void {
    const quantity = this.selectedQuantities[product.id];
    if (quantity > 0 && quantity <= product.stock) {
      this.cartService.addToCart(product, quantity);
      this.selectedQuantities[product.id] = 0;
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }

  onProductDeleted() {
    this.showDeleteModal = false;
    this.loadProducts();
  }
} 