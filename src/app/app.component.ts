import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { DeleteProductComponent } from './components/delete-product/delete-product.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent, 
    ProductListComponent, 
    CreateProductComponent,
    DeleteProductComponent,
    UpdateProductComponent
  ],
  template: `
    <app-navbar 
      (createProduct)="showCreateProductModal = true"
      (updateProduct)="showUpdateProductModal = true"
      (deleteProduct)="showDeleteProductModal = true">
    </app-navbar>
    
    <main class="container mx-auto px-4 py-8">
      <app-product-list></app-product-list>
    </main>

    <app-create-product 
      *ngIf="showCreateProductModal"
      (close)="showCreateProductModal = false"
      (productCreated)="onProductCreated()">
    </app-create-product>

    <app-update-product 
      *ngIf="showUpdateProductModal"
      (close)="showUpdateProductModal = false"
      (productUpdated)="onProductUpdated()">
    </app-update-product>

    <app-delete-product 
      *ngIf="showDeleteProductModal"
      (close)="showDeleteProductModal = false"
      (productDeleted)="onProductDeleted()">
    </app-delete-product>
  `
})
export class AppComponent {
  showCreateProductModal = false;
  showUpdateProductModal = false;
  showDeleteProductModal = false;

  onProductCreated(): void {
    this.showCreateProductModal = false;
    window.location.reload();
  }

  onProductUpdated(): void {
    this.showUpdateProductModal = false;
    window.location.reload();
  }

  onProductDeleted(): void {
    this.showDeleteProductModal = false;
    window.location.reload();
  }
}
