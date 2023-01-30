import { Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';
import { ElectronService } from '../electron/electron.service';
import { ipcRenderer } from 'electron';
import { IAttendanceEntry, IEmployeeData, ISalaryTransaction } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmployeedbService {

  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private employeeService: EmployeeService,
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getEmployeeList(): void{
    console.log('INFO: Getting all employee data');
    const employeeList: IEmployeeData[] = [];
    this.ipcRenderer.invoke('get-employee')
    .then(data=>{

      data.forEach(element=>{

        const employeeData: IEmployeeData = {
          employeeID: element.employeeID,
          employeeSalaryEntries: element.employeeSalaryEntries,
          employeeAttendanceEntries: element.employeeAttendanceEntries,
          employeeName: element.employeeName,
          role: element.role,
          dob: new Date(element.dob),
          aadhar: element.aadhar,
          gender: element.gender,
          salary: element.salary,
          salaryFrequency: element.salaryFrequency,

          contact1: element.contact1,
          contact2: element.contact2,
          address: element.address,
          email: element.email,
          joiningDate: new Date(element.joiningDate),
          exitDate: element.exitDate ? new Date(element.exitDate) : null,
          remarks: element.remarks,
          createdDate: element.createdDate

        };
        employeeList.push(employeeData);
      });
      this.employeeService.updateEmployeeList(employeeList);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  getEmployeeByID(employeeID: string): any{
    console.log('INFO: Getting employee by ID');
    return this.ipcRenderer.invoke('get-employee-by-id', employeeID)
    .then(data=>{
      data[0].joiningDate = new Date(data[0].joiningDate);
      data[0].dob = new Date(data[0].dob);
      data[0].exitDate = data[0].exitDate ? new Date(data[0].exitDate) : null;
      this.employeeService.updateSelectedEmployeeData(data[0]);

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

  insertEmployee(employeeData: IEmployeeData): Promise<any>{
    console.log('INFO: Inserting employee');
    return this.ipcRenderer.invoke('insert-employee', employeeData);
  }

  updateEmployee(employeeData: IEmployeeData): Promise<any>{
    console.log('INFO: Updating employee data');
    return this.ipcRenderer.invoke('update-employee', employeeData);
  }

  deleteEmployee(employeeID: string): Promise<any>{
    console.log('INFO: Deleting employee data');
    return this.ipcRenderer.invoke('delete-employee', employeeID);
  }

  insertSalaryTransaction(transaction: ISalaryTransaction): Promise<any>{
    console.log('INFO: Inserting salary transaction data');
    return this.ipcRenderer.invoke('insert-salary-transaction', transaction);
  }

  updateSalaryTransaction(transaction: ISalaryTransaction): Promise<any>{
    console.log('INFO: Updating salary transaction data');
    return this.ipcRenderer.invoke('update-salary-transaction', transaction);
  }

  deleteSalaryTransaction(transactionID: string): Promise<any>{
    console.log('INFO: Deleting salary transaction data');
    return this.ipcRenderer.invoke('delete-salary-transaction', transactionID);
  }

  insertAttendanceEntry(attendanceEntry: IAttendanceEntry): Promise<any>{
    return this.ipcRenderer.invoke('insert-attendance-entry', attendanceEntry);
  }

  updateAttendanceEntry(attendanceEntry: IAttendanceEntry): Promise<any>{
    return this.ipcRenderer.invoke('update-attendance-entry', attendanceEntry);
  }

  deleteAttendanceEntry(attendanceEntryID: string): Promise<any>{
    return this.ipcRenderer.invoke('delete-attendance-entry', attendanceEntryID);
  }
}
