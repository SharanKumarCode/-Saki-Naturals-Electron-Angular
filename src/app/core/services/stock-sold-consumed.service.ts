import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { ElectronService } from './electron/electron.service';
import { NotificationService } from './notification/notification.service';
import { ProductsService } from './products/products.service';

@Injectable({
  providedIn: 'root'
})
export class StockSoldConsumedService {

  ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private productService: ProductsService,
    private notificationService: NotificationService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getProductStockAndSoldByID(productID: string) {
    this.ipcRenderer.invoke('get-product-stock-sold-by-id', productID).then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
    });
  }

  getProductsStockAndSold(productIDs: string[]) {

  }
}
