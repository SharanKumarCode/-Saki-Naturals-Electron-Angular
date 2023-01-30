import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { IEmployeeData } from '../../core/interfaces/interfaces';
import * as moment from 'moment';

@Component({
  selector: 'app-employee-attendance-history-table',
  templateUrl: './employee-attendance-history-table.component.html',
  styleUrls: ['./employee-attendance-history-table.component.scss']
})
export class EmployeeAttendanceHistoryTableComponent implements OnInit, OnChanges {

  @Input() selectedEmployeeData: IEmployeeData;

  selectedMonth: number;
  selectedMonthName: string;
  selectedYear: number;
  yearList: number[] = [];

  form: FormGroup;

  displayedColumns: string[] = [
    'serial_number',
    'date',
    'status',
    'remarks'
  ];

  dataSource = new MatTableDataSource([]);
  private path = 'assets/icon/';

  constructor(
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
  ) {
    this.form = this.fb.group({
      year: ['']
    });

    this.matIconRegistry
        .addSvgIcon('prev',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'less_than_icon.svg'))
        .addSvgIcon('next',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'greater_than_icon.svg'));
   }

   setTableData(): void {
    const tmp = [];
    this.selectedEmployeeData.employeeAttendanceEntries
    .filter(data=>moment(data.date).month() === this.selectedMonth && moment(data.date).year() === this.selectedYear)
    .sort((a, b)=> new Date(b.date).getTime() - new Date(a.date).getTime())
    .reverse()
    .forEach((value, index)=>{
      tmp.push({
        ...value,
        serialNumber: index + 1
      });
    });
    this.dataSource = new MatTableDataSource(tmp);
   }

   onPrevMonth(): void {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear -= 1;
      this.form.controls.year.setValue(this.selectedYear);
    } else {
      this.selectedMonth -= 1;
    }

    this.selectedMonthName = moment(`${this.selectedYear}-${this.selectedMonth+1}-${2}`)
                            .startOf('month').format('MMMM');
    this.setTableData();

  }

  onNextMonth(): void {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear += 1;
      this.form.controls.year.setValue(this.selectedYear);
    } else {
      this.selectedMonth += 1;
    }

    this.selectedMonthName = moment(`${this.selectedYear}-${this.selectedMonth+1}-2`)
                            .startOf('month').format('MMMM');
    this.setTableData();

  }

  onYearChange(e): void {
    if (e.isUserInput){
      this.selectedYear = e.source.value;
      this.setTableData();
    }
  }

  onExportAsExcel(): void {

  }

  ngOnInit(): void {
    console.log(this.selectedEmployeeData);
    this.selectedMonth = moment().month();
    this.selectedYear = moment().year();
    const listOfYears = [...new Set(this.selectedEmployeeData.employeeAttendanceEntries.map(data=>moment(data.date).year()))]
                        .sort((a, b)=> b - a)
                        .reverse();
    this.yearList = listOfYears;
    this.form.controls.year.setValue(this.yearList[this.yearList.length - 1]);
    this.selectedMonthName = moment(`${this.form.value.year}-${this.selectedMonth+1}-${1}`)
                            .startOf('month').format('MMMM');
    this.setTableData();
  }

  ngOnChanges(): void {
    this.selectedMonth = moment().month();
    this.selectedYear = moment().year();
    const listOfYears = [...new Set(this.selectedEmployeeData.employeeAttendanceEntries.map(data=>moment(data.date).year()))]
                        .sort((a, b)=> b - a)
                        .reverse();
    this.yearList = listOfYears;
    this.form.controls.year.setValue(this.yearList[this.yearList.length - 1]);
    this.selectedMonthName = moment(`${this.form.value.year}-${this.selectedMonth+1}-${1}`)
                            .startOf('month').format('MMMM');
    this.setTableData();
  }

}
