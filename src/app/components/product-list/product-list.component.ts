import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less']
})

/**
 * List products
 */
export class ProductListComponent {
  /**
   * products to display
   */
  @Input() products;

  /**
   * Lookup product to reduce DOM updates
   * Utility function for ngFor
   * @param index Item index
   * @param item item object
   * @returns ID of item
   */
  productTrack (index, item): number {
    return item.id;
  }


}
