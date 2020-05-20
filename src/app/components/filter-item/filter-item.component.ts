import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductFilterService } from '../../services/product-filter.service'
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.less']
})

/**
 * Presents an individual filter property
 *
 * Connects to {@link ProductFilterService} for updating
 */
export class FilterItemComponent implements OnInit, OnDestroy {
  /**
   * Filter property
   */
  @Input() property;

  /**
   * Filter attribute name
   */
  @Input() attr;

  /**
   * Flag for presentation attribute - is clickable
   */
  public available = true;

  /**
   * Flag for presentation attribute - is active
   *
   * Determines how element click is handled
   */
  public active = false;

  private stateSubscriber: Subscription;

  constructor (private productFilterService: ProductFilterService) {
  }

  @HostListener('click') onClick () {
    this.onItemClick();
  }

  ngOnInit (): void {
    this.stateSubscriber = this.productFilterService.getFiltersModified().subscribe(this.updateState.bind(this));
  }

  /**
   * Handle a click on this property
   *
   * Calls the Product Filter Service to add or remove property from filter
   * @returns {void}
   */
  public onItemClick (): void {
    if (!this.active && !this.available) {
      return;
    }
    const payload = { key: this.attr, property: this.property };
    const call = this.active ? 'removeFilter' : 'addFilter';
    this.productFilterService[call](payload);
  }

  /**
   * Update the active and available states of this property
   * @returns {void}
   */
  private updateState (): void {
    const state = this.productFilterService.getPropertyItemState(this.attr, this.property);
    this.active = state.active;
    this.available = state.available;
  }

  ngOnDestroy(): void {
    this.stateSubscriber.unsubscribe();
  }
}
