import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less']
})

/**
 * Wraps the filters and their properties
 */
export class FiltersComponent {
  @Input() filters;
}
