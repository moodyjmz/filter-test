import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

type ThresholdEvent = {
  start: number;
  end: number;
}

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.less']
})
export class PagerComponent implements OnInit, OnChanges {
  @Input() totalItems: number;
  @Input() pageSize: number = 96;
  @Input() currentPage: number = 1;
  @Input() pagesRange: number = 5;
  @Output() threshold = new EventEmitter<ThresholdEvent>(true);
  public totalPages: number;
  public startPage: number;
  public endPage: number;
  public startIndex: number;
  public endIndex: number;
  public pages: number[];

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'totalItems': {
            this.updatePager();
            break;
          }
        }
      }
    }
  }

  public setPage(page: number): void {
    this.currentPage = page;
    this.updatePager();
  }

  generatePages() {
    return Array.from({length: ((this.endPage + 1) - this.startPage)}, (v, k) => k + this.startPage);
  }

  private updatePager(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    if (this.totalPages <= this.pagesRange) {
      this.startPage = 1;
      this.endPage = this.totalPages;
    } else {
      if (this.currentPage <= Math.ceil(this.pagesRange / 2)) {
        this.startPage = 1;
        this.endPage = this.pagesRange;
      } else if (this.currentPage + 1 >= this.totalPages) {
        this.startPage = this.totalPages - (this.pagesRange - 1);
        this.endPage = this.totalPages;
      } else {
        const rangeDisplay = Math.floor(this.pagesRange / 2);
        this.startPage = this.currentPage - rangeDisplay;
        this.endPage = this.currentPage + rangeDisplay;
      }
    }

    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize - 1, this.totalItems - 1);
    this.threshold.emit({start: this.startIndex, end: this.endIndex});
    this.pages = this.generatePages();
  }
}
