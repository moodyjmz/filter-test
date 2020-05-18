import { Component, OnInit, Input, Output, HostListener } from '@angular/core';
import { ProductFilterService } from '../../services/product-filter.service'

@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  styleUrls: ['./filter-item.component.less']
})
export class FilterItemComponent implements OnInit {
  @Input() property;
  @Input() attr;
  public available = true;
  public active = false;

  @HostListener("click") onClick(){
    this.onItemClick();
  }

  constructor(private productFilterService: ProductFilterService) { }

  ngOnInit(): void {
    this.productFilterService.getFiltersModified().subscribe(this.updateState.bind(this));
  }

  updateState() {
    const state = this.productFilterService.getPropertyItemState(this.attr, this.property);
    this.active = state.active;
    this.available = state.available;
  }

  onItemClick() {
    const payload = {key: this.attr, property: this.property};
    const call = this.active ? 'removeFilter' : 'addFilter';
    this.productFilterService[call](payload);
  }
}
