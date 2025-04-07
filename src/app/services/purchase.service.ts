import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';

export interface PurchaseItem {
  productId: number;
  quantity: number;
}

export interface PurchaseRequest {
  purchaseItems: PurchaseItem[];
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private readonly apiUrl = 'http://localhost:8082/api/purchase';
  private readonly apiKey = '8148033f3cbd041dc2c065fe64ce695b0d2a59661afbf38409031e79bb7452ff';

  constructor(private http: HttpClient) {}

  createPurchase(email: string, items: CartItem[]): Observable<any> {
    const headers = new HttpHeaders().set('X-API-KEY', this.apiKey);
    
    const purchaseItems: PurchaseItem[] = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    const request: PurchaseRequest = {
      purchaseItems,
      email
    };

    return this.http.post(this.apiUrl, request, { headers });
  }
} 