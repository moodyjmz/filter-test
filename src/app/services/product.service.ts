import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type pageConfig = {
  filterKey?: string,
  current?: number
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  constructor(private http: HttpClient) {
  }

  // config with page number and filter data
  public page(config?: pageConfig | undefined) {
    return this.fetch();
  }

  /**
   * Fetch the product json
   */
  private fetch() {
    return this.http.get(`${environment.productServiceUrl}`);
  }

}
