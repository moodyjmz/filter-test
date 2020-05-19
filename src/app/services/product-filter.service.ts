import { Injectable } from '@angular/core';
import { ProductFilter } from "../classes/product-filter";
import { BehaviorSubject, Subject } from 'rxjs';

type PropertyItemState = {
  active: boolean;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {
  public data = [];
  private _modTracker = true;
  private availableFilters = new Map();
  private filtersModifiedSubject = new Subject();
  private allFiltersSubject = new BehaviorSubject([]);
  private filteredProductsSubject = new BehaviorSubject([]);
  private activeFilterTracker = new Map();
  private filter: ProductFilter;

  setConfig(config) {
    this.filter = new ProductFilter(config);
  }

  setData(data) {
    this.data = data;
    this.filter.data = data;
    this.allFiltersSubject.next(this.filter.allFilters);
    this.updateUsedFilters();

  }

  getAllFilters() {
    return this.allFiltersSubject.asObservable();
  }

  getFilteredProducts() {
    return this.filteredProductsSubject.asObservable();
  }

  getFiltersModified() {
    return this.filtersModifiedSubject.asObservable();
  }

  public addFilter(filterConf) {
    const group = this.getUsedFilterGroup(filterConf.key);
    group.add(filterConf.property);
    this.updateUsedFilters();
  }

  public removeFilter(filterConf) {
    const group = this.getUsedFilterGroup(filterConf.key);
    group.delete(filterConf.property);
    if (group.size === 0) {
      this.activeFilterTracker.delete(filterConf.key);
    }
    this.updateUsedFilters();
  }

  public getPropertyItemState(key, property): PropertyItemState {
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

  private updateUsedFilters() {
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

  private isAttributePropertyActive(key, property) {
    const keyMap = this.activeFilterTracker.get(key);
    if (keyMap !== undefined) {
      return keyMap.has(property);
    }
    return false;
  }

  private isAttributePropertyAvailable(key, property) {
    if (this.activeFilterTracker.size) {
      const propSet = this.availableFilters.get(key);
      if (propSet !== undefined) {
        return propSet.has(property);
      }
    }
    return true;
  }

  private filterProductList(arr) {
    const source = arr.length ? this.filter.getFilteredData(arr) : this.data;
    if (this.activeFilterTracker.size) {
      this.availableFilters = this.filter.getAvailableFiltersFromItems(source);
    }
    this._modTracker = !this._modTracker;
    this.filtersModifiedSubject.next(this._modTracker);
    this.filteredProductsSubject.next(source.slice(0, 96));


  }


  private getUsedFilterGroup(key) {
    let group = this.activeFilterTracker.get(key);
    if (group === undefined) {
      this.activeFilterTracker.set(key, new Set());
      group = this.activeFilterTracker.get(key);
    }
    return group;
  }
}
