import { Injectable } from '@angular/core';
import { ITransactionEntry, ITransactionTypeData } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactionEntryListSubject$: Subject<ITransactionEntry[]>;
  private transactionTypeListSubject$: Subject<ITransactionTypeData[]>;
  private selectedTransactionEntyID: string;
  private selectedTransactionEntyDataSubject$: Subject<ITransactionEntry>;


  constructor() {
    this.transactionEntryListSubject$ = new Subject<ITransactionEntry[]>();
    this.transactionTypeListSubject$ = new Subject<ITransactionTypeData[]>();
    this.selectedTransactionEntyDataSubject$ = new Subject<ITransactionEntry>();
  }

  getTransactionEntryList(): Subject<ITransactionEntry[]>{
    return this.transactionEntryListSubject$;
  }

  updateTransactionEntryList(a: ITransactionEntry[]){
    this.transactionEntryListSubject$.next(a);
  }

  getSelectedTransactionEntyID(): string{
    return this.selectedTransactionEntyID;
   }

   updateSelectedTransactionEntyID(selectedTransactionEntyID: string){
    this.selectedTransactionEntyID = selectedTransactionEntyID;
   }

   getTransactionTypeList(): Subject<ITransactionTypeData[]>{
    return this.transactionTypeListSubject$;
   }

   updateTransactionTypeList(a: ITransactionTypeData[]){
    this.transactionTypeListSubject$.next(a);
  }

   getSelectedTransactionEnty(): Subject<ITransactionEntry>{
    return this.selectedTransactionEntyDataSubject$;
   }

   updateSelectedTransactionEnty(data: ITransactionEntry): void {
      this.selectedTransactionEntyDataSubject$.next(data);
   }
}
