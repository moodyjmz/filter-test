import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less']
})
export class ProductListComponent implements OnInit {
  @Input() products;

  constructor() {
  }

  ngOnInit(): void {

  }

  productTrack(index, item) {
    return item.id;
  }


}
