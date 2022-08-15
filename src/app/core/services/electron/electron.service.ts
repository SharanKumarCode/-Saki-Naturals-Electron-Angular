import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { IProductData } from '../../../products/interfaces/productdata.interface';
import { ProductsService } from '../products.service';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor(
    private productService: ProductsService
  ) {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.fs = window.require('fs');

      this.childProcess = window.require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout:\n${stdout}`);
      });

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  getProducts(): void{
    console.log('Angular getting products');
    const productsList: IProductData[]  = [];
    const res = this.ipcRenderer.invoke('get-products');
    this.ipcRenderer.on('get-products-recv',(_, data)=>{
      console.log('Angular on receiving ipcRenderer after getting products');
      const jsonData = JSON.parse(data);
      jsonData.forEach(element => {
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
    });
  }

  insertProduct(product: IProductData): void{
    console.log('Angular inserting product..');
    this.ipcRenderer.invoke('insert-product', product);
    this.ipcRenderer.on('insert-product-recv',(_, data)=>{
      console.log('Angular on receiving ipcRenderer response after product insert');
      console.log(data);
    });
  }

  updateProduct(product: IProductData): void{
    console.log('Angular updating product..');
    console.log(product);
    this.ipcRenderer.invoke('update-product', product);
    this.ipcRenderer.on('update-product-recv',(_, data)=>{
      console.log('Angular on receiving ipcRenderer response after product update');
      console.log(data);
    });
  }

  deleteProduct(productID: string): void {
    console.log('Angular deleting product..');
    this.ipcRenderer.invoke('delete-product', productID);
    this.ipcRenderer.on('delete-product-recv',(_, data)=>{
      console.log('Angular on receiving ipcRenderer response after product delete');
      console.log(data);
    });
  }

  dummyHandler(dummy: string): void{
    console.log('Angular dummy handler..');
    this.ipcRenderer.invoke('dummy-handle', dummy);
    this.ipcRenderer.on('dummy-handle-recv',(_, data)=>{
      console.log('Angular on receiving ipcRenderer response after dummy handling');
      console.log(data);
    });
  }

  closeApp(): void{
    console.log('Closing app..');
    this.ipcRenderer.invoke('close-main-window');
  }

}
