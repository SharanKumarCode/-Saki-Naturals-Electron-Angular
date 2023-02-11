import { Injectable } from '@angular/core';
import { ProductsService } from './products.service';
import { ProductsdbService } from './productsdb.service';
import { IProductData } from '../../interfaces/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataResolverService {

  constructor(
    private productService: ProductsService,
    private productDBService: ProductsdbService
  ) {   }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Subject<IProductData>{
    this.productService.updateSelectedProductID(route.paramMap.get('selectedProductID'));
    this.productDBService.getProductByID(this.productService.getSelectedProductID());
    return this.productService.getSelectedProductData();
  }
}
