import { Injectable } from '@angular/core';
import { FilterGroup, Product, ProductFilter } from '../classes/product-filter';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

type PropertyItemState = {
  active: boolean;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})

/**
 * Extrapolates filters from product data
 *
 * Provides API to maintain and apply filters to products
 */
export class ProductFilterService {

  /**
   * Internal reference to product data
   */
  public _data = [];

  /**
   * Boolean toogle for firing modification event
   */
  private _modTracker = true;

  /**
   * Map of available filters
   */
  private availableFilters = new Map();

  /**
   * Emits when filters are modified
   */
  private filtersModifiedSubject = new Subject();

  /**
   * Emits when filters are changed
   */
  private allFiltersSubject = new BehaviorSubject([]);

  /**
   * Emits when products are filtered
   */
  private filteredProductsSubject = new BehaviorSubject([]);

  /**
   * Internal track of filters
   */
  private activeFilterTracker = new Map();

  /**
   * Reference to filter engine
   */
  private filter: ProductFilter;

  /**
   * Provide config for ProductFilter
   * @param config FilterConfig to set
   */
  setConfig (config: []):void {
    this.filter = new ProductFilter(config);
  }

  /**
   * Set the data
   * @param data Product Data to set
   */
  setData (data: Product[]): void {
    // This could be a setter
    this._data = data;
    this.filter.data = data;
    this.allFiltersSubject.next(this.filter.allFilters);
    this.updateUsedFilters();

  }

  /**
   * Provides observable list of filters
   * @returns Observable filters
   */
  getAllFilters (): Observable<FilterGroup[]> {
    return this.allFiltersSubject.asObservable();
  }

  /**
   * Provides filtered products
   * @returns Observable products
   */
  getFilteredProducts (): Observable<Product[]> {
    return this.filteredProductsSubject.asObservable();
  }

  /**
   * Provides filtered trigger
   * @returns Observable modified filter trigger
   */
  getFiltersModified (): Observable<unknown> {
    return this.filtersModifiedSubject.asObservable();
  }

  /**
   * API to add filter
   * @param filterConf
   */
  public addFilter (filterConf): void {
    const group = this.getUsedFilterGroup(filterConf.key);
    group.add(filterConf.property);
    this.updateUsedFilters();
  }

  /**
   * API to remove filter
   * @param filterConf
   */
  public removeFilter (filterConf): void {
    const group = this.getUsedFilterGroup(filterConf.key);
    group.delete(filterConf.property);
    if (group.size === 0) {
      this.activeFilterTracker.delete(filterConf.key);
    }
    this.updateUsedFilters();
  }

  /**
   * API to get property item state
   * @param key filter key
   * @param key filter property
   * @returns active and available states of property
   */
  public getPropertyItemState (key, property): PropertyItemState {
    const active = this.isAttributePropertyActive(key, property);
    let available = true;
    if (!active) {
      available = this.isAttributePropertyAvailable(key, property);
    }
    return {
      active: active,
      available: available
    };
  }

  /**
   * Update the used filters
   * @returns Array of filter
   */
  private updateUsedFilters (): FilterGroup[] {
    const arr = [];
    this.activeFilterTracker.forEach((properties, key) => {
      arr.push({
        key: key,
        properties: [...properties]
      });
    });
    this.filterProductList(arr);
    return arr;
  }

  /**
   * Get property active state
   * @param key Filter key
   * @param property Property value
   * @return Active state
   */
  private isAttributePropertyActive (key, property): boolean {
    // Could be shared with Attr checker
    if (this.activeFilterTracker.size) {
      const keyMap = this.activeFilterTracker.get(key);
      if (keyMap !== undefined) {
        return keyMap.has(property);
      }
    }
    return false;
  }

  /**
   * Get property available state
   * @param key Filter key
   * @param property Property value
   * @return Available state
   */
  private isAttributePropertyAvailable (key, property) {
    if (this.activeFilterTracker.size) {
      const propSet = this.availableFilters.get(key);
      if (propSet !== undefined) {
        return propSet.has(property);
      }
    }
    return true;
  }

  /**
   * Filter the product list and update observables
   * @param arr Product list to use for updates
   * @return {void}
   */
  private filterProductList (arr): void {
    const source = arr.length ? this.filter.getFilteredData(arr) : this._data;
    if (this.activeFilterTracker.size) {
      this.availableFilters = this.filter.getAvailableFiltersFromItems(source);
    }
    this._modTracker = !this._modTracker;
    this.filtersModifiedSubject.next(this._modTracker);
    this.filteredProductsSubject.next(source);


  }

  /**
   * Get the filter group for a key
   * @param key filter attribute key
   * @return Filter group for key
   */
  private getUsedFilterGroup (key): Set<FilterGroup> {
    let group = this.activeFilterTracker.get(key);
    if (group === undefined) {
      this.activeFilterTracker.set(key, new Set());
      group = this.activeFilterTracker.get(key);
    }
    return group;
  }
}
