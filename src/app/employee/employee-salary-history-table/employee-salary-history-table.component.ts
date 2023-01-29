import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-employee-salary-history-table',
  templateUrl: './employee-salary-history-table.component.html',
  styleUrls: ['./employee-salary-history-table.component.scss']
})
export class EmployeeSalaryHistoryTableComponent implements OnInit {

  selectedYear: number;
  yearList: number[] = [];

  form: FormGroup;

  displayedColumns: string[] = [
    'serial_number',
    'date',
    'salary',
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

  onYearChange(e): void {
    if (e.isUserInput){

    }
  }

  onExportAsExcel(): void {

  }

  ngOnInit(): void {
  }

}
