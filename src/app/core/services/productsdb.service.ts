import { Injectable } from '@angular/core';
import { ElectronService } from './electron/electron.service';
import { ipcRenderer } from 'electron';
import { ProductsService } from './products.service';
import { IProductData } from '../../products/interfaces/productdata.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsdbService {

  ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private productService: ProductsService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getProducts(): void{
    console.log('info: getting all products');
    const productsList: IProductData[]  = [];
    this.ipcRenderer.invoke('get-products').then(data=>{
      console.log('info: received all products');
      data.forEach(element => {
        const productData: IProductData = {
          productId: element.product_id,
          productName: element.product_name,
          group: element.group,
          description: element.description,
          stock: element.stock,
          priceDirectSale: element.price_directSale,
          priceReseller: element.price_reseller,
          priceDealer: element.price_dealer,
          sold: element.sold,
          createdDate: element.created_date
        };
        productsList.push(productData);
      });
      this.productService.updateProductList(productsList);
    })
    .catch(err=>{
      console.log(err);
    });
  }

  insertProduct(product: IProductData): void{
    console.log('info: adding new product');
    this.ipcRenderer.invoke('insert-product', product)
    .then(data=>{
      console.log('info: added new product');
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
    });
  }

  updateProduct(product: IProductData): void{
    console.log('info: updating product');
    this.ipcRenderer.invoke('update-product', product)
    .then(data=>{
      console.log('info: updated product');
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
    });
  }

  deleteProduct(productID: string): void {
    console.log('info: deleting product');
    this.ipcRenderer.invoke('delete-product', productID)
    .then(data=>{
      console.log('info: deleted product');
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
    });
  }
}
