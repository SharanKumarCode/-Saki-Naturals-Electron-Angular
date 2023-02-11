import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';
import { ISaleTransactions } from '../../core/interfaces/interfaces';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EnumTransactionDialogType, EnumTransactionType } from '../../core/interfaces/enums';

const moment = _moment;

@Component({
  selector: 'app-sales-transaction-dialog',
  templateUrl: './sales-purchase-transaction-dialog.component.html',
  styleUrls: ['./sales-purchase-transaction-dialog.component.scss']
})
export class SalesPurchaseTransactionDialogComponent implements OnInit {

  form: FormGroup;
  dialogType: EnumTransactionDialogType;
  transactionDate: Date;
  transactionTime: string;
  totalPrice: number;
  transactionAmount: number;
  transactionTypeList = [EnumTransactionType.advance, EnumTransactionType.paid];
  selectedTransactionType: EnumTransactionType;
  remarks: string;
  editCreate: string;
  minTransactionDate: Date;

  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<SalesPurchaseTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private notificationService: NotificationService
  ) {
    this.dialogType = this.data.dialogType;
    this.totalPrice = this.data.dialogType === EnumTransactionDialogType.salary ? this.data.salary : this.data.totalPrice;
    this.transactionAmount = this.data.transactionAmount;
    this.remarks = this.data.remarks;
    this.editCreate = this.data.editCreate;
    this.transactionTime = this.data.transactionTime;
    this.transactionDate = this.data.transactionDate;
    this.selectedTransactionType = this.data.transactionType;

    this.form = this.fb.group(
      {
        totalPrice: [{value:this.totalPrice, disabled: true}, [Validators.required]],
        transactionAmount: [this.transactionAmount, [Validators.required]],
        remarks: [this.remarks],
        transactionDate: [this.transactionDate, [Validators.required]],
        transactionTime: [this.transactionTime, [Validators.required]],
        transactionType: [this.selectedTransactionType, [Validators.required]]
      }
    );

    this.matIconRegistry
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));

    dialogRef.disableClose = true;
  }

  setFinalTransactionData(): ISaleTransactions{
    const {value} = this.form;
    let transactionDate = value.transactionDate;
    if ('year' in transactionDate){
      transactionDate = transactionDate.toDate();
    }
    const transactionTime = value.transactionTime.split(':');
    const transactionDateTime = new Date( transactionDate.getFullYear(),
                                          transactionDate.getMonth(),
                                          transactionDate.getDate(),
                                          parseInt(transactionTime[0], 10),
                                          parseInt(transactionTime[1], 10));
    const transactionData: ISaleTransactions = {
      transactionDate: transactionDateTime,
      transactionAmount: value.transactionAmount,
      transactionType: value.transactionType,
      remarks: value.remarks
    };

    return transactionData;
  }

  ngOnInit(): void {
    this.minTransactionDate = moment(this.data.salesDate).toDate();
    if (this.data.returnDate) {
      this.transactionTypeList = [EnumTransactionType.advance, EnumTransactionType.paid, EnumTransactionType.refund];
    }

    if (this.dialogType === EnumTransactionDialogType.salary) {
      this.minTransactionDate = null;
      this.transactionTypeList = [EnumTransactionType.salary, EnumTransactionType.advance];
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void{
    const {value, valid} = this.form;
    if (this.data.returnDate && value.transactionType === EnumTransactionType.refund) {
      const transacDate = moment(value.transactionDate).toDate().getTime();
      const returnedDate = moment(this.data.returnDate).toDate().getTime();
      if (transacDate - returnedDate < 0){
        this.notificationService.updateSnackBarMessageSubject('Refund Transaction date cannot be before Return Date');
        return;
      }
    }

    if (valid) {
      const finalTransactionData = this.setFinalTransactionData();
      finalTransactionData.editCreate = 'Create';
      this.dialogRef.close(finalTransactionData);
    }
  }

  onUpdate(): void {
    const {value, valid} = this.form;

    if (this.data.returnDate && value.transactionType === EnumTransactionType.refund) {
      const transacDate = moment(value.transactionDate).toDate().getTime();
      const returnedDate = moment(this.data.returnDate).toDate().getTime();
      if (transacDate - returnedDate < 0){
        this.notificationService.updateSnackBarMessageSubject('Refund Transaction date cannot be before Return Date');
        return;
      }
    }

    if (valid && value.paidAmount !== 0) {
      const finalTransactionData = this.setFinalTransactionData();
      finalTransactionData.transactionID = this.data.transactionID;
      finalTransactionData.editCreate = 'Edit';
      this.dialogRef.close(finalTransactionData);
    }
  }

  onDelete(): void{
    this.dialogRef.close({
      transactionID: this.data.transactionID,
      editCreate: 'Delete'
    });
  }

}
