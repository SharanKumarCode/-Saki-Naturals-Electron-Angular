import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ExportService } from '../core/services/export.service';
import { EnumRouteActions, IEmployeeData } from '../core/interfaces/interfaces';
import { EmployeeService } from '../core/services/employee/employee.service';
import { EmployeedbService } from '../core/services/employee/employeedb.service';
import * as moment from 'moment';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;

  employeeList = [];

  displayedColumns: string[] = [
                                'serial_number',
                                'employeeName',
                                'role',
                                'age',
                                'contact1',
                                'joiningDate',
                                'exitDate'
                              ];

  dataSource = new MatTableDataSource([]);

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private exportService: ExportService,
    private employeeDBservice: EmployeedbService,
    private employeeService: EmployeeService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {

    this.matIconRegistry
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
   }

  setTableDate(data: IEmployeeData[]){
    data.map((value, index)=>{
      value.createdDate = value.createdDate;
      return {
        ...value,
        serialNumber: index
      };
    }
    );
    const tmp = [];
    data.forEach((element, index)=>{
      tmp.push({
        ...element,
        age: moment().diff(element.dob, 'years'),
        serialNumber: index + 1
      });
    });
    this.dataSource = new MatTableDataSource(tmp);
  }

  onAddEmployee(): void {
    this.router.navigate(['employee/add_update_employee', EnumRouteActions.create]);
  }

  onExportAsExcel(): void {

  }

  onRowClick(e): void {
    this.router.navigate(['employee/detail', e.employeeID]);
  }

  onRefresh(): void {

  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.employeeDBservice.getEmployeeList();
    this.employeeService.getEmployeeList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
      console.log(data);
      this.setTableDate(data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
