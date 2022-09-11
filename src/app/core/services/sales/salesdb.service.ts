import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { ipcRenderer } from 'electron';
import { SalesService } from './sales.service';
import { ISalesData, ISaleTransactionComplete } from '../../../sales/interfaces/salesdata.interface';

@Injectable({
  providedIn: 'root'
})
export class SalesdbService {

  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private salesService: SalesService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getSalesList(): void{
    console.log('INFO: getting all sales data');
    const salesList: ISalesData[] = [];
    this.ipcRenderer.invoke('get-sales')
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.warn(err);
    });
  }

  insertSales(saledata: ISaleTransactionComplete): void{
    console.log('INFO: inserting sale data');
    this.ipcRenderer.invoke('insert-sale', saledata)
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
    });
  }
}
