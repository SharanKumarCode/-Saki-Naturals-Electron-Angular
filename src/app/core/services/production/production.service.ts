import { Injectable } from '@angular/core';
import { EnumProductionStatus, IProductionData } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  private productionListSubject$: Subject<IProductionData[]>;
  private selectedProductionID: string;
  private selectedProductionSubject$: Subject<IProductionData>;

  constructor() {
    this.productionListSubject$ = new Subject<IProductionData[]>();
    this.selectedProductionSubject$ = new Subject<IProductionData>();
   }

   getProductionList(): Subject<IProductionData[]>{
    return this.productionListSubject$;
   }

   updateProductionList(data: IProductionData[]): void{
    this.productionListSubject$.next(data);
   }

   getSelectedProductionID(): string{
    return this.selectedProductionID;
   }

   updateSelectedProductionID(salesID: string){
    this.selectedProductionID = salesID;
   }

   getSelectedProductionData(): Subject<IProductionData>{
    return this.selectedProductionSubject$;
   }

   updateSelectedProductionData(data: IProductionData): void {
      this.selectedProductionSubject$.next(data);
   }

   getProductionStatus(productionData: IProductionData): EnumProductionStatus {

    if (productionData.cancelledDate) {
      return EnumProductionStatus.cancelled;
    }

    if (productionData.completedDate) {
      return EnumProductionStatus.completed;
    }

    return EnumProductionStatus.initiated;

   }
}
