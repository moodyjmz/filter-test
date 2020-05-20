import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

/**
 * Retrieves product data
 */
export class ProductService {
  constructor(private http: HttpClient) {
  }

  /**
   * Fetch the product json
   */
  public fetch() {
    return this.http.get(`${environment.productServiceUrl}`);
  }

}
