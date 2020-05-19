import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less']
})
export class FiltersComponent implements OnInit {
  @Input() filters;

  constructor() {
  }

  ngOnInit(): void {
  }
}
