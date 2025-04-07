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
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    console.log('ProductListComponent initialized');
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;
    
    // Pequeño retraso antes de cargar los productos
    setTimeout(() => {
      this.productService.getProducts({ page: this.currentPage, size: this.pageSize })
        .subscribe({
          next: (response: PageResponse<Product>) => {
            console.log('Productos cargados:', response.data);
            // Filtrar productos con stock > 0
            this.products = response.data.content.filter(product => product.stock > 0);
            this.totalElements = response.data.totalElements;
            this.totalPages = response.data.totalPages;
            this.loading = false;
            
            // Inicializar cantidades seleccionadas
            this.products.forEach(product => {
              if (!this.selectedQuantities[product.id]) {
                this.selectedQuantities[product.id] = 0;
              }
            });
          },
          error: (error) => {
            console.error('Error al cargar productos:', error);
            this.error = 'Error al cargar los productos. Por favor, intente de nuevo.';
            this.loading = false;
          }
        });
    }, 500); // Medio segundo de retraso
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  updateQuantity(productId: number, newQuantity: number) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity < 0) {
      newQuantity = 0;
    } else if (newQuantity > product.stock) {
      newQuantity = product.stock;
    }

    this.selectedQuantities[productId] = newQuantity;
  }

  addToCart(product: Product) {
    const quantity = this.selectedQuantities[product.id];
    if (quantity > 0 && quantity <= product.stock) {
      this.cartService.addToCart(product, quantity);
      this.selectedQuantities[product.id] = 0; // Resetear cantidad después de añadir al carrito
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  }

  onProductDeleted() {
    this.showDeleteModal = false;
    this.loadProducts();
  }
} 