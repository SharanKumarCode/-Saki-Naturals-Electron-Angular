import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ISalesData } from '../../interfaces/interfaces';
import { EnumSaleStatus } from '../../interfaces/enums';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private salesListSubject$: Subject<ISalesData[]>;
  private selectedSalesID: string;
  private selectedSaleDataSubject$: Subject<ISalesData>;

  constructor() {
    this.salesListSubject$ = new Subject<ISalesData[]>();
    this.selectedSaleDataSubject$ = new Subject<ISalesData>();
   }

   getSalesList(): Subject<ISalesData[]>{
    return this.salesListSubject$;
   }

   updateSalesList(data: ISalesData[]): void{
    this.salesListSubject$.next(data);
   }

   getSelectedSalesID(): string{
    return this.selectedSalesID;
   }

   updateSelectedSalesID(salesID: string){
    this.selectedSalesID = salesID;
   }

   getSelectedSaleData(): Subject<ISalesData>{
    return this.selectedSaleDataSubject$;
   }

   updateSelectedSaleData(data: ISalesData): void {
      this.selectedSaleDataSubject$.next(data);
   }

   getNetSalePrice(saleData: ISalesData): number {
    let totPrice = saleData.saleEntries
                      .filter(d=>d.returnFlag === false)
                      .map(d=>(d.price * d.quantity) - (d.price * d.quantity * d.discountPercentage / 100))
                      .reduce((partialSum, a) => partialSum + a, 0);
    totPrice -= saleData.saleEntries
                .filter(d=>d.returnFlag === true)
                .map(d=>(d.price * d.quantity)
                      - (d.price * d.quantity * d.discountPercentage / 100))
                .reduce((partialSum, a) => partialSum + a, 0);
    totPrice -= saleData.overallDiscountPercentage * totPrice / 100;
    totPrice += saleData.gstPercentage * totPrice / 100;
    totPrice += saleData.transportCharges + saleData.miscCharges;
    return totPrice;
   }

   getSaleStatus(saleData: ISalesData): EnumSaleStatus {

    if (saleData.cancelledDate) {
      return EnumSaleStatus.cancelled;
    }

    if (saleData.completedDate) {
      return EnumSaleStatus.completed;
    }

    if (saleData.refundedDate) {
      return EnumSaleStatus.refunded;
    }

    if (saleData.returnedDate) {
      return EnumSaleStatus.returned;
    }

    if (saleData.deliveredDate) {
      return EnumSaleStatus.delivered;
    }

    if (saleData.dispatchDate) {
      return EnumSaleStatus.dispatched;
    }

    return EnumSaleStatus.initiated;

   }
}
