import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ISalesData } from '../../../sales/interfaces/salesdata.interface';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private salesListSubject$: Subject<ISalesData[]>;
  private selectedSalesID: string;

  constructor() {
    this.salesListSubject$ = new Subject<ISalesData[]>();
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
}
