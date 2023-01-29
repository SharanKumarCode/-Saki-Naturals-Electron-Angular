import { Injectable } from '@angular/core';
import { IEmployeeData } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employeeListSubject$: Subject<IEmployeeData[]>;
  private selectedEmployeeID: string;
  private selectedEmployeeDataSubject$: Subject<IEmployeeData>;

  constructor() {
    this.employeeListSubject$ = new Subject<IEmployeeData[]>();
    this.selectedEmployeeDataSubject$ = new Subject<IEmployeeData>();
   }

   getEmployeeList(): Subject<IEmployeeData[]>{
    return this.employeeListSubject$;
   }

   updateEmployeeList(data: IEmployeeData[]): void{
    this.employeeListSubject$.next(data);
   }

   getSelectedEmployeeID(): string{
    return this.selectedEmployeeID;
   }

   updateSelectedEmployeeID(purchaseID: string){
    this.selectedEmployeeID = purchaseID;
   }

   getSelectedEmployeeData(): Subject<IEmployeeData>{
    return this.selectedEmployeeDataSubject$;
   }

   updateSelectedEmployeeData(data: IEmployeeData): void {
      this.selectedEmployeeDataSubject$.next(data);
   }
}
