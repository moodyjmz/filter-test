import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
export class FilterGroupComponent implements OnInit, OnChanges {
  @Input() filter;
  public displayProperties = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      switch (propName) {
        case 'filter':
          this.updateDisplayProperties();
          break;
      }
    }
  }


  updateDisplayProperties() {

    this.displayProperties = this.filter.properties;

  }

}
