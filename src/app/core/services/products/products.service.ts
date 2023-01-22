import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProductData, IProductGroup } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productListSubject$: Subject<IProductData[]>;
  private productGroupListSubject$: Subject<IProductGroup[]>;
  private selectedProductID: string;
  private selectedProductDataSubject$: Subject<IProductData>;

  constructor() {
    this.productListSubject$ = new Subject<IProductData[]>();
    this.productGroupListSubject$ = new Subject<IProductGroup[]>();
    this.selectedProductDataSubject$ = new Subject<IProductData>();
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

   getSelectedProductData(): Subject<IProductData>{
    return this.selectedProductDataSubject$;
   }

   updateSelectedProductData(data: IProductData): void {
      this.selectedProductDataSubject$.next(data);
   }
}
