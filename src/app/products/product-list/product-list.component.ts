import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent implements OnInit, OnDestroy {
  // Just enough here for the template to compile
  pageTitle = 'Products';
  errorMessage = '';
  private productService = inject(ProductService);

  // Products
  products: Product[] = [];
  productSub!: Subscription;
  // Selected product id to highlight the entry
  selectedProductId: number = 0;
  ngOnInit(): void {
    this.productSub = this.productService.getProducts()
    .pipe(
      tap(() => console.log("In component Pipeline")),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    )
    .subscribe({
      next: resp => this.products = resp
      //error: error => this.errorMessage = error
    });
  }
  ngOnDestroy(): void {
    this.productSub.unsubscribe();
  }

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }
}
