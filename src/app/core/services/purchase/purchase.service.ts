import { Injectable } from '@angular/core';
import { IPurchaseData } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';
import { EnumPurchaseStatus } from '../../interfaces/enums';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private purchaseListSubject$: Subject<IPurchaseData[]>;
  private selectedPurchaseID: string;
  private selectedPurchaseDataSubject$: Subject<IPurchaseData>;

  constructor() {
    this.purchaseListSubject$ = new Subject<IPurchaseData[]>();
    this.selectedPurchaseDataSubject$ = new Subject<IPurchaseData>();
   }

   getPurchaseList(): Subject<IPurchaseData[]>{
    return this.purchaseListSubject$;
   }

   updatePurchaseList(data: IPurchaseData[]): void{
    this.purchaseListSubject$.next(data);
   }

   getSelectedPurchaseID(): string{
    return this.selectedPurchaseID;
   }

   updateSelectedPurchaseID(purchaseID: string){
    this.selectedPurchaseID = purchaseID;
   }

   getSelectedPurchaseData(): Subject<IPurchaseData>{
    return this.selectedPurchaseDataSubject$;
   }

   updateSelectedPurchaseData(data: IPurchaseData): void {
      this.selectedPurchaseDataSubject$.next(data);
   }

   getPurchaseStatus(purchaseData: IPurchaseData): EnumPurchaseStatus {

    if (purchaseData.cancelledDate) {
      return EnumPurchaseStatus.cancelled;
    }

    if (purchaseData.completedDate) {
      return EnumPurchaseStatus.completed;
    }

    if (purchaseData.refundedDate) {
      return EnumPurchaseStatus.refunded;
    }

    if (purchaseData.returnedDate) {
      return EnumPurchaseStatus.returned;
    }

    if (purchaseData.deliveredDate) {
      return EnumPurchaseStatus.delivered;
    }

    if (purchaseData.dispatchDate) {
      return EnumPurchaseStatus.dispatched;
    }

    return EnumPurchaseStatus.initiated;

   }
}
