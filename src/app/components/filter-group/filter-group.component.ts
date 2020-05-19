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
 * Uses either used | available mode - determines how items are shown
 */
export class FilterGroupComponent{
  @Input() filter;
}
