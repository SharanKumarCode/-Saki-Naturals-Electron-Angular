import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { IPurchaseData, IPurchaseTransactions } from '../../core/interfaces/interfaces';
import { PurchasedbService } from '../../core/services/purchase/purchasedb.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../core/services/notification/notification.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import {
  SalesPurchaseTransactionDialogComponent
 } from '../../dialogs/sales-purchase-transaction-dialog/sales-purchase-transaction-dialog.component';
import { EnumTransactionDialogType, EnumTransactionType } from '../../core/interfaces/enums';

@Component({
  selector: 'app-purchase-transaction-table',
  templateUrl: './purchase-transaction-table.component.html',
  styleUrls: ['./purchase-transaction-table.component.scss']
})
export class PurchaseTransactionTableComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
    @Input() selectedPurchaseData: IPurchaseData;

    displayedColumns: string[] = [
      'serial_number',
      'transactionDate',
      'advanceAmount',
      'paidAmount',
      'refundAmount',
      'remarks'
    ];

  dataSource = new MatTableDataSource([]);

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private purchaseDBservice: PurchasedbService,
    private notificationService: NotificationService
  ) {

   }

  setTableData(): void{
    const tmp = [];
    this.selectedPurchaseData.purchaseTransactions.forEach((element, index) => {

      tmp.push({
        ...element,
        advanceAmount: element.transactionType === EnumTransactionType.advance ? element.transactionAmount : 0,
        paidAmount: element.transactionType === EnumTransactionType.paid ? element.transactionAmount : 0,
        refundAmount: element.transactionType === EnumTransactionType.refund ? element.transactionAmount : 0,
        serialNumber: index + 1
      });
    });
    this.dataSource.data = tmp;

  }

  openTransactionEditDeleteDialog(transactionData: any): void {
    console.log('opening dialog box edit/delete transaction..');
    let totPrice = this.selectedPurchaseData
                        ?.purchaseEntries
                        .filter(d=>d.returnFlag === false).map(d=>d.price * d.quantity).reduce((partialSum, a) => partialSum + a, 0);
    totPrice -= this.selectedPurchaseData
                ?.purchaseEntries.filter(d=>d.returnFlag === true)
                .map(d=>d.price * d.quantity)
                .reduce((partialSum, a) => partialSum + a, 0);
    const tmpDate = new Date(transactionData.transactionDate.getFullYear(),
                              transactionData.transactionDate.getMonth(),
                              transactionData.transactionDate.getDate());
    const tmpTime = `${String(transactionData.transactionDate.getHours()).padStart(2, '0')}:`+
                      `${String(transactionData.transactionDate.getMinutes()).padStart(2, '0')}`;
    const dialogRef = this.dialog.open(SalesPurchaseTransactionDialogComponent, {
      width: '50%',
      data: {
        editCreate: 'Edit',
        dialogType: EnumTransactionDialogType.purchase,
        transactionType: transactionData.transactionType,
        totalPrice: totPrice,
        transactionAmount: transactionData.transactionAmount,
        remarks: transactionData.remarks,
        transactionDate: tmpDate,
        transactionTime: tmpTime,
        transactionID: transactionData.transactionID,
        purchaseDate: this.selectedPurchaseData.purchaseDate,
        returnDate: this.selectedPurchaseData.returnedDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        if (result.editCreate === 'Edit'){
          const purchaseTransactionData: IPurchaseTransactions = {
            transactionDate: result.transactionDate,
            transactionType: result.transactionType,
            transactionAmount: result.transactionAmount,
            remarks: result.remarks,
            purchase: this.selectedPurchaseData,
            transactionID: transactionData.transactionID
          };
          this.purchaseDBservice.updatePurchaseTransaction(purchaseTransactionData)
          .then(_=>{
            console.log('INFO: Updated purchase transaction data');
            this.purchaseDBservice.getPurchaseByID(this.selectedPurchaseData.purchaseID);
          })
          .catch(err=>{
            console.log(err);
          });
        } else {
          this.purchaseDBservice.deletePurchaseTransaction(transactionData.transactionID)
          .then(_=>{
            console.log('INFO: Deleted purchase transaction data');
            this.purchaseDBservice.getPurchaseByID(this.selectedPurchaseData.purchaseID);
          })
          .catch(err=>{
            console.log(err);
          });
        }
      }
    });
  }

  onRowClick(e: any){
    if (this.selectedPurchaseData.completedDate || this.selectedPurchaseData.cancelledDate) {
      const message = `Unable to make changes as Purchase is marked as 
                        ${this.selectedPurchaseData.completedDate ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    this.openTransactionEditDeleteDialog(e);
  }

  ngOnInit(): void {
    this.setTableData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(): void {
    this.setTableData();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
