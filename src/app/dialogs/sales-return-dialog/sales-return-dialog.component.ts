import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


import * as _moment from 'moment';
import {
  ISaleEntry } from '../../core/interfaces/interfaces';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../core/services/notification/notification.service';

const moment = _moment;

interface IProductGroupAndProductNameList{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sales-return-dialog',
  templateUrl: './sales-return-dialog.component.html',
  styleUrls: ['./sales-return-dialog.component.scss'],
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})
export class SalesReturnDialogComponent implements OnInit {

  formSaleReturnEntry: FormGroup;
  date = new FormControl();
  minReturnDate: Date;

  returnQuantity: number;
  productGroupAndProductNameList: IProductGroupAndProductNameList[];

  editCreate: string;
  addSaleReturnEntryFlag = false;
  addSaleReturnEntries: ISaleEntry[];
  returnQuantityMaxValue = 1;

  displayedColumnsProductList: string[] = [
    'productGroup',
    'productName',
    'sellingPrice',
    'quantity',
    'discount',
    'amount',
    'action'
  ];

  dataSourceProductList = new MatTableDataSource([]);
  receivedData: any;

  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<SalesReturnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private notificationService: NotificationService
  ) {
    this.editCreate = this.data.editCreateFlag;
    this.productGroupAndProductNameList = [];
    this.data.data.forEach(d=>{
      const tmp = {
        value: d.product.productID,
        viewValue: `${d.product.productGroup.productGroupName} - ${d.product.productName}`
      };
      if (this.productGroupAndProductNameList.length === 0) {
        this.productGroupAndProductNameList = [tmp];
      } else {
        this.productGroupAndProductNameList.push(tmp);

      }
    });

    this.formSaleReturnEntry = this.fb.group(
      {
        productGroupAndProductName: ['', [Validators.required]],
        returnQuantity: ['', [Validators.required]],
      }
    );

    this.matIconRegistry
    .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_green_icon.svg'))
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'));

    dialogRef.disableClose = true;

  }

  setTableData() {
    this.dataSourceProductList.data = this.addSaleReturnEntries;
  }

  onProductSelectChange(e): void {
    if (e.isUserInput){
      this.returnQuantityMaxValue = this.data.data.filter(d=>d.product.productID === e.source.value).map(d=>d.quantity)[0];
    }
  }

  onAddSaleReturnEntry(): void {
    const {value, valid} = this.formSaleReturnEntry;
    if (valid) {
      console.log(this.data.data);
      const tmpData = {...this.data.data.filter(d=>d.product.productID === value.productGroupAndProductName)[0]};
      tmpData.quantity = value.returnQuantity;
      const returnFlagData = {
        returnFlag: true
      };
      const tmp = {
        ...tmpData,
        ...returnFlagData
      };
      delete tmp.saleEntryID;

      if (!this.addSaleReturnEntries){
        this.addSaleReturnEntries = [tmp];
      } else {
        const existingSaleReturnEntriesProductIDs = this.addSaleReturnEntries.map(d=>d.product.productID);
        if (existingSaleReturnEntriesProductIDs.includes(value.productGroupAndProductName)){
          this.notificationService.updateSnackBarMessageSubject('Product already exists in entry');
          return;
        }

        this.addSaleReturnEntries.push(tmp);
      }

      this.addSaleReturnEntryFlag = false;
      this.setTableData();
    }
  }

  onSaleReturnEntryCancel(): void {
    this.addSaleReturnEntryFlag = false;
  }

  onDeleteSaleEntry(productID): void {
    this.addSaleReturnEntries = this.addSaleReturnEntries.filter(d => d.product.productID !== productID);
    this.dataSourceProductList.data = this.addSaleReturnEntries;

  }

  onAddProduct(): void {
    this.addSaleReturnEntryFlag = !this.addSaleReturnEntryFlag;
  }

  onSave(): void {
    if (this.addSaleReturnEntries && this.addSaleReturnEntries.length > 0) {
      if (!(this.data.salesDate.getTime() - this.date.value.toDate().getTime() < 0)) {
          this.notificationService.updateSnackBarMessageSubject('Return date cannot be before Sale Initiated date');
      } else {
        const tmp = {
          saleEntries: [
            ...this.addSaleReturnEntries,
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
    if (this.addSaleReturnEntries && this.addSaleReturnEntries.length > 0) {
      if (!(this.data.salesDate.getTime() - new Date(this.date.value.toDate()).getTime() < 0)) {
        this.notificationService.updateSnackBarMessageSubject('Return date cannot be before Sale Initiated date');
        return;
    } else {
      const tmp = {
        saleEntries: [
          ...this.addSaleReturnEntries,
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
      this.addSaleReturnEntries = this.data.returnData;
      this.date.setValue(moment(this.data.returnedDate));
      this.setTableData();
    }
  }

}
