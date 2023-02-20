import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPurchaseData,
          IPurchaseTransactions
        } from '../../core/interfaces/interfaces';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PurchasedbService } from '../../core/services/purchase/purchasedb.service';
import { PurchaseService } from '../../core/services/purchase/purchase.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification/notification.service';
import { PurchaseReturnDialogComponent } from '../../dialogs/purchase-return-dialog/purchase-return-dialog.component';
import {
  SalesPurchaseTransactionDialogComponent
 } from '../../dialogs/sales-purchase-transaction-dialog/sales-purchase-transaction-dialog.component';
import { PromptDialogComponent } from '../../dialogs/prompt-dialog/prompt-dialog.component';
import { EnumPurchaseStatus, EnumTransactionType, EnumRouteActions, EnumTransactionDialogType } from '../../core/interfaces/enums';

@Component({
  selector: 'app-purchase-transaction',
  templateUrl: './purchase-transaction.component.html',
  styleUrls: ['./purchase-transaction.component.scss']
})
export class PurchaseTransactionComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  materialPanelOpenState = false;
  returnPanelOpenState = false;

  selectedPurchaseID: string;
  selectedPurchaseData: IPurchaseData;
  purchaseDetail: any;
  totalPaidAmount = 0;
  balanceAmount = 0;
  totalRefundAmount = 0;
  purchaseStatus: EnumPurchaseStatus;

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private purchaseService: PurchaseService,
    private purchaseDBService: PurchasedbService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService
  ) {

    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));

  }

  setPurchaseStatus(){
    this.purchaseStatus = this.selectedPurchaseData ?
                          this.purchaseService.getPurchaseStatus(this.selectedPurchaseData) : EnumPurchaseStatus.initiated;
  }

  getPurchaseReturnEntriesToBeDeleted(currentPurchaseReturn, prevPurchaseReturn) {
    const purchaseEntriesToBeDeleted = [];
    const currentPurchaseEntryIDs = currentPurchaseReturn.map(d => d.purchaseEntryID);
    const prevPurchaseEntryIDs = prevPurchaseReturn.map(d => d.purchaseEntryID);
    prevPurchaseEntryIDs.forEach(data => {
      if (!currentPurchaseEntryIDs.includes(data)) {
        purchaseEntriesToBeDeleted.push(data);
      }
    });
    return purchaseEntriesToBeDeleted;
  }

  setPurchaseDetails(): void {
    const totPrice = this.purchaseService.getNetPurchasePrice(this.selectedPurchaseData);

    let totSoldQuantity = this.selectedPurchaseData
                            ?.purchaseEntries
                            .filter(d=>d.returnFlag === false).map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0);
    totSoldQuantity -= this.selectedPurchaseData
                ?.purchaseEntries.filter(d=>d.returnFlag === true).map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0);

    this.purchaseDetail = {
      purchaseID: this.selectedPurchaseData?.purchaseID,
      purchaseDate: this.selectedPurchaseData?.purchaseDate,
      clienID: this.selectedPurchaseData?.supplier.clientID,
      clientName: this.selectedPurchaseData?.supplier.clientName,
      totalSoldQuantity: totSoldQuantity,
      totalPrice: totPrice,
      overallDiscountPercentage: this.selectedPurchaseData?.overallDiscountPercentage,
      gstPercentage: this.selectedPurchaseData?.gstPercentage,
      transportCharges: this.selectedPurchaseData?.transportCharges,
      miscCharges: this.selectedPurchaseData?.miscCharges,
      paymentTerms: this.selectedPurchaseData?.paymentTerms,
      remarks: this.selectedPurchaseData?.remarks,
      materialList: this.selectedPurchaseData?.purchaseEntries.filter(d=>d.returnFlag === false).map(d=>({
        materialName: d.material.materialName,
          price: d.price,
          quantity: d.quantity,
          amount: d.price * d.quantity
        })),
      returnedMaterialList: this.selectedPurchaseData?.purchaseEntries.filter(d=>d.returnFlag === true).map(d=>({
        materialName: d.material.materialName,
        price: d.price,
        quantity: d.quantity,
        amount: d.price * d.quantity
      }))
    };
    this.setTotalAmounts();
  }

  setTotalAmounts(): void {
    this.totalPaidAmount = this.selectedPurchaseData.purchaseTransactions
                                .filter(d=>d.transactionType !== EnumTransactionType.refund)
                                .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
    this.totalRefundAmount = this.selectedPurchaseData.purchaseTransactions
                                .filter(d=>d.transactionType === EnumTransactionType.refund)
                                .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
    this.balanceAmount = this.purchaseDetail.totalPrice + this.totalRefundAmount - this.totalPaidAmount;
  }

  openAddTransactionDialog(): void {

    if (this.selectedPurchaseData.completedDate || this.selectedPurchaseData.cancelledDate) {
      const message = `Unable to make changes as Purchase is marked as ${this.selectedPurchaseData.completedDate
                        ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    console.log('INFO : Opening dialog box add transaction');
    const dialogRef = this.dialog.open(SalesPurchaseTransactionDialogComponent, {
      width: '50%',
      data: {
        editCreate: 'Create',
        dialogType: EnumTransactionDialogType.purchase,
        totalPrice: this.purchaseDetail.totalPrice,
        paid: 0,
        remarks: '',
        transactionDate: '',
        purchaseDate: this.selectedPurchaseData.purchaseDate,
        returnDate: this.selectedPurchaseData.returnedDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      if (result){
        const purchaseTransactionData: IPurchaseTransactions = {
          transactionDate: result.transactionDate,
          transactionType: result.transactionType,
          transactionAmount: result.transactionAmount,
          remarks: result.remarks,
          purchase: this.selectedPurchaseData
        };

        this.purchaseDBService.insertPurchaseTransaction(purchaseTransactionData)
        .then(_=>{
          console.log('INFO: Created new purchase transaction data');
          this.onRefresh();
        })
        .catch(err=>{
          console.log(err);
        });
      }
    });
  }

  openEditPurchaseDialog(): void {
    this.router.navigate(['purchase/add_update_purchase',
                        EnumRouteActions.update,
                         this.selectedPurchaseData.purchaseID]);
  }

  onUpdatePurchase(){
    if (this.selectedPurchaseData.completedDate || this.selectedPurchaseData.cancelledDate) {
      const message = `Unable to make changes as Purchase is marked as ${this.selectedPurchaseData.completedDate
                      ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    this.openEditPurchaseDialog();
  }

  onDeletePurchase(){
    if (this.selectedPurchaseData.completedDate || this.selectedPurchaseData.cancelledDate) {
      const message = `Unable to make changes as Purchase is marked as ${this.selectedPurchaseData.completedDate
                      ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    this.purchaseDBService.deletePurchase(this.selectedPurchaseID)
    .then(_=>{
      console.log('INFO: Deleted purchase');
      this.onBack();
    })
    .catch(err=>{
      console.log(err);
    });

  }

  onInitiateReturn() {

    if (this.selectedPurchaseData.completedDate || this.selectedPurchaseData.cancelledDate) {
      const message = `Unable to make changes as Purchase is marked as ${this.selectedPurchaseData.completedDate
                        ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    if (!this.selectedPurchaseData.deliveredDate){
      this.notificationService.updateSnackBarMessageSubject('Cannot initiate RETURN without completion of Delivery');
      return;
    }

    console.log('INFO : Opening dialog box initital return');
    const dialogRef = this.dialog.open(PurchaseReturnDialogComponent, {
      width: '50%',
      height: 'auto',
      data: {
        data: this.selectedPurchaseData.purchaseEntries.filter(d=>d.returnFlag === false),
        purchaseDate: this.selectedPurchaseData.purchaseDate,
        deliveredDate: this.selectedPurchaseData.deliveredDate,
        editCreateFlag: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        const tmp = {...this.selectedPurchaseData};
        tmp.purchaseEntries = result.purchaseEntries;
        tmp.returnedDate = result.returnedDate.toDate();
        this.updatePurchase(tmp);
      }
    });
  }

  onUpdateCancelReturn(): void {

    if (this.selectedPurchaseData.completedDate || this.selectedPurchaseData.cancelledDate) {
      const message = `Unable to make changes as Purchase is marked as ${this.selectedPurchaseData.completedDate
                      ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    console.log('opening dialog box edit/delete transaction..');
    const returnDataEntries = this.selectedPurchaseData.purchaseEntries.filter(d=>d.returnFlag === true);
    const dialogRef = this.dialog.open(PurchaseReturnDialogComponent, {
      width: '50%',
      height: 'auto',
      data: {
        data: this.selectedPurchaseData.purchaseEntries.filter(d=>d.returnFlag === false),
        returnData: returnDataEntries,
        purchaseDate: this.selectedPurchaseData.purchaseDate,
        returnedDate: this.selectedPurchaseData.returnedDate,
        deliveredDate: this.selectedPurchaseData.deliveredDate,
        editCreateFlag: 'Edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        if (result.editCreateFlag === 'Edit'){

          const tmpD = {...this.selectedPurchaseData};
          tmpD.purchaseEntries = result.purchaseEntries;
          tmpD.returnedDate = result.returnedDate.toDate();
          const purchaseReturnEntriesToBeDeleted = this.getPurchaseReturnEntriesToBeDeleted(
                                                result.purchaseEntries.filter(d=>d.returnFlag === true), returnDataEntries);
          if (purchaseReturnEntriesToBeDeleted.length > 0) {
              this.purchaseDBService.deletePurchaseEntry(purchaseReturnEntriesToBeDeleted)
              .then(_=>{
                  this.updatePurchase(tmpD);
              })
              .catch(err=>{
                console.log(err);
                this.notificationService.updateSnackBarMessageSubject('Unable to update purchase');
              });
          } else {
            this.updatePurchase(tmpD);
          }
        } else {

          const tmpD = {...this.selectedPurchaseData};
          tmpD.purchaseEntries = this.selectedPurchaseData.purchaseEntries.filter(d=>d.returnFlag === false);
          tmpD.returnedDate = null;
          const purchaseReturnEntriesToBeDeleted = returnDataEntries.map(d=>d.purchaseEntryID);

          if (purchaseReturnEntriesToBeDeleted.length > 0) {
            this.purchaseDBService.deletePurchaseEntry(purchaseReturnEntriesToBeDeleted)
            .then(_=>{
                this.updatePurchase(tmpD);
            })
            .catch(err=>{
              console.log(err);
              this.notificationService.updateSnackBarMessageSubject('Unable to update purchase');
            });
        } else {
          this.updatePurchase(tmpD);
        }
        }
      }
    });
  }

  updatePurchase(data): void {
    this.purchaseDBService.updatePurchase(data)
        .then(_=>{
          this.notificationService.updateSnackBarMessageSubject('Operation successfully');
          this.onRefresh();
        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to Initiate Return');
        });
  }

  onCancelPurchase(){
    if (this.selectedPurchaseData.completedDate) {
      const message = `Unable to make changes as Purchase is marked as COMPLETED`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    const dialogRef = this.dialog.open(PromptDialogComponent, {
      width: '30%',
      height: 'auto',
      data: {
        message: `Are you sure to ${this.selectedPurchaseData.cancelledDate ? 'UNCANCEL' : 'CANCEL'} purchase ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tmp = {...this.selectedPurchaseData};
        tmp.cancelledDate = this.selectedPurchaseData.cancelledDate ? null : new Date();
        this.updatePurchase(tmp);
      }

    });

  }

  onRefresh(){
    this.purchaseDBService.getPurchaseByID(this.selectedPurchaseID);
    this.setPurchaseStatus();
  }

  onBack(){
    this.location.back();
  }

  ngOnInit(): void {
    this.setPurchaseStatus();
    this.selectedPurchaseID = this.purchaseService.getSelectedPurchaseID();
    this.activatedRoute.data.subscribe(data=>{
      this.selectedPurchaseData = data.purchaseData;
      this.setPurchaseDetails();
      this.setPurchaseStatus();
      this.purchaseService.getSelectedPurchaseData().pipe(takeUntil(this.destroy$)).subscribe(d=>{
        this.selectedPurchaseData = d;
        this.setPurchaseDetails();
        this.setPurchaseStatus();
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
