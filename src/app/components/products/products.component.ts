import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'
import { ProductFilterService } from '../../services/product-filter.service'
import { filterConfig } from '../../config/filter.config';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit {

    public allFilters = [];
    public filteredProducts = [];

    constructor(private productService: ProductService, private productFilterService: ProductFilterService) {
        this.buildFilter();
    }

    ngOnInit(): void {
        this.productService.page().subscribe((data: { items }) => {
            this.populateFilter(data.items);
        });
    }

    buildFilter() {
        this.productFilterService.setConfig(filterConfig);

    }

    populateFilter(items) {
        this.productFilterService.setData(items);
        this.productFilterService.getAllFilters().subscribe(value => this.allFilters = value);
        this.productFilterService.getFilteredProducts().subscribe(value => this.filteredProducts = value);
    }

}
