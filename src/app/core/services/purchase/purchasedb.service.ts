import { Injectable } from '@angular/core';
import { PurchaseService } from './purchase.service';
import { IPurchaseData, IPurchaseTransactions } from '../../interfaces/interfaces';
import { CommonService } from '../common.service';
import { ipcRenderer } from 'electron';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class PurchasedbService {

  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private purchaseService: PurchaseService,
    private commonService: CommonService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getPurchaseList(): void{
    console.log('INFO: Getting all purchase data');
    const purchaseList: IPurchaseData[] = [];
    this.ipcRenderer.invoke('get-purchase')
    .then(data=>{

      data.forEach(element=>{

        const purchaseData: IPurchaseData = {
          purchaseID: element.purchaseID,
          gstPercentage: element.gstPercentage,
          overallDiscountPercentage: element.overallDiscountPercentage,
          transportCharges: element.transportationCharges,
          miscCharges: element.miscCharges,
          paymentTerms: element.paymentTerms,
          supplier: element.supplier,
          purchaseEntries: element.purchaseEntries,
          purchaseTransactions: element.purchaseTransactions,

          purchaseDate: element.purchaseDate,
          dispatchDate: element.dispatchDate,
          deliveredDate: element.deliveredDate,
          returnedDate: element.returnedDate,
          refundedDate: element.refundedDate,
          completedDate: element.completedDate,
          cancelledDate: element.cancelledDate
        };
        purchaseList.push(purchaseData);
      });
      this.purchaseService.updatePurchaseList(purchaseList);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  getPurchaseByID(purchaseID: string): any{
    console.log('INFO: Getting purchase by ID');
    return this.ipcRenderer.invoke('get-purchase-by-id', purchaseID)
    .then(data=>{

      // sorting sales transactoin by date and type - ascending order
      // data[0].saleTransactions = data[0].saleTransactions.length > 0 ?
      //                             this.commonService.sortSalesTransactionByTypeAndDate(data[0].saleTransactions)
      //                             : [];
      this.purchaseService.updateSelectedPurchaseData(data[0]);

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

  insertPurchase(purchaseData: IPurchaseData): Promise<any>{
    console.log('INFO: Inserting purchase');
    return this.ipcRenderer.invoke('insert-purchase', purchaseData);
  }

  updatePurchase(purchaseData: IPurchaseData): Promise<any>{
    console.log('INFO: Updating purchase data');
    return this.ipcRenderer.invoke('update-purchase', purchaseData);
  }

  deletePurchase(purchaseID: string): Promise<any>{
    console.log('INFO: Deleting purchase data');
    return this.ipcRenderer.invoke('delete-purchase', purchaseID);
  }

  getPurchaseTransactionsList(): void{
    console.log('INFO: Getting all transaction data');
    this.ipcRenderer.invoke('get-purchase-transaction')
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  getPurchaseTransactionByID(transactionID: string): void{
    console.log('INFO: Getting purchase transaction by ID');
    this.ipcRenderer.invoke('get-purchase-transaction-by-id', transactionID)
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  insertPurchaseTransaction(transaction: IPurchaseTransactions): Promise<any>{
    console.log('INFO: Inserting purchase transaction data');
    return this.ipcRenderer.invoke('insert-purchase-transaction', transaction);
  }

  updatePurchaseTransaction(transaction: IPurchaseTransactions): Promise<any>{
    console.log('INFO: Updating purchase transaction data');
    return this.ipcRenderer.invoke('update-purchase-transaction', transaction);
  }

  deletePurchaseTransaction(transactionID: string): Promise<any>{
    console.log('INFO: Deleting purchase transaction data');
    return this.ipcRenderer.invoke('delete-purchase-transaction', transactionID);
  }

  deletePurchaseEntry(purchaseEntryIDs: any): Promise<any>{
    return this.ipcRenderer.invoke('delete-purchase-entry', purchaseEntryIDs);
  }
}
