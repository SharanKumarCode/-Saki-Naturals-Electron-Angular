import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { ipcRenderer } from 'electron';
import { SalesService } from './sales.service';
import { ISalesData, ISaleTransactionComplete, ISaleTransactions } from '../../../sales/interfaces/salesdata.interface';

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
    console.log('INFO: Getting all sales data');
    const salesList: ISalesData[] = [];
    this.ipcRenderer.invoke('get-sales')
    .then(data=>{
      data.forEach(element=>{
        const saleData: ISalesData = {
          productID: element.productID,
          saleDate: element.saleDate,
          purchaser: element.purchaser,
          supplier: element.supplier,
          saleType: element.saleType,
          sellingPrice: element.sellingPrice,
          sellingQuantity: element.sellingQuantity,
          salesID: element.salesID,
          saleTransactions: element.saleTransactions
        };
        salesList.push(saleData);
      });
      this.salesService.updateSalesList(salesList);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  getSalesByID(salesID: string): Promise<ISalesData>{
    console.log('INFO: Getting sales by ID');
    return this.ipcRenderer.invoke('get-sale-by-id', salesID);
  }

  insertSales(saledata: ISaleTransactionComplete): void{
    console.log('INFO: Inserting sale and initial Transaction data');
    this.ipcRenderer.invoke('insert-sale', saledata)
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  updateSales(saledata: ISalesData): void{
    console.log('INFO: Updating sales data');
    this.ipcRenderer.invoke('update-sale', saledata)
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  deleteSales(salesID: string): void{
    console.log('INFO: Deleting sales data');
    this.ipcRenderer.invoke('delete-sale', salesID)
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  getSaleTransactionsList(): void{
    console.log('INFO: Getting all transaction data');
    this.ipcRenderer.invoke('get-sales-transaction')
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  getSaleTransactionByID(transactionID: string): void{
    console.log('INFO: Getting sale transaction by ID');
    this.ipcRenderer.invoke('get-sales-transaction-by-id', transactionID)
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  insertSaleTransaction(transaction: ISaleTransactions): void{
    console.log('INFO: Inserting sale transaction data');
    this.ipcRenderer.invoke('insert-sale-transaction', transaction)
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  updateSaleTransaction(transaction: ISaleTransactions): void{
    console.log('INFO: Updating sale transaction data');
    this.ipcRenderer.invoke('update-sale-transaction', transaction)
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  deleteSaleTransaction(transactionID: string): void{
    console.log('INFO: Deleting sale transaction data');
    this.ipcRenderer.invoke('delete-sale-transaction', transactionID)
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }
}
