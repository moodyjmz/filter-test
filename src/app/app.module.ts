import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from "@angular/common/http";
import { FilterItemComponent } from './components/filter-item/filter-item.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductsComponent } from './components/products/products.component';
import { FilterGroupComponent } from './components/filter-group/filter-group.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PagerComponent } from './components/pager/pager.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    FilterItemComponent,
    FiltersComponent,
    ProductItemComponent,
    ProductsComponent,
    FilterGroupComponent,
    PagerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
