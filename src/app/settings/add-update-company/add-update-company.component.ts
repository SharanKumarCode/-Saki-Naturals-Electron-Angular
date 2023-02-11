import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification.service';
import * as countryListJson from '../../dialogs/add-client-dialog/add-client-dialog/country_list.json';
import { Observable } from 'rxjs';
import { ICompanyData } from '../../core/interfaces/interfaces';
import { CompanydbService } from '../../core/services/settings/companydb.service';

@Component({
  selector: 'app-add-update-company',
  templateUrl: './add-update-company.component.html',
  styleUrls: ['./add-update-company.component.scss']
})
export class AddUpdateCompanyComponent implements OnInit {

  componentBehaviourFlag: boolean;
  companyName: string;
  proprietorName: string;
  gstinNumber: string;
  msmeNumber: string;
  contact1: string;
  contact2: string;
  landline: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  email: string;
  remarks: string;

  filteredCountryList: Observable<string[]>;
  countryList: string[];
  countryControl = new FormControl('India');

  selectedCompanyData: ICompanyData ;

  form: FormGroup;
  private path = 'assets/icon/';

  constructor(
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private notificationService: NotificationService,
    private companyDBservice: CompanydbService,
    private location: Location,
    private activateRoute: ActivatedRoute
  ) {
    this.countryList = [];

    for (const key in countryListJson) {
      if (Object.prototype.hasOwnProperty.call(countryListJson, key)) {
        const element = countryListJson[key];
        if (element.country !== undefined) {
          this.countryList.push(element.country);
        }
      }
    }

    this.form = this.fb.group(
      {
        companyName: [this.companyName, [Validators.required]],
        proprietorName: [this.proprietorName, [Validators.required]],
        gstinNumber: [this.gstinNumber, [Validators.required]],
        msmeNumber: [this.msmeNumber, [Validators.required]],
        contact1: [this.contact1, [Validators.required]],
        contact2: [this.contact2],
        landline: [this.landline],
        addressLine1: [this.addressLine1, [Validators.required]],
        addressLine2: [this.addressLine2],
        city: [this.city, [Validators.required]],
        state: [this.state, [Validators.required]],
        pincode: [this.pincode, [Validators.required]],
        email: [this.email],
        remarks: [this.remarks, [Validators.maxLength(100)]]
      });

    this.matIconRegistry
    .addSvgIcon('back', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'));
  }

  getFormCompanyData(): ICompanyData {
    const {value} = this.form;
    return {
      companyID: this.selectedCompanyData.companyID,
      companyName: value.companyName,
      proprietor: value.proprietorName,
      gstNumber: value.gstinNumber,
      msmeNumber: value.msmeNumber,
      contact1: value.contact1,
      contact2: value.contact2,
      landline: value.landline,
      email: value.email,
      addressLine1: value.addressLine1,
      addressLine2: value.addressLine2,
      city: value.city,
      state: value.state,
      country: this.countryControl.value,
      pincode: value.pincode,
      remarks: value.remarks
    };
  }

  setCompanyData(): void {
    this.form.controls.companyName.setValue(this.selectedCompanyData.companyName);
    this.form.controls.proprietorName.setValue(this.selectedCompanyData.proprietor);
    this.form.controls.gstinNumber.setValue(this.selectedCompanyData.gstNumber);
    this.form.controls.msmeNumber.setValue(this.selectedCompanyData.msmeNumber);
    this.form.controls.contact1.setValue(this.selectedCompanyData.contact1);
    this.form.controls.contact2.setValue(this.selectedCompanyData.contact2);
    this.form.controls.landline.setValue(this.selectedCompanyData.landline);
    this.form.controls.addressLine1.setValue(this.selectedCompanyData.addressLine1);
    this.form.controls.addressLine2.setValue(this.selectedCompanyData.addressLine2);
    this.form.controls.city.setValue(this.selectedCompanyData.city);
    this.form.controls.state.setValue(this.selectedCompanyData.state);
    this.form.controls.pincode.setValue(this.selectedCompanyData.pincode);
    this.form.controls.email.setValue(this.selectedCompanyData.email);
    this.form.controls.remarks.setValue(this.selectedCompanyData.remarks);
    this.countryControl.setValue(this.selectedCompanyData.country);
  }

  onCreateOrUpdateCompany(): void {
    const {valid} = this.form;
    const countryValid = this.countryControl.valid;
    if (valid && countryValid) {
      this.companyDBservice.updateCompany(this.getFormCompanyData())
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('Succesfully updated Company Data');
      })
      .catch(err=>{
        console.log(err);
        this.notificationService.updateSnackBarMessageSubject('Unable to update Company Data');
      });
    }
  }

  onBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.componentBehaviourFlag = false;
    this.activateRoute.data.subscribe(data=>{
      this.selectedCompanyData = data.companyData;
      if (data.companyData.companyName === '-') {
        this.componentBehaviourFlag = true;
      } else {
        this.setCompanyData();
      }
    });
  }

}
