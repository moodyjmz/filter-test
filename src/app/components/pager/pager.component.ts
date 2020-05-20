import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

type ThresholdEvent = {
  start: number;
  end: number;
};

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.less']
})

/**
 * Simple google style paginator
 */
export class PagerComponent implements OnChanges {
  @Input() totalItems: number;
  @Input() pageSize = 96;
  @Input() currentPage = 1;
  @Input() pagesRange = 5;

  /**
   * Emitter for start and end indexes for data slicing
   */
  @Output() threshold = new EventEmitter<ThresholdEvent>(true);
  public totalPages: number;
  public startPage: number;
  public endPage: number;

  /**
   * Start index for slicing data
   */
  public startIndex: number;

  /**
   * End index for slicing data
   */
  public endIndex: number;
  public pages: number[];

  ngOnChanges (changes: SimpleChanges) {
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

  /**
   * Set the page number
   * @param page page to set
   */
  public setPage (page: number): void {
    this.currentPage = page;
    this.updatePager();
  }

  /**
   * Generate an array of numbers
   * corresponding to available pages
   * @returns array of numbers
   */
  generatePages (): number[] {
    return Array.from({ length: ((this.endPage + 1) - this.startPage) }, (v, k) => k + this.startPage);
  }

  /**
   * Update the pager to pass to the presentation
   */
  private updatePager (): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    if (this.totalPages <= this.pagesRange) {
      this.startPage = 1;
      this.endPage = this.totalPages;
    }
    else {
      if (this.currentPage <= Math.ceil(this.pagesRange / 2)) {
        this.startPage = 1;
        this.endPage = this.pagesRange;
      }
      else if (this.currentPage + 1 >= this.totalPages) {
        this.startPage = this.totalPages - (this.pagesRange - 1);
        this.endPage = this.totalPages;
      }
      else {
        const rangeDisplay = Math.floor(this.pagesRange / 2);
        this.startPage = this.currentPage - rangeDisplay;
        this.endPage = this.currentPage + rangeDisplay;
      }
    }

    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize - 1, this.totalItems - 1);
    this.threshold.emit({ start: this.startIndex, end: this.endIndex });
    this.pages = this.generatePages();
  }
}
