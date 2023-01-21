import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { ipcRenderer } from 'electron';
import { ISalesData, ISaleTransactions } from '../../interfaces/interfaces';
import { CommonService } from '../common.service';
import { SalesService } from './sales.service';

@Injectable({
  providedIn: 'root'
})
export class SalesdbService {

  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private salesService: SalesService,
    private commonService: CommonService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getSalesList(): void{
    console.log('INFO: Getting all sales data');
    const salesList: ISalesData[] = [];
    this.ipcRenderer.invoke('get-sales')
    .then(data=>{

      data.forEach(element=>{

        // sorting sales transactoin by date and type - ascending order
        element.saleTransactions = element.saleTransactions.length > 0 ?
                                   this.commonService.sortSalesTransactionByTypeAndDate(element.saleTransactions) :
                                   [];

        const saleData: ISalesData = {
          salesID: element.salesID,
          salesDate: element.salesDate,
          saleType: element.saleType,
          gstPercentage: element.gstPercentage,
          overallDiscountPercentage: element.overallDiscountPercentage,
          transportCharges: element.transportationCharges,
          miscCharges: element.miscCharges,
          paymentTerms: element.paymentTerms,
          customer: element.customer,
          saleEntries: element.saleEntries,
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

  getSalesByID(salesID: string): any{
    console.log('INFO: Getting sales by ID');
    return this.ipcRenderer.invoke('get-sale-by-id', salesID)
    .then(data=>{

      // sorting sales transactoin by date and type - ascending order
      data[0].saleTransactions = data[0].saleTransactions.length > 0 ?
                                  this.commonService.sortSalesTransactionByTypeAndDate(data[0].saleTransactions)
                                  : [];
      this.salesService.updateSelectedSaleData(data[0]);

      return new Promise((res, rej)=>{
        res(true);
      });
    })
    .catch(err=>{
      console.error(err);

      return new Promise((res, rej)=>{
        rej(true);
      });
    });
  }

  insertSales(saledata: ISalesData): Promise<any>{
    console.log('INFO: Inserting sale and initial Transaction data');
    return this.ipcRenderer.invoke('insert-sale', saledata);
  }

  updateSales(saledata: ISalesData): Promise<any>{
    console.log('INFO: Updating sales data');
    return this.ipcRenderer.invoke('update-sale', saledata);
  }

  deleteSales(salesID: string): Promise<any>{
    console.log('INFO: Deleting sales data');
    return this.ipcRenderer.invoke('delete-sale', salesID);
  }

  insertSaleTransaction(transaction: ISaleTransactions): Promise<any>{
    console.log('INFO: Inserting sale transaction data');
    return this.ipcRenderer.invoke('insert-sale-transaction', transaction);
  }

  updateSaleTransaction(transaction: ISaleTransactions): Promise<any>{
    console.log('INFO: Updating sale transaction data');
    return this.ipcRenderer.invoke('update-sale-transaction', transaction);
  }

  deleteSaleTransaction(transactionID: string): Promise<any>{
    console.log('INFO: Deleting sale transaction data');
    return this.ipcRenderer.invoke('delete-sale-transaction', transactionID);
  }

  deleteSalesEntry(saleEntryIDs: any): Promise<any>{
    return this.ipcRenderer.invoke('delete-sale-entry', saleEntryIDs);
  }
}
