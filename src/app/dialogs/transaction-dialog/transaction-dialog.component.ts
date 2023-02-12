import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EnumTransactionGroup } from '../../core/interfaces/enums';
import { ITransactionEntry, ITransactionTypeData } from '../../core/interfaces/interfaces';
import { TransactionService } from '../../core/services/transaction/transaction.service';
import { Subject, takeUntil } from 'rxjs';
import { TransactiondbService } from '../../core/services/transaction/transactiondb.service';

const moment = _moment;

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;
  transactionDate: Date;
  transactionAmount: number;
  transactionTypeList: ITransactionTypeData[];
  transactionGroupList = [];
  transactionTypeFilteredList = [];
  selectedTransactionType: string;
  selectedTransactionGroup: string;
  selectedTransactionTypeID: string;
  remarks: string;
  editCreate: string;

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private transactionService: TransactionService,
    private transactionDBservice: TransactiondbService,
    private notificationService: NotificationService
  ) {
    this.transactionAmount = this.data.transactionAmount;
    this.remarks = this.data.remarks;
    this.editCreate = this.data.editCreate;
    this.transactionDate = this.data.transactionDate;
    this.selectedTransactionGroup = this.data?.transactionType?.transactionGroup;
    this.selectedTransactionType = this.data?.transactionType?.transactionName;
    this.selectedTransactionTypeID = this.data?.transactionType?.transactionTypeID;

    this.form = this.fb.group(
      {
        transactionAmount: [this.transactionAmount, [Validators.required]],
        remarks: [this.remarks],
        transactionDate: [this.transactionDate, [Validators.required]],
        transactionType: [this.selectedTransactionType, [Validators.required]],
        transactionGroup: [this.selectedTransactionGroup, [Validators.required]],
      }
    );

    this.matIconRegistry
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));

    dialogRef.disableClose = true;
   }

   setFinalTransactionData(): ITransactionEntry{
    const {value} = this.form;
    let transactionDate = value.transactionDate;
    if ('year' in transactionDate){
      transactionDate = transactionDate.toDate();
    }
    const transactionDateTime = new Date( transactionDate.getFullYear(),
                                          transactionDate.getMonth(),
                                          transactionDate.getDate());
    const transactionData: ITransactionEntry = {
      transactionDate: transactionDateTime,
      transactionAmount: value.transactionAmount,
      transactionType: {
        transactionTypeID: this.selectedTransactionTypeID,
        transactionGroup: value.transactionGroup,
        transactionName: value.transactionType
      },
      remarks: value.remarks
    };

    return transactionData;
  }

  onTransactionGroupChange(e): void {
    if (e.isUserInput) {
      this.transactionTypeFilteredList = this.transactionTypeList
                                         .filter(data => data.transactionGroup === e.source.value)
                                         .map(data=>data.transactionName);
    }
  }

  onTransactionTypeChange(e): void {
    if (e.isUserInput) {
      this.selectedTransactionTypeID = this.transactionTypeList
                                         .filter(data => data.transactionGroup === this.form.controls.transactionGroup.value &&
                                          data.transactionName === e.source.value)
                                         .map(data=>data.transactionTypeID)[0];
    }
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
      finalTransactionData.transactionEntryID = this.data.transactionEntryID;
      finalTransactionData.editCreate = 'Edit';
      this.dialogRef.close(finalTransactionData);
    }
  }

  onDelete(): void{
    this.dialogRef.close({
      transactionEntryID: this.data.transactionEntryID,
      editCreate: 'Delete'
    });
  }

  ngOnInit(): void {
    this.transactionDBservice.getAllTransactionTypes();
    this.transactionService.getTransactionTypeList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
      data.forEach(e=>{
        if (this.transactionTypeList) {
          this.transactionTypeList.push(e);
        } else {
          this.transactionTypeList = [e];
        }

        if (!this.transactionGroupList.includes(e.transactionGroup)) {
          this.transactionGroupList.push(e.transactionGroup);
        }
      });

    this.onTransactionGroupChange({
        isUserInput: true,
        source: {
          value: this.selectedTransactionGroup
        }
      });

    this.form.controls.transactionType.setValue(this.selectedTransactionType);

    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
