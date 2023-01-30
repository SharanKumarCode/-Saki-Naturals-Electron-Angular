import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { EmployeedbService } from '../../core/services/employee/employeedb.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification.service';
import { IEmployeeData, ISalaryTransaction } from '../../core/interfaces/interfaces';
import { EnumRouteActions, EnumTransactionDialogType } from '../../core/interfaces/enums';
import { MatDialog } from '@angular/material/dialog';
import {
  SalesPurchaseTransactionDialogComponent
 } from '../../dialogs/sales-purchase-transaction-dialog/sales-purchase-transaction-dialog.component';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {

  panelOpenState = false;
  selectedEmployeeID: string;
  selectedEmployeeData: IEmployeeData;
  employeeDetail: any;
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private employeeDBservice: EmployeedbService,
    private notificationService: NotificationService
  ) {

    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
   }

  setEmployeeDetails(): void {
    this.employeeDetail = {
      employeeID: this.selectedEmployeeData?.employeeID,
      createdDate: this.selectedEmployeeData?.createdDate,
      employeeName: this.selectedEmployeeData?.employeeName,
      role: this.selectedEmployeeData?.role,
      dob: this.selectedEmployeeData?.dob,
      gender: this.selectedEmployeeData?.gender,
      joiningDate: this.selectedEmployeeData?.joiningDate,
      exitDate: this.selectedEmployeeData?.exitDate,
      contact1: this.selectedEmployeeData?.contact1,
      contact2: this.selectedEmployeeData?.contact2,
      email: this.selectedEmployeeData?.email,
      aadhar: this.selectedEmployeeData?.aadhar,
      salary: this.selectedEmployeeData?.salary,
      salaryFrequency: this.selectedEmployeeData?.salaryFrequency,
      address: this.selectedEmployeeData?.address,
      remarks: this.selectedEmployeeData?.remarks
    };
  }

  onUpdateEmployee(): void {
    this.router.navigate(['employee/add_update_employee',
                        EnumRouteActions.update,
                        this.selectedEmployeeData.employeeID]);
  }

  onDeleteEmployee(): void {

  }

  onAddSalaryTransaction(): void {
    console.log('INFO : Opening dialog box add transaction');
    const dialogRef = this.dialog.open(SalesPurchaseTransactionDialogComponent, {
      width: '50%',
      data: {
        editCreate: 'Create',
        dialogType: EnumTransactionDialogType.salary,
        salary: this.selectedEmployeeData.salary,
        remarks: '',
        transactionDate: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      if (result){
        console.log(result);
        const salaryEntry: ISalaryTransaction = {
          employee: this.selectedEmployeeData,
          amount: result.transactionAmount,
          transactionDate: result.transactionDate,
          transactionType: result.transactionType,
          remarks: result.remarks
        };

        this.employeeDBservice.insertSalaryTransaction(salaryEntry)
        .then(_=>{
          this.notificationService.updateSnackBarMessageSubject('Added Salary Transaction entry');
        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to add Salary Transaction entry');
        });
      }
    });
  }

  onRefresh(): void {
    this.employeeDBservice.getEmployeeByID(this.selectedEmployeeID);
  }

  onBack(): void {
    this.router.navigate(['employee']);

  }

  ngOnInit(): void {
    this.selectedEmployeeID = this.employeeService.getSelectedEmployeeID();
    this.activatedRoute.data.subscribe(data=>{
      this.selectedEmployeeData = data.employeeData;
      this.setEmployeeDetails();
      this.employeeService.getSelectedEmployeeData().subscribe(d=>{
        this.selectedEmployeeData = d;
        this.setEmployeeDetails();
      });
    });
  }

}
