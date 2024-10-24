import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { error } from 'console';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);
  private productBehaviourSubject = new BehaviorSubject<number | undefined>(undefined);
  public readonly productSelected$ = this.productBehaviourSubject.asObservable();

  public readonly products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap(products => console.log(JSON.stringify(products))),
    shareReplay(1),
    tap(() => console.log("After Share Replay")),
    catchError(error => this.handleError(error))
    /*  catchError((error) => {
      console.log(error);
      return of(ProductData.products);
    })*/
  );

  public readonly product$ = this.productSelected$.pipe(
    filter(Boolean),
    switchMap(productId => {
      return this.http.get<Product>(this.productsUrl + "/" + productId)
      .pipe(
        tap((resp) => console.log("Inside GetProduct By Id Http", resp)),
        switchMap(product => this.getProductReviews(product)),
        catchError(error => this.handleError(error))
      )
    })
  )

/*
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(this.productsUrl + "/" + productId)
    .pipe(
      tap((resp) => console.log("Inside GetProduct By Id Http", resp)),
      switchMap(product => this.getProductReviews(product)),
      catchError(error => this.handleError(error))
    )
  }
*/

  productSelected(selectedProductId: number): void {
    this.productBehaviourSubject.next(selectedProductId);
  }

  getProductReviews(product: Product): Observable<Product> {
    if(product.hasReviews) {
    return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
    .pipe(
      map(reviews => ({...product, reviews} as Product))
    )}
    else {
      return of(product);
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formmatedMessage = this.errorService.formatError(err);
    return throwError(() => formmatedMessage);
  }

}
