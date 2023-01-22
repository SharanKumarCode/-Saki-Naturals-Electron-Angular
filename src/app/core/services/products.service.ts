import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProductData, IProductGroup } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productListSubject$: Subject<IProductData[]>;
  private productGroupListSubject$: Subject<IProductGroup[]>;
  private selectedProductID: string;

  constructor() {
    this.productListSubject$ = new Subject<IProductData[]>();
    this.productGroupListSubject$ = new Subject<IProductGroup[]>();
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

   updateSelectedProductID(productID: string){
    this.selectedProductID = productID;
   }

   getProductGroupList(): Subject<IProductGroup[]>{
    return this.productGroupListSubject$;
   }

   updateProductGroupList(a: IProductGroup[]){
    this.productGroupListSubject$.next(a);
  }
}
