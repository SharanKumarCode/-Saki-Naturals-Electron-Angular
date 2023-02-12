import { Injectable } from '@angular/core';
import { TransactionService } from './transaction.service';
import { ITransactionEntry, ITransactionTypeData } from '../../interfaces/interfaces';
import { ipcRenderer } from 'electron';
import { ElectronService } from '../electron/electron.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class TransactiondbService {

  ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private transactionService: TransactionService,
    private notificationService: NotificationService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getAllTransactionTypes(): void {

    let transactionTypeList: ITransactionTypeData[];
    this.ipcRenderer.invoke('get-transaction-types')
    .then(data=>{
      console.log('INFO : Fetched all transaction types');
      transactionTypeList = data.filter(d=>d.deleteFlag === false).map(d=>({
          transactionTypeID: d.transactionTypeID,
          transactionGroup: d.transactionGroup,
          transactionName: d.transactionName
        }));
      this.transactionService.updateTransactionTypeList(transactionTypeList);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to fetch product groups from DB');
    });
  }

  insertTransactionType(productGroupData: ITransactionTypeData): void {
    this.ipcRenderer.invoke('insert-transaction-type', productGroupData)
    .then(_=>{
      console.log('INFO : Inserted transaction type');
      this.getAllTransactionTypes();
      this.notificationService.updateSnackBarMessageSubject('Inserted transaction type to DB');
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to insert transaction type to DB');
    });
  }

  deleteTransactionType(transactionTypeID: string): void {
    this.getTransactionEntryByTransactionTypeID(transactionTypeID).then(transactionEntryData=>{
      let DELETE_TYPE = 'hard-delete-transaction-type';

      if (transactionEntryData.length > 0){
        DELETE_TYPE = 'soft-delete-transaction-type';
      }

      this.ipcRenderer.invoke(DELETE_TYPE, transactionTypeID)
        .then(_=>{
          console.log('INFO : Deleted transaction type by ID');
          this.getAllTransactionTypes();
          this.notificationService.updateSnackBarMessageSubject('Deleted transaction type from DB');

        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to delete transaction type from DB');

        });
    });

  }

  getTransactionEntryByTransactionTypeID(transactionTypeID: string) {
    return this.ipcRenderer.invoke('get-transaction-by-type-id', transactionTypeID);
  }

  getAllTransactionEntries() {
    let transactionEntryList = [];
    this.ipcRenderer.invoke('get-transaction-entries')
    .then(data=>{
      transactionEntryList = data.map(d=>({
        transactionEntryID: d.transactionEntryID,
        transactionType: d.transactionType,
        transactionDate: d.transactionDate,
        transactionAmount: d.transactionAmount,
        remarks: d.remarks
      }));
      this.transactionService.updateTransactionEntryList(transactionEntryList);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to fetch transaction entries from DB');
    });
  }

  insertTransactionEntry(transactionEntryData: ITransactionEntry) {
    this.ipcRenderer.invoke('insert-transaction-entry', transactionEntryData)
    .then(_=>{
      console.log('INFO : Inserted transaction entry');
      this.getAllTransactionEntries();
      this.notificationService.updateSnackBarMessageSubject('Inserted transaction entry to DB');
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to insert transaction entry to DB');
    });
  }

  updateTransactionEntry(transactionEntryData: ITransactionEntry) {
    this.ipcRenderer.invoke('update-transaction-entry', transactionEntryData)
    .then(_=>{
      console.log('INFO : Updated transaction entry');
      this.getAllTransactionEntries();
      this.notificationService.updateSnackBarMessageSubject('Updated transaction entry to DB');
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to update transaction entry to DB');
    });
  }

  deleteTransactionEntry(transactionEntryID: string): void {
    this.ipcRenderer.invoke('delete-transaction-entry', transactionEntryID)
        .then(data=>{
          console.log(data);
          console.log('INFO : Deleted transaction entry by ID');
          this.getAllTransactionTypes();
          this.notificationService.updateSnackBarMessageSubject('Deleted transaction entry from DB');

        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to delete transaction entry from DB');
        });
  }
}
