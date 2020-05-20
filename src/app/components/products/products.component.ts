import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'
import { ProductFilterService } from '../../services/product-filter.service'
import { filterConfig } from '../../config/filter.config';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.less']
})

/**
 * Presents products and filters
 *
 * Bridges between {@link ProductFilterService} and {@link ProductService}
 */
export class ProductsComponent implements OnInit {

  /**
   * All filters in full data
   */
  public allFilters = [];

  /**
   * Full list of filtered products
   */
  public filteredProducts = [];

  /**
   * Current slice derived from pager and filtered products
   */
  public pageSlice = [];

  constructor(private productService: ProductService, private productFilterService: ProductFilterService) {
  }

  ngOnInit(): void {
    this.buildFilter();
    this.productService.fetch().subscribe((data: { items }) => {
      this.populateFilter(data.items);
    });
    this.productFilterService.getAllFilters().subscribe(value => this.allFilters = value);
    this.productFilterService.getFilteredProducts().subscribe(value => this.filteredProducts = value);
  }

  /**
   * Build the filter from the filter config
   */
  private buildFilter(): void {
    this.productFilterService.setConfig(filterConfig);

  }

  /**
   * Slice filtered data when the pager changes
   * @param threshold
   */
  public sliceData(threshold): void {
    this.pageSlice = this.filteredProducts.slice(threshold.start, threshold.end);
  }

  /**
   * Populate the filter with the data from the product service
   * @param items Items from product service
   */
  private populateFilter(items): void {
    this.productFilterService.setData(items);
  }

}
