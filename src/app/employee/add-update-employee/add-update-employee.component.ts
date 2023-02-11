import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IEmployeeData } from '../../core/interfaces/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification.service';
import * as moment from 'moment';
import { EmployeedbService } from '../../core/services/employee/employeedb.service';
import { EnumGender, EnumSalaryFrequency, EnumRouteActions } from '../../core/interfaces/enums';

@Component({
  selector: 'app-add-update-employee',
  templateUrl: './add-update-employee.component.html',
  styleUrls: ['./add-update-employee.component.scss']
})
export class AddUpdateEmployeeComponent implements OnInit {

  componentBehaviourFlag: boolean;
  selectedEmployeeData: IEmployeeData;

  employeeID: string;
  employeeName: string;
  role: string;
  dob: Date;
  aadhar: string;
  gender: EnumGender;
  salary: number;
  salaryFrequency: EnumSalaryFrequency;
  contact1: string;
  contact2: string;
  address: string;
  email: string;
  remarks: string;
  editCreate: string;
  joiningDate: Date;
  exitDate: Date;
  employeeExitFlag: boolean;
  age: number;
  maxDate = moment();

  genders = [
    EnumGender.male,
    EnumGender.female,
    EnumGender.others
  ];

  salaryFrequencyList = [
    EnumSalaryFrequency.monthly,
    EnumSalaryFrequency.weekly,
    EnumSalaryFrequency.others
  ];

  form: FormGroup;
  private path = 'assets/icon/';

  constructor(
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private employeeDBservice: EmployeedbService,
    private notificationService: NotificationService,
    private location: Location,
    private activateRoute: ActivatedRoute
  ) {

    this.form = this.fb.group({
      employeeName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      aadhar: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      salary: [0, [Validators.required]],
      salaryFrequency: ['', [Validators.required]],
      contact1: ['', [Validators.required]],
      contact2: ['', [Validators.required]],
      address: ['', [Validators.required]],
      joiningDate: ['', [Validators.required]],
      exitDate: ['', [Validators.required]],
      email: [''],
      remarks: [''],
      employeeExitFlag: [false]
    });

    this.form.controls.exitDate.disable(this.form.value.employeeExitFlag);

    this.matIconRegistry
    .addSvgIcon('back', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'));
  }

  setEmployeeData(): void {
    console.log(this.selectedEmployeeData);
    this.form.controls.employeeName.setValue(this.selectedEmployeeData.employeeName);
    this.form.controls.role.setValue(this.selectedEmployeeData.role);
    this.form.controls.dob.setValue(this.selectedEmployeeData.dob);
    this.form.controls.aadhar.setValue(this.selectedEmployeeData.aadhar);
    this.form.controls.gender.setValue(this.selectedEmployeeData.gender);
    this.form.controls.salary.setValue(this.selectedEmployeeData.salary);
    this.form.controls.salaryFrequency.setValue(this.selectedEmployeeData.salaryFrequency);
    this.form.controls.contact1.setValue(this.selectedEmployeeData.contact1);
    this.form.controls.contact2.setValue(this.selectedEmployeeData.contact2);
    this.form.controls.address.setValue(this.selectedEmployeeData.address);
    this.form.controls.joiningDate.setValue(this.selectedEmployeeData.joiningDate);
    this.form.controls.exitDate.setValue(this.selectedEmployeeData.exitDate);
    this.form.controls.email.setValue(this.selectedEmployeeData.email);
    this.form.controls.remarks.setValue(this.selectedEmployeeData.remarks);
  }

  onExitFlagChange(): void {
    if (this.form.value.employeeExitFlag) {
      this.form.controls.exitDate.enable();
    } else {
      this.form.controls.exitDate.disable();
    }
  }

  onDOBChange(): void {
    this.age = moment().diff(this.form.value.dob, 'years');
  }

  onCreateEmployee(): void {
    const {value, valid} = this.form;
    if (valid) {
      const employeeData: IEmployeeData = {
        employeeName: value.employeeName,
        role: value.role,
        dob: value.dob?.toString(),
        aadhar: value.aadhar,
        gender: value.gender,
        salary: value.salary,
        salaryFrequency: value.salaryFrequency,
        contact1: value.contact1,
        contact2: value.contact2,
        address: value.address,
        joiningDate: value.joiningDate?.toString(),
        exitDate: value.exitDate?.toString(),
        email: value.email,
        remarks: value.remarks,
      };

      this.employeeDBservice.insertEmployee(employeeData)
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('Employee created successfully');
      })
      .catch(err=>{
        this.notificationService.updateSnackBarMessageSubject('Unable to Create Employee');
        console.log(err);
      });
    }
  }

  onUpdateEmployee(): void {
    const {value, valid} = this.form;
    if (valid) {
      const employeeData: IEmployeeData = {
        employeeID: this.selectedEmployeeData.employeeID,
        employeeName: value.employeeName,
        role: value.role,
        dob: value.dob?.toString(),
        aadhar: value.aadhar,
        gender: value.gender,
        salary: value.salary,
        salaryFrequency: value.salaryFrequency,
        contact1: value.contact1,
        contact2: value.contact2,
        address: value.address,
        joiningDate: value.joiningDate?.toString(),
        exitDate: value.exitDate?.toString(),
        email: value.email,
        remarks: value.remarks,
      };

      this.employeeDBservice.updateEmployee(employeeData)
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('Employee Updated successfully');
      })
      .catch(err=>{
        this.notificationService.updateSnackBarMessageSubject('Unable to Updat Employee');
        console.log(err);
      });
    }
  }

  onBack(): void {
    this.location.back();
  }

  setRandomData(): void {
    this.form.controls.employeeName.setValue('Sharan');
    this.form.controls.role.setValue('admin');
    this.form.controls.dob.setValue(moment('1995-04-24'));
    this.form.controls.aadhar.setValue('987654659875');
    this.form.controls.gender.setValue(EnumGender.male);
    this.form.controls.salary.setValue(30000);
    this.form.controls.salaryFrequency.setValue(EnumSalaryFrequency.monthly);
    this.form.controls.contact1.setValue('8897568951');
    this.form.controls.contact2.setValue('9966558865');
    this.form.controls.address.setValue('14, JDIJ Nagar, Adwd Palayam, COimbatore 641031');
    this.form.controls.joiningDate.setValue(moment('2023-01-28'));
    this.form.controls.email.setValue('sharan@gmail.com');
    this.form.controls.remarks.setValue('test employee data');

  }

  ngOnInit(): void {
    // this.setRandomData();
    this.activateRoute.params.subscribe(params => {
      this.componentBehaviourFlag = params.createOrUpdate === EnumRouteActions.create ? true : false;

      if (params.createOrUpdate === EnumRouteActions.update) {
        this.activateRoute.data.subscribe(e=>{
          this.selectedEmployeeData = e.employeeData;
          this.setEmployeeData();
        });
      }

    });

  }

}
