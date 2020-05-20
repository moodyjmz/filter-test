import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.less']
})

/**
 * Display a product
 */
export class ProductItemComponent {
  /**
   * Product item object
   */
  @Input() product;
}
