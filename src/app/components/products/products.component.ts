import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'
import { ProductFilterService } from '../../services/product-filter.service'
import { filterConfig } from '../../config/filter.config';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit {

  public allFilters = [];
  public filteredProducts = [];
  public pageSlice = [];

  constructor(private productService: ProductService, private productFilterService: ProductFilterService) {
  }

  ngOnInit(): void {
    this.buildFilter();
    this.productService.page().subscribe((data: { items }) => {
      this.populateFilter(data.items);
    });
    this.productFilterService.getAllFilters().subscribe(value => this.allFilters = value);
    this.productFilterService.getFilteredProducts().subscribe(value => this.filteredProducts = value);
  }

  buildFilter() {
    this.productFilterService.setConfig(filterConfig);

  }

  sliceData(threshold) {
    console.log('sliceData');
    this.pageSlice = this.filteredProducts.slice(threshold.start, threshold.end);
  }

  private populateFilter(items): void {
    this.productFilterService.setData(items);
  }

}
