import { Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { EmployeedbService } from './employeedb.service';
import { IEmployeeData } from '../../interfaces/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDataResolverService {

  constructor(
    private employeeService: EmployeeService,
    private employeeDBservice: EmployeedbService
  ) {
   }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Subject<IEmployeeData>{
    this.employeeService.updateSelectedEmployeeID(route.paramMap.get('selectedEmployeeID'));
    this.employeeDBservice.getEmployeeByID(this.employeeService.getSelectedEmployeeID());
    return this.employeeService.getSelectedEmployeeData();
  }
}
