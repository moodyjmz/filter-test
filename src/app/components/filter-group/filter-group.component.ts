import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.less']
})

/**
 * Filter group
 *
 * Displays list of filter-items
 */
export class FilterGroupComponent{
  @Input() filter;
}
