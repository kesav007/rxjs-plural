import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { error } from 'console';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnInit, OnDestroy, OnChanges{
  // Just enough here for the template to compile
  @Input() productId: number = 0;
  errorMessage = '';
  productService = inject(ProductService);
  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  sub!: Subscription;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // const productId = changes['productId'].currentValue;
    this.sub = this.productService.getProductById(this.productId)
    .pipe(catchError(error => 
      {
        this.errorMessage = error;
        return EMPTY;
      }))
    .subscribe(response => this.product = response);
  }

  addToCart(product: Product) {
  }
}
