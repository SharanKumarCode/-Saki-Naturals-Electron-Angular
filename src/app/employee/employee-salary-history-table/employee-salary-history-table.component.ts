import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IEmployeeData, ISalaryTransaction } from '../../core/interfaces/interfaces';
import * as moment from 'moment';
import { EnumTransactionDialogType, EnumTransactionType } from '../../core/interfaces/enums';
import { MatDialog } from '@angular/material/dialog';
import {
  SalesPurchaseTransactionDialogComponent
 } from '../../dialogs/sales-purchase-transaction-dialog/sales-purchase-transaction-dialog.component';
import { EmployeedbService } from '../../core/services/employee/employeedb.service';
import { NotificationService } from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-employee-salary-history-table',
  templateUrl: './employee-salary-history-table.component.html',
  styleUrls: ['./employee-salary-history-table.component.scss']
})
export class EmployeeSalaryHistoryTableComponent implements OnInit, OnChanges {
  @Input() selectedEmployeeData: IEmployeeData;

  selectedYear: number;
  yearList: number[] = [];

  form: FormGroup;

  displayedColumns: string[] = [
    'serial_number',
    'date',
    'salary',
    'advance',
    'remarks'
  ];

  dataSource = new MatTableDataSource([]);

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private employeeDBservice: EmployeedbService,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      year: ['']
    });
   }

  setTableData(): void {
    const tmp = [];
    this.selectedEmployeeData.employeeSalaryEntries
    .filter(data=>moment(data.transactionDate).year() === this.selectedYear)
    .sort((a, b)=> new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    .reverse()
    .forEach((value, index)=>{
      tmp.push({
        ...value,
        salaryTransactionID: value.salaryTransactionID,
        date: value.transactionDate,
        transactionType: value.transactionType,
        amount: value.amount,
        salary: value.transactionType === EnumTransactionType.salary ? value.amount : 0,
        advance: value.transactionType === EnumTransactionType.advance ? value.amount : 0,
        serialNumber: index + 1
      });
    });
    this.dataSource = new MatTableDataSource(tmp);
  }

  onYearChange(e): void {
    if (e.isUserInput){
      this.selectedYear = e.source.value;
      this.setTableData();
    }
  }

  onRowClick(e): void {
    this.updateSaleTransaction(e);
  }

  updateSaleTransaction(e): void {
    console.log('INFO : Opening dialog box add transaction');
    const dialogRef = this.dialog.open(SalesPurchaseTransactionDialogComponent, {
      width: '50%',
      data: {
        editCreate: 'Edit',
        dialogType: EnumTransactionDialogType.salary,
        salary: this.selectedEmployeeData.salary,
        transactionAmount: e.amount,
        remarks: e.remarks,
        transactionType: e.transactionType,
        transactionDate: e.date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      if (result){
        if (result.editCreate === 'Edit'){
          const salaryEntry: ISalaryTransaction = {
            salaryTransactionID: e.salaryTransactionID,
            employee: this.selectedEmployeeData,
            amount: result.transactionAmount,
            transactionDate: result.transactionDate,
            transactionType: result.transactionType,
            remarks: result.remarks
          };

          this.employeeDBservice.updateSalaryTransaction(salaryEntry)
          .then(_=>{
            this.notificationService.updateSnackBarMessageSubject('Updated Salary Transaction entry');
          })
          .catch(err=>{
            console.log(err);
            this.notificationService.updateSnackBarMessageSubject('Unable to update Salary Transaction entry');
          });
          } else {
            this.employeeDBservice.deleteSalaryTransaction(e.salaryTransactionID)
              .then(_=>{
                this.notificationService.updateSnackBarMessageSubject('Deleted Salary Transaction entry');
              })
              .catch(err=>{
                console.log(err);
                this.notificationService.updateSnackBarMessageSubject('Unable to delete Salary Transaction entry');
              });
              }
      }
    });
  }

  onExportAsExcel(): void {

  }

  ngOnInit(): void {
    this.selectedYear = moment().year();
    const listOfYears = [...new Set(this.selectedEmployeeData.employeeSalaryEntries.map(data=>moment(data.transactionDate).year()))]
                        .sort((a, b)=> b - a)
                        .reverse();
    this.yearList = listOfYears;
    this.form.controls.year.setValue(this.yearList[this.yearList.length - 1]);

    this.setTableData();
  }

  ngOnChanges(): void {
    this.selectedYear = moment().year();
    const listOfYears = [...new Set(this.selectedEmployeeData.employeeSalaryEntries.map(data=>moment(data.transactionDate).year()))]
                        .sort((a, b)=> b - a)
                        .reverse();
    this.yearList = listOfYears;
    this.form.controls.year.setValue(this.yearList[this.yearList.length - 1]);

    this.setTableData();
  }

}
