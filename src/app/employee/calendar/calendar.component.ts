import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { EnumAttendanceValues, IAttendanceEntry, IEmployeeData } from '../../core/interfaces/interfaces';
import { trigger, transition, style, animate } from '@angular/animations';
import { EmployeedbService } from '../../core/services/employee/employeedb.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EmployeeService } from '../../core/services/employee/employee.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})
export class CalendarComponent implements OnInit {

  @Input() selectedEmployeeData: IEmployeeData;

  selectedFullDate: string;
  selectedCalendarDate: number;

  selectedYear: number;
  selectedMonth: number;
  selectedMonthName: string;
  selectedDate: number;
  clickedDate: number;
  selectedDay: number;
  remarks: string;
  remarksFlag = false;

  labelPosition: EnumAttendanceValues = EnumAttendanceValues.none;
  weeksByDays: any[];
  yearList: number[] = [];

  form: FormGroup;

  displayedColumns: string[] = [
    'sun',
    'mon',
    'tue',
    'wed',
    'thurs',
    'fri',
    'sat'
  ];

  dataSource = new MatTableDataSource([]);
  private destroy$ = new Subject();
  private path = 'assets/icon/';


  constructor(
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private employeeDBservice: EmployeedbService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) {

    this.form = this.fb.group({
      year: [''],
      leaveRemarks: ['']
    });

    this.matIconRegistry
        .addSvgIcon('prev',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'less_than_icon.svg'))
        .addSvgIcon('tick',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'tick_icon.svg'))
        .addSvgIcon('next',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'greater_than_icon.svg'));
  }

  setCalender(){

    const numOfDaysInCurrMonth = moment(`${this.selectedYear}-${this.selectedMonth+1}-${this.selectedDate}`).daysInMonth();
    const firstDayOfCurrMonth = moment(`${this.selectedYear}-${this.selectedMonth+1}-${1}`).day();
    const datesOfCurrMonth = [];

    for (let i = 1; i <= numOfDaysInCurrMonth; i++){
      datesOfCurrMonth.push(i);
    }
    for (let i = 0; i < firstDayOfCurrMonth; i++) {
      datesOfCurrMonth.unshift(null);
    }
    for (let i = 0; i < (datesOfCurrMonth.length % 7) + 1; i++) {
      if (datesOfCurrMonth.length % 7 !== 0){
        datesOfCurrMonth.push(null);
      }
    }

    const weeksByDate = [];
    const numOfWeeks = datesOfCurrMonth.length / 7;

    for (let j = 0; j < numOfWeeks; j++) {
      const tmp = datesOfCurrMonth.splice(0, 7);
      weeksByDate.push(tmp);
    }

    this.weeksByDays = weeksByDate.map(d=>({
        sun: {
          value: d[0],
          currentDateFlag: false,
          dayValue: EnumAttendanceValues.none,
          remarks: ''
        },
        mon: {
          value: d[1],
          currentDateFlag: false,
          dayValue: EnumAttendanceValues.none,
          remarks: ''
        },
        tue: {
          value: d[2],
          currentDateFlag: false,
          dayValue: EnumAttendanceValues.none,
          remarks: ''
        },
        wed: {
          value: d[3],
          currentDateFlag: false,
          dayValue: EnumAttendanceValues.none,
          remarks: ''
        },
        thurs: {
          value: d[4],
          currentDateFlag: false,
          dayValue: EnumAttendanceValues.none,
          remarks: ''
        },
        fri: {
          value: d[5],
          currentDateFlag: false,
          dayValue: EnumAttendanceValues.none,
          remarks: ''
        },
        sat: {
          value: d[6],
          currentDateFlag: false,
          dayValue: EnumAttendanceValues.none,
          remarks: ''
        }
      }));

    this.setCurrentDateInCalender();
  }

  setCurrentDateInCalender(): void {

    if (this.selectedYear === moment().year() && this.selectedMonth === moment().month()) {
      this.weeksByDays.map(d=>{
        const day = Object.keys(d).find(key => d[key].value === this.selectedDate);
        if (day) {
          d[day].currentDateFlag = true;
        }
        return d;
      });
    }
    this.setSelectedEmployeeDataAttendanceEntry();
  }

  setSelectedEmployeeDataAttendanceEntry(): void {
    this.selectedEmployeeData.employeeAttendanceEntries.forEach(element => {
      const entryDate = moment(element.date);
      this.weeksByDays.map(d=>{
        const day = Object.keys(d).find(key => d[key].value === entryDate.date() &&
                                                this.selectedMonth === entryDate.month() &&
                                                this.selectedYear === entryDate.year());
        if (day) {
          d[day].dayValue = element.status;
          d[day].remarks = element.remarks;
        }
        return d;
      });
    });

    this.dataSource = new MatTableDataSource(this.weeksByDays);

  }

  onPrevMonth(): void {
    this.selectedFullDate = null;
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear -= 1;
      this.form.controls.year.setValue(this.selectedYear);
    } else {
      this.selectedMonth -= 1;
    }

    this.selectedMonthName = moment(`${this.selectedYear}-${this.selectedMonth+1}-${2}`)
                            .startOf('month').format('MMMM');
    this.remarksFlag = false;
    this.setCalender();

  }

  onNextMonth(): void {
    this.selectedFullDate = null;
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear += 1;
      this.form.controls.year.setValue(this.selectedYear);
    } else {
      this.selectedMonth += 1;
    }

    this.selectedMonthName = moment(`${this.selectedYear}-${this.selectedMonth+1}-2`)
                            .startOf('month').format('MMMM');
    this.remarksFlag = false;
    this.setCalender();

  }

  onYearChange(e): void {
    if (e.isUserInput){
      this.selectedFullDate = null;
      this.selectedYear = e.source.value;
      this.form.controls.remarks.setValue('');
      this.setCalender();
    }
  }

  onDateClick(e): void {
    this.clickedDate = e;
    this.selectedFullDate = moment(`${this.selectedYear}-${this.selectedMonth+1}-${this.clickedDate}`).format('LL');
    this.selectedCalendarDate = e;
    this.labelPosition = EnumAttendanceValues.none;
    this.remarksFlag = false;
    this.weeksByDays.map(d=>{
      const day = Object.keys(d).find(key => d[key].value === this.selectedCalendarDate);
      if (day) {
        this.labelPosition = d[day].dayValue;
        this.remarksFlag = this.labelPosition === EnumAttendanceValues.half || this.labelPosition === EnumAttendanceValues.leave;
        this.form.controls.leaveRemarks.setValue(d[day].remarks);
      }
      return d;
    });
  }

  onRadioOrRemarksChange(): void {
    this.remarksFlag = this.labelPosition === EnumAttendanceValues.half || this.labelPosition === EnumAttendanceValues.leave;
    if (this.labelPosition === EnumAttendanceValues.none ||
       this.labelPosition === EnumAttendanceValues.present ||
        this.labelPosition === EnumAttendanceValues.cHoliday) {
        this.checkAttendanceEntryAction();
    }
  }

  onRemarksUpdate(): void {
    this.checkAttendanceEntryAction();
  }

  checkAttendanceEntryAction() {
    const attendanceEntry: IAttendanceEntry = {
      employee: this.selectedEmployeeData,
      date: new Date(this.selectedYear , this.selectedMonth ,this.clickedDate),
      status: this.labelPosition,
      remarks: this.form.value.leaveRemarks
    };

    const existingAttendanceEntry = this.selectedEmployeeData.employeeAttendanceEntries
                                    .filter(d=>new Date(d.date).getTime() === attendanceEntry.date.getTime());
    if (existingAttendanceEntry.length === 0) {
      this.insertAttendanceEntryToDB(attendanceEntry);
    } else {
      if (attendanceEntry.status === EnumAttendanceValues.none) {
        this.deleteAttendanceEntryFromDB(existingAttendanceEntry[0].attendanceEntryID);
      } else if (attendanceEntry.status !== existingAttendanceEntry[0].status ||
          attendanceEntry.remarks !== existingAttendanceEntry[0].remarks ) {
          this.updateAttendanceEntryToDB({
            ...attendanceEntry,
            attendanceEntryID: existingAttendanceEntry[0].attendanceEntryID
          });
        }
    }

  }

  insertAttendanceEntryToDB(attendanceEntry: IAttendanceEntry) {
    this.employeeDBservice.insertAttendanceEntry(attendanceEntry)
    .then(_=>{
      this.notificationService.updateSnackBarMessageSubject('Attendance Entry Successfull');
      this.employeeDBservice.getEmployeeByID(this.selectedEmployeeData.employeeID);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to add Attendance Entry');
    });
  }

  updateAttendanceEntryToDB(attendanceEntry: IAttendanceEntry) {
    this.employeeDBservice.updateAttendanceEntry(attendanceEntry)
    .then(_=>{
      this.notificationService.updateSnackBarMessageSubject('Attendance Entry Successfull');
      this.employeeDBservice.getEmployeeByID(this.selectedEmployeeData.employeeID);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to update Attendance Entry');
    });
  }

  deleteAttendanceEntryFromDB(attendanceEntryID: string) {
    this.employeeDBservice.deleteAttendanceEntry(attendanceEntryID)
    .then(_=>{
      this.notificationService.updateSnackBarMessageSubject('Attendance Entry Successfull');
      this.employeeDBservice.getEmployeeByID(this.selectedEmployeeData.employeeID);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to delete Attendance Entry');
    });
  }

  setCurrentDate(): void {
    this.selectedYear = moment().year();
    this.form.controls.year.setValue(this.selectedYear);
    this.selectedMonth = moment().month();
    this.selectedDate = moment().date();
    this.selectedDay = moment().day();
    this.selectedMonthName = moment().subtract(this.selectedMonth, 'month').startOf('month').format('MMMM');
    this.setCalender();
  }

  ngOnInit(): void {
    for (let i = 1970; i <= 2070; i++) {
      this.yearList.push(i);
    }

    this.setCurrentDate();

    this.employeeService.getSelectedEmployeeData().pipe(takeUntil(this.destroy$)).subscribe(d=>{
      this.selectedEmployeeData = d;
      this.setCalender();
    });

  }

}
