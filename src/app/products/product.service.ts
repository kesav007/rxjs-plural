import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { error } from 'console';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap(() => console.log("In Http Client")),
/*      catchError((error) => {
        console.log(error);
        return of(ProductData.products);
      })
*/
      catchError(error => this.handleError(error))
    );
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(this.productsUrl + "/" + productId).pipe(
      tap((resp) => console.log("Inside GetProduct By Id Http", resp)),
      catchError(error => this.handleError(error))
    )
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formmatedMessage = this.errorService.formatError(err);
    return throwError(() => formmatedMessage);
  }

}
