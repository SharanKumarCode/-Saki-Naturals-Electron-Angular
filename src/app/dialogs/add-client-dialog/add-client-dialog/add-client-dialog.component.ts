import { Component, Inject, OnInit } from '@angular/core';
import { IClientData } from '../../../core/interfaces/interfaces';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as countryListJson from '../add-client-dialog/country_list.json';
import { EnumClientType } from '../../../core/interfaces/enums';

export interface IClientTypeSelect {
  value: EnumClientType;
  viewValue: EnumClientType;
}

@Component({
  selector: 'app-add-client-dialog',
  templateUrl: './add-client-dialog.component.html',
  styleUrls: ['./add-client-dialog.component.scss']
})
export class AddClientDialogComponent implements OnInit {
  clientName: string;
  contactPerson: string;
  clientType: EnumClientType;
  clientTypeSelect: IClientTypeSelect[];
  description: string;
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
  editCreate: string;
  form: FormGroup;
  filteredCountryList: Observable<string[]>;
  countryList: string[];
  countryControl = new FormControl('India');


  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<AddClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IClientData,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
  ) {

    this.dialogRef.disableClose = true;
    this.clientName = this.data.clientName;
    this.contactPerson = this.data.contactPerson;
    this.description = this.data.description;
    this.contact1 = this.data.contact1;
    this.contact2 = this.data.contact2;
    this.landline = this.data.landline;
    this.addressLine1 = this.data.addressLine1;
    this.addressLine2 = this.data.addressLine2;
    this.city = this.data.city;
    this.state = this.data.state;
    this.country = this.data.country;
    this.pincode = this.data.pincode;
    this.email = this.data.email;
    this.remarks = this.data.remarks;
    this.editCreate = this.data.editCreate;
    this.countryList = [];

    this.clientTypeSelect = [
      {
        value: EnumClientType.customer,
        viewValue: EnumClientType.customer
      },
      {
        value: EnumClientType.supplier,
        viewValue: EnumClientType.supplier
      }
    ];

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
        clientName: [this.clientName, [Validators.required, Validators.maxLength(30)]],
        contactPerson: [this.contactPerson, [Validators.required, Validators.maxLength(50)]],
        clientType: [this.clientType, [Validators.required]],
        description: [this.description, [Validators.required, Validators.maxLength(100)]],
        contact1: [this.contact1, [Validators.required, Validators.maxLength(15)]],
        contact2: [this.contact2, [Validators.maxLength(15)]],
        landline: [this.landline, [Validators.maxLength(15)]],
        addressLine1: [this.addressLine1, [Validators.required, Validators.maxLength(100)]],
        addressLine2: [this.addressLine2, [Validators.maxLength(100)]],
        city: [this.city, [Validators.required, Validators.maxLength(50)]],
        state: [this.state, [Validators.required, Validators.maxLength(50)]],
        pincode: [this.pincode, [Validators.required, Validators.maxLength(6)]],
        email: [this.email],
        remarks: [this.remarks, [Validators.maxLength(100)]],
      }

    );

    if (this.editCreate === 'Edit'){
      this.form.controls.clientType.setValue(this.data.clientType);
      this.countryControl.setValue(this.data.country);
    }

    this.matIconRegistry
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'));

   }

  onSave(): void {
    const {value, valid} = this.form;
    const countryValid = this.countryControl.valid;
    if (valid && countryValid) {
      const finalClientData = value;
      finalClientData.country = this.countryControl.value;
      this.dialogRef.close(finalClientData);
    }
  }

  onUpdate(): void {
    const {value, valid} = this.form;
    const countryValid = this.countryControl.valid;
    if (valid && countryValid) {
      const finalClientData = value;
      finalClientData.clientID = this.data.clientID;
      finalClientData.country = this.countryControl.value;
      finalClientData.editCreate = 'Edit';
      this.dialogRef.close(finalClientData);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.filteredCountryList = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCountryFunc(value || '')),
    );
  }

  private filterCountryFunc(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countryList.filter(option => option.toLowerCase().includes(filterValue));
  }

}
