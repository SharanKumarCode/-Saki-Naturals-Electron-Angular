import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';
import { ISaleTransactions } from '../../core/interfaces/interfaces';

const moment = _moment;

@Component({
  selector: 'app-sales-transaction-dialog',
  templateUrl: './sales-transaction-dialog.component.html',
  styleUrls: ['./sales-transaction-dialog.component.scss']
})
export class SalesTransactionDialogComponent implements OnInit {

  form: FormGroup;
  transactionDate: string;
  totalAmount: number;
  paid: number;
  remarks: string;
  editCreate: string;
  date = new FormControl(moment());

  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<SalesTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private snackbar: MatSnackBar
  ) {
    this.totalAmount = this.data.sellingPrice * this.data.sellingQuantity;
    this.paid = this.data.paid;
    this.remarks = this.data.remarks;
    this.editCreate = this.data.editCreate;
    this.date.setValue = this.data.transactionDate;

    this.form = this.fb.group(
      {
        totalAmount: [{value:this.totalAmount, disabled: true}, [Validators.required]],
        paidAmount: [this.paid, [Validators.required]],
        remarks: [this.remarks]
      }
    );

    this.matIconRegistry
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));

    dialogRef.disableClose = true;
  }

  setFinalTransactionData(): ISaleTransactions{
    const transactionData: ISaleTransactions = {
      transactionDate: this.date.value.toDate(),
      amount: this.form.controls.paidAmount.value,
      remarks: this.form.controls.remarks.value
    };

    return transactionData;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void{
    const {value, valid} = this.form;
    if (valid) {
      const finalTransactionData = this.setFinalTransactionData();
      finalTransactionData.editCreate = 'Create';
      this.dialogRef.close(finalTransactionData);
    }
  }

  onUpdate(): void {
    const {value, valid} = this.form;
    if (valid && value.paidAmount !== 0) {
      const finalTransactionData = this.setFinalTransactionData();
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
