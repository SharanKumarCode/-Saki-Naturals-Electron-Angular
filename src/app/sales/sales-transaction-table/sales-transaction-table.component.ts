import { Component, OnInit, ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ISalesData, ISaleTransactions } from '../../core/interfaces/interfaces';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SalesdbService } from '../../core/services/sales/salesdb.service';
import {
  SalesPurchaseTransactionDialogComponent
 } from '../../dialogs/sales-purchase-transaction-dialog/sales-purchase-transaction-dialog.component';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EnumTransactionType } from '../../core/interfaces/enums';

@Component({
  selector: 'app-sales-transaction-table',
  templateUrl: './sales-transaction-table.component.html',
  styleUrls: ['./sales-transaction-table.component.scss']
})
export class SalesTransactionTableComponent implements OnInit, OnChanges, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;
    @Input() selectedSaleData: ISalesData;

    displayedColumns: string[] = [
      'serial_number',
      'transactionDate',
      'advanceAmount',
      'paidAmount',
      'refundAmount',
      'remarks'
    ];

  dataSource = new MatTableDataSource([]);

  selectedSalesID: string;

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private salesDBservice: SalesdbService,
    private notificationService: NotificationService
  ) {

   }

  setTableData(): void{
    const tmp = [];
    this.selectedSaleData.saleTransactions.forEach((element, index) => {

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
    let totPrice = this.selectedSaleData
                        ?.saleEntries
                        .filter(d=>d.returnFlag === false).map(d=>d.price * d.quantity).reduce((partialSum, a) => partialSum + a, 0);
    totPrice -= this.selectedSaleData
                ?.saleEntries.filter(d=>d.returnFlag === true)
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
        transactionType: transactionData.transactionType,
        totalPrice: totPrice,
        transactionAmount: transactionData.transactionAmount,
        remarks: transactionData.remarks,
        editCreate: 'Edit',
        transactionDate: tmpDate,
        transactionTime: tmpTime,
        transactionID: transactionData.transactionID,
        salesDate: this.selectedSaleData.salesDate,
        returnDate: this.selectedSaleData.returnedDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        if (result.editCreate === 'Edit'){
          const saleTransactionData: ISaleTransactions = {
            transactionDate: result.transactionDate,
            transactionType: result.transactionType,
            transactionAmount: result.transactionAmount,
            remarks: result.remarks,
            sales: this.selectedSaleData,
            transactionID: transactionData.transactionID
          };
          this.salesDBservice.updateSaleTransaction(saleTransactionData)
          .then(_=>{
            console.log('INFO: Updated sale transaction data');
            this.salesDBservice.getSalesByID(this.selectedSaleData.salesID);
          })
          .catch(err=>{
            console.log(err);
          });
        } else {
          this.salesDBservice.deleteSaleTransaction(transactionData.transactionID)
          .then(_=>{
            console.log('INFO: Deleted sale transaction data');
            this.salesDBservice.getSalesByID(this.selectedSaleData.salesID);
          })
          .catch(err=>{
            console.log(err);
          });
        }
      }
    });
  }

  onRowClick(e: any){
    if (this.selectedSaleData.completedDate || this.selectedSaleData.cancelledDate) {
      const message = `Unable to make changes as Sale is marked as ${this.selectedSaleData.completedDate ? 'COMPLETED' : 'CANCELLED'}`;
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
