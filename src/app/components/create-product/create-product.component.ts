import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-product.component.html'
})
export class CreateProductComponent {
  @Output() productCreated = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: ''
  };

  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  isLoading = false;
  formSubmitted = false;

  constructor(
    private productService: ProductService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  onSubmit(form: NgForm) {
    this.formSubmitted = true;
    
    if (form.valid && this.selectedFile) {
      this.isLoading = true;
      this.productService.createProduct(this.product, this.selectedFile).subscribe({
        next: (createdProduct) => {
          this.productCreated.emit(createdProduct);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
          this.isLoading = false;
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  onCancel() {
    if (!this.isLoading) {
      this.cancel.emit();
    }
  }
}
