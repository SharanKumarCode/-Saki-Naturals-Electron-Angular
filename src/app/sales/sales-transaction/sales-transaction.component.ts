import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ISalesData, ISaleTransactions, EnumRouteActions, EnumTransactionType, EnumSaleStatus } from '../../core/interfaces/interfaces';
import { SalesService } from '../../core/services/sales/sales.service';
import { SalesdbService } from '../../core/services/sales/salesdb.service';
import { SalesTransactionDialogComponent } from '../../dialogs/sales-transaction-dialog/sales-transaction-dialog.component';
import { Subject } from 'rxjs';
import { SalesReturnDialogComponent } from '../../dialogs/sales-return-dialog/sales-return-dialog.component';
import { NotificationService } from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-sales-transaction',
  templateUrl: './sales-transaction.component.html',
  styleUrls: ['./sales-transaction.component.scss']
})
export class SalesTransactionComponent implements OnInit {


  panelOpenState = false;
  productPanelOpenState = false;
  returnPanelOpenState = false;

  selectedSalesID: string;
  selectedSaleData: ISalesData;
  selectedSaleDataSubject: Subject<ISalesData>;
  salesDetail: any;
  totalPaidAmount = 0;
  balanceAmount = 0;
  totalRefundAmount = 0;
  saleStatus: EnumSaleStatus;
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private salesService: SalesService,

    private salesdbService: SalesdbService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {

    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));
  }

  setSaleStatus(){
    this.saleStatus = this.selectedSaleData ? this.salesService.getSaleStatus(this.selectedSaleData) : EnumSaleStatus.initiated;
  }

  getSaleReturnEntriesToBeDeleted(currentSaleReturn, prevSaleReturn) {
    const saleEntriesToBeDeleted = [];
    const currentSalesEntryIDs = currentSaleReturn.map(d => d.saleEntryID);
    const prevSalesEntryIDs = prevSaleReturn.map(d => d.saleEntryID);
    prevSalesEntryIDs.forEach(data => {
      if (!currentSalesEntryIDs.includes(data)) {
        saleEntriesToBeDeleted.push(data);
      }
    });
    return saleEntriesToBeDeleted;
  }

  setSaleDetails(): void {
    let totPrice = this.selectedSaleData
                        ?.saleEntries
                        .filter(d=>d.returnFlag === false).map(d=>d.price * d.quantity).reduce((partialSum, a) => partialSum + a, 0);
    totPrice -= this.selectedSaleData
                ?.saleEntries.filter(d=>d.returnFlag === true).map(d=>d.price * d.quantity).reduce((partialSum, a) => partialSum + a, 0);

    let totSoldQuantity = this.selectedSaleData
                            ?.saleEntries
                            .filter(d=>d.returnFlag === false).map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0);
    totSoldQuantity -= this.selectedSaleData
                ?.saleEntries.filter(d=>d.returnFlag === true).map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0);

    this.salesDetail = {
      saleType: this.selectedSaleData?.saleType,
      saleDate: this.selectedSaleData?.salesDate,
      clienID: this.selectedSaleData?.customer.clientID,
      clientName: this.selectedSaleData?.customer.clientName,
      totalSoldQuantity: totSoldQuantity,
      totalPrice: totPrice,
      overallDiscountPercentage: this.selectedSaleData?.overallDiscountPercentage,
      gstPercentage: this.selectedSaleData?.gstPercentage,
      transportCharges: this.selectedSaleData?.transportCharges,
      miscCharges: this.selectedSaleData?.miscCharges,
      paymentTerms: this.selectedSaleData?.paymentTerms,
      remarks: this.selectedSaleData?.remarks,
      productList: this.selectedSaleData?.saleEntries.filter(d=>d.returnFlag === false).map(d=>({
          productGroupName: d.product.productGroup.productGroupName,
          productName: d.product.productName,
          price: d.price,
          quantity: d.quantity,
          amount: d.price * d.quantity
        })),
      returnedProductList: this.selectedSaleData?.saleEntries.filter(d=>d.returnFlag === true).map(d=>({
        productGroupName: d.product.productGroup.productGroupName,
        productName: d.product.productName,
        price: d.price,
        quantity: d.quantity,
        amount: d.price * d.quantity
      }))
    };
    this.setTotalAmounts();
  }

  setTotalAmounts(): void {
    this.totalPaidAmount = this.selectedSaleData.saleTransactions
                                .filter(d=>d.transactionType !== EnumTransactionType.refund)
                                .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
    this.totalRefundAmount = this.selectedSaleData.saleTransactions
                                .filter(d=>d.transactionType === EnumTransactionType.refund)
                                .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
    this.balanceAmount = this.salesDetail.totalPrice - this.totalPaidAmount - this.totalRefundAmount;
  }

  openAddTransactionDialog(): void {

    if (this.selectedSaleData.completedDate || this.selectedSaleData.cancelledDate) {
      const message = `Unable to make changes as Sale is marked as ${this.selectedSaleData.completedDate ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    console.log('INFO : Opening dialog box add transaction');
    const dialogRef = this.dialog.open(SalesTransactionDialogComponent, {
      width: '50%',
      data: {
        totalPrice: this.salesDetail.totalPrice,
        paid: 0,
        remarks: '',
        editCreate: 'Create',
        transactionDate: '',
        salesDate: this.selectedSaleData.salesDate,
        returnDate: this.selectedSaleData.returnedDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      if (result){
        const saleTransactionData: ISaleTransactions = {
          transactionDate: result.transactionDate,
          transactionType: result.transactionType,
          transactionAmount: result.transactionAmount,
          remarks: result.remarks,
          sales: this.selectedSaleData
        };
        console.log(saleTransactionData);

        this.salesdbService.insertSaleTransaction(saleTransactionData)
        .then(data=>{
          console.log(data);
          console.log('INFO: Created new sale transaction data');
          this.onRefresh();
        })
        .catch(err=>{
          console.log(err);
        });
      }
    });
  }

  openEditSaleDialog(): void {
    this.router.navigate(['sale/add_update_sale',
                        {createOrUpdate: EnumRouteActions.update,
                          selectedSaleData : this.selectedSaleData.salesID}]);
    this.router.navigate(['sale/add_update_sale',
                        EnumRouteActions.update,
                        this.selectedSaleData.salesID]);
  }

  onUpdateSale(){
    if (this.selectedSaleData.completedDate || this.selectedSaleData.cancelledDate) {
      const message = `Unable to make changes as Sale is marked as ${this.selectedSaleData.completedDate ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    this.openEditSaleDialog();
  }

  onDeleteSale(){
    if (this.selectedSaleData.completedDate || this.selectedSaleData.cancelledDate) {
      const message = `Unable to make changes as Sale is marked as ${this.selectedSaleData.completedDate ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    this.salesdbService.deleteSales(this.selectedSalesID)
    .then(_=>{
      console.log('INFO: Deleted sale');
      this.onBack();
    })
    .catch(err=>{
      console.log(err);
    });

  }

  onInitiateReturn() {

    if (this.selectedSaleData.completedDate || this.selectedSaleData.cancelledDate) {
      const message = `Unable to make changes as Sale is marked as ${this.selectedSaleData.completedDate ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    if (!this.selectedSaleData.deliveredDate){
      this.notificationService.updateSnackBarMessageSubject('Cannot initiate RETURN without completion of Delivery');
      return;
    }

    console.log('INFO : Opening dialog box initital return');
    const dialogRef = this.dialog.open(SalesReturnDialogComponent, {
      width: '50%',
      height: 'auto',
      data: {
        data: this.selectedSaleData.saleEntries.filter(d=>d.returnFlag === false),
        salesDate: this.selectedSaleData.salesDate,
        deliveredDate: this.selectedSaleData.deliveredDate,
        editCreateFlag: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        const tmp = {...this.selectedSaleData};
        tmp.saleEntries = result.saleEntries;
        tmp.returnedDate = result.returnedDate.toDate();
        this.updateSales(tmp);
      }
    });
  }

  onUpdateCancelReturn(): void {

    if (this.selectedSaleData.completedDate || this.selectedSaleData.cancelledDate) {
      const message = `Unable to make changes as Sale is marked as ${this.selectedSaleData.completedDate ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    console.log('opening dialog box edit/delete transaction..');
    const returnDataEntries = this.selectedSaleData.saleEntries.filter(d=>d.returnFlag === true);
    const dialogRef = this.dialog.open(SalesReturnDialogComponent, {
      width: '50%',
      height: 'auto',
      data: {
        data: this.selectedSaleData.saleEntries.filter(d=>d.returnFlag === false),
        returnData: returnDataEntries,
        salesDate: this.selectedSaleData.salesDate,
        returnedDate: this.selectedSaleData.returnedDate,
        deliveredDate: this.selectedSaleData.deliveredDate,
        editCreateFlag: 'Edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        if (result.editCreateFlag === 'Edit'){

          const tmpD = {...this.selectedSaleData};
          tmpD.saleEntries = result.saleEntries;
          tmpD.returnedDate = result.returnedDate.toDate();
          const saleReturnEntriesToBeDeleted = this.getSaleReturnEntriesToBeDeleted(
                                                result.saleEntries.filter(d=>d.returnFlag === true), returnDataEntries);
          if (saleReturnEntriesToBeDeleted.length > 0) {
              this.salesdbService.deleteSalesEntry(saleReturnEntriesToBeDeleted)
              .then(_=>{
                  this.updateSales(tmpD);
              })
              .catch(err=>{
                console.log(err);
                this.notificationService.updateSnackBarMessageSubject('Unable to update sale');
              });
          } else {
            this.updateSales(tmpD);
          }
        } else {

          const tmpD = {...this.selectedSaleData};
          tmpD.saleEntries = this.selectedSaleData.saleEntries.filter(d=>d.returnFlag === false);
          tmpD.returnedDate = null;
          const saleReturnEntriesToBeDeleted = returnDataEntries.map(d=>d.saleEntryID);

          if (saleReturnEntriesToBeDeleted.length > 0) {
            this.salesdbService.deleteSalesEntry(saleReturnEntriesToBeDeleted)
            .then(_=>{
                this.updateSales(tmpD);
            })
            .catch(err=>{
              console.log(err);
              this.notificationService.updateSnackBarMessageSubject('Unable to update sale');
            });
        } else {
          this.updateSales(tmpD);
        }
        }
      }
    });
  }

  updateSales(data): void {
    this.salesdbService.updateSales(data)
        .then(_=>{
          this.notificationService.updateSnackBarMessageSubject('Operation successfully');
          this.onRefresh();
        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to Initiate Return');
        });
  }

  onCancelSale(){
    if (this.selectedSaleData.completedDate) {
      const message = `Unable to make changes as Sale is marked as COMPLETED`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    const tmp = {...this.selectedSaleData};
    tmp.cancelledDate = this.selectedSaleData.cancelledDate ? null : new Date();
    this.updateSales(tmp);

  }

  onRefresh(){
    this.salesdbService.getSalesByID(this.selectedSalesID);
    this.setSaleStatus();
  }

  onBack(){
    this.router.navigate(['sales']);
  }

  ngOnInit(): void {
    this.setSaleStatus();
    this.selectedSalesID = this.salesService.getSelectedSalesID();
    this.activatedRoute.data.subscribe(data=>{
      this.selectedSaleData = data.saleData;
      this.setSaleDetails();
      this.setSaleStatus();
      this.salesService.getSelectedSaleData().subscribe(d=>{
        this.selectedSaleData = d;
        this.setSaleDetails();
        this.setSaleStatus();
      });
    });
  }

}
