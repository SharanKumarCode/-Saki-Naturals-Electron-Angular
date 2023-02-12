import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITransactionTypeData } from '../../core/interfaces/interfaces';
import { EnumTransactionGroup } from '../../core/interfaces/enums';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { TransactiondbService } from '../../core/services/transaction/transactiondb.service';
import { TransactionService } from '../../core/services/transaction/transaction.service';
import { NotificationService } from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-transaction-type-dialog',
  templateUrl: './transaction-type-dialog.component.html',
  styleUrls: ['./transaction-type-dialog.component.scss']
})
export class TransactionTypeDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;

  transactionTypeList: ITransactionTypeData[];
  transactionGroupList: EnumTransactionGroup[];
  selectedValue: string;
  transactionGroup: string;
  transactionName: string;

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<TransactionTypeDialogComponent>,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private notificationService: NotificationService,
    private transactionDBservice: TransactiondbService,
    private transactionService: TransactionService
  ) {

    this.dialogRef.disableClose = true;
    this.form = this.fb.group(
      {
        transactionGroup: [this.transactionGroup, [Validators.required]],
        transactionName: [this.transactionName, [Validators.required, Validators.maxLength(100)]],
      }
    );

    this.matIconRegistry
    .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));
  }

  onAddTransactionType() {
    const {value, valid} = this.form;
    const transactionGroupNameExistFlag = this.transactionTypeList ?
                                      this.transactionTypeList.findIndex(
                                        item=>
                                        `${item.transactionGroup.toLowerCase()} - ${item.transactionName.toLocaleLowerCase()}`
                                        === `${value.transactionGroup.toLowerCase()} - ${value.transactionName.toLocaleLowerCase()}`)
                                      : -1;
    if (valid){
      if (transactionGroupNameExistFlag === -1){
        this.transactionDBservice.insertTransactionType({
          transactionGroup: value.transactionGroup,
          transactionName: value.transactionName
        });
      } else {
        this.notificationService.updateSnackBarMessageSubject('Product group name already exists');
      }

    }
  }

  onDeleteTransactionType(selectedTransactionTypeID: string) {
    this.transactionDBservice.deleteTransactionType(selectedTransactionTypeID);
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.transactionGroupList = [
      EnumTransactionGroup.expense,
      EnumTransactionGroup.income
    ];

    this.transactionDBservice.getAllTransactionTypes();
    this.transactionService.getTransactionTypeList().pipe(takeUntil(this.destroy$)).subscribe(transactionTypeData=>{
      this.transactionTypeList = transactionTypeData;
      this.transactionTypeList.sort((a,b)=>{
        const textA = a.transactionGroup.toUpperCase();
        const textB = b.transactionGroup.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
