import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { error } from 'console';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent{
  // Just enough here for the template to compile
  @Input() productId: number = 0;
  errorMessage = '';
  productService = inject(ProductService);
  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  readonly product$ = this.productService.product$
    .pipe(catchError(error => {
      this.errorMessage = error;
      return EMPTY;
    }));
  addToCart(product: Product) {
  }
}
