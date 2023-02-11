import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';
import { IPurchaseEntry } from '../../core/interfaces/interfaces';
import { NotificationService } from '../../core/services/notification/notification.service';

const moment = _moment;

interface IMaterialNameList{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-purchase-return-dialog',
  templateUrl: './purchase-return-dialog.component.html',
  styleUrls: ['./purchase-return-dialog.component.scss'],
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})
export class PurchaseReturnDialogComponent implements OnInit {

  formPurchaseReturnEntry: FormGroup;
  date = new FormControl();
  minReturnDate: Date;

  returnQuantity: number;
  materialNameList: IMaterialNameList[];

  editCreate: string;
  addPurchaseReturnEntryFlag = false;
  addPurchaseReturnEntries: IPurchaseEntry[];
  returnQuantityMaxValue = 1;

  displayedColumnsMaterialList: string[] = [
    'materialName',
    'netPrice',
    'quantity',
    'amount',
    'action'
  ];

  dataSourceMaterialList = new MatTableDataSource([]);
  receivedData: any;

  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<PurchaseReturnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private notificationService: NotificationService
  ) {
    this.editCreate = this.data.editCreateFlag;
    this.materialNameList = [];
    this.data.data.forEach(d=>{
      const tmp = {
        value: d.material.materialID,
        viewValue: `${d.material.materialName}`
      };
      if (this.materialNameList.length === 0) {
        this.materialNameList = [tmp];
      } else {
        this.materialNameList.push(tmp);

      }
    });

    this.formPurchaseReturnEntry = this.fb.group(
      {
        materialName: ['', [Validators.required]],
        returnQuantity: ['', [Validators.required]],
      }
    );

    this.matIconRegistry
    .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_green_icon.svg'))
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'));

    dialogRef.disableClose = true;

  }

  setTableData() {
    this.dataSourceMaterialList.data = this.addPurchaseReturnEntries;
  }

  onMaterialSelectChange(e): void {
    if (e.isUserInput){
      this.returnQuantityMaxValue = this.data.data.filter(d=>d.material.materialID === e.source.value).map(d=>d.quantity)[0];
    }
  }

  onAddPurchaseReturnEntry(): void {
    const {value, valid} = this.formPurchaseReturnEntry;
    if (valid) {
      const tmpData = {...this.data.data.filter(d=>d.material.materialID === value.materialName)[0]};
      tmpData.quantity = value.returnQuantity;
      tmpData.discountPercentage = 0;
      const returnFlagData = {
        returnFlag: true
      };
      const tmp = {
        ...tmpData,
        ...returnFlagData
      };
      delete tmp.purchaseEntryID;

      if (!this.addPurchaseReturnEntries){
        this.addPurchaseReturnEntries = [tmp];
      } else {
        const existingPurchaseReturnEntriesMaterialIDs = this.addPurchaseReturnEntries.map(d=>d.material.materialID);
        if (existingPurchaseReturnEntriesMaterialIDs.includes(value.materialName)){
          this.notificationService.updateSnackBarMessageSubject('Material already exists in entry');
          return;
        }

        this.addPurchaseReturnEntries.push(tmp);
      }

      this.addPurchaseReturnEntryFlag = false;
      this.setTableData();
    }
  }

  onPurchaseReturnEntryCancel(): void {
    this.addPurchaseReturnEntryFlag = false;
  }

  onDeletePurchaseEntry(materialID): void {
    this.addPurchaseReturnEntries = this.addPurchaseReturnEntries.filter(d => d.material.materialID !== materialID);
    this.dataSourceMaterialList.data = this.addPurchaseReturnEntries;

  }

  onAddMaterial(): void {
    this.addPurchaseReturnEntryFlag = !this.addPurchaseReturnEntryFlag;
  }

  onSave(): void {
    if (this.addPurchaseReturnEntries && this.addPurchaseReturnEntries.length > 0) {
      if (!(this.data.purchaseDate.getTime() - this.date.value.toDate().getTime() < 0)) {
          this.notificationService.updateSnackBarMessageSubject('Return date cannot be before Purchase Initiated date');
      } else {
        const tmp = {
          purchaseEntries: [
            ...this.addPurchaseReturnEntries,
          ...this.data.data
        ],
          returnedDate: this.date.value,
          editCreateFlag: this.editCreate
        };
        this.dialogRef.close(tmp);
      }
      }
  }

  onUpdate(): void {
    if (this.addPurchaseReturnEntries && this.addPurchaseReturnEntries.length > 0) {
      if (!(this.data.purchaseDate.getTime() - new Date(this.date.value.toDate()).getTime() < 0)) {
        this.notificationService.updateSnackBarMessageSubject('Return date cannot be before Purchase Initiated date');
        return;
    } else {
      const tmp = {
        purchaseEntries: [
          ...this.addPurchaseReturnEntries,
        ...this.data.data
      ],
        returnedDate: this.date.value,
        editCreateFlag: this.editCreate
      };
      this.dialogRef.close(tmp);
    }
    }
  }

  onCancel(): void {
    this.dialogRef.close({
      editCreateFlag: 'Delete'
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.minReturnDate = this.data.deliveredDate;
    this.date.setValue(moment(this.data.deliveredDate));
    if (this.editCreate === 'Edit') {
      this.addPurchaseReturnEntries = this.data.returnData;
      this.date.setValue(moment(this.data.returnedDate));
      this.setTableData();
    }
  }

}
