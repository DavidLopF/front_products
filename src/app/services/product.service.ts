import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Product } from '../models';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../environments/environment';

export interface PageRequest {
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  private headers = new HttpHeaders({
    'X-API-KEY': environment.apiKey
  });

  constructor(private http: HttpClient) {}

  getProducts(pageRequest?: PageRequest): Observable<PageResponse<Product>> {
    let params = new HttpParams();
    if (pageRequest) {
      params = params.set('page', pageRequest.page.toString())
                    .set('size', pageRequest.size.toString())
                    .set('sort', 'id,desc');
    }

    console.log('Requesting products with params:', {
      page: params.get('page'),
      size: params.get('size'),
      sort: params.get('sort')
    });

    return this.http.get<PageResponse<Product>>(`${this.apiUrl}/products`, { 
      headers: this.headers,
      params 
    });
  }

  createProduct(product: Partial<Product>, image?: File): Observable<Product> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<Product>(`${this.apiUrl}/products`, formData, { 
      headers: this.headers 
    });
  }

  updateProduct(id: number, product: Partial<Product>, image?: File): Observable<Product> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, formData, { 
      headers: this.headers 
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`, { 
      headers: this.headers 
    });
  }
} 