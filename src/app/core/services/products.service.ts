import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProductData } from '../../products/interfaces/productdata.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productListSubject$: Subject<IProductData[]>;
  private selectedProductID: string;

  constructor() {
    this.productListSubject$ = new Subject<IProductData[]>();
   }

  getProductList(): Subject<IProductData[]>{
    return this.productListSubject$;
  }

  updateProductList(a: IProductData[]){
    this.productListSubject$.next(a);
  }

  getSelectedProductID(): string{
    return this.selectedProductID;
   }

   updateSelectedProductID(salesID: string){
    this.selectedProductID = salesID;
   }
}
