import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { IProductData } from '../../products/interfaces/productdata.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productDataSubject$: Subject<IProductData[]>;

  constructor() {
    this.productDataSubject$ = new Subject<IProductData[]>();
   }

  getProductList(): Subject<IProductData[]>{
    return this.productDataSubject$;
  }

  updateProductList(a: IProductData[]){
    this.productDataSubject$.next(a);
  }
}
