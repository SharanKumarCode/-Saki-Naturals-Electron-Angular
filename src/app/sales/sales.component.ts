import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { SalesService } from '../core/services/sales/sales.service';
import { SalesdbService } from '../core/services/sales/salesdb.service';

import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ISalesData, ISaleTransactions, EnumRouteActions, EnumTransactionType } from '../core/interfaces/interfaces';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
                                'serial_number',
                                'customer',
                                'numberOfProducts',
                                'saleType',
                                'soldQuantity',
                                'totalAmount',
                                'paidAmount',
                                'refundAmount',
                                'balanceAmount',
                                'salesStatus',
                                'salesDate'
                              ];
  dataSource = new MatTableDataSource([]);

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private salesService: SalesService,
    private salesdbService: SalesdbService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {

    this.matIconRegistry
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
  }

  getSalesList(){
    this.salesdbService.getSalesList();
  }

  setTableData(data: ISalesData[]){
    this.dataSource = new MatTableDataSource();
    const tmpSaleList = [];
    data.forEach((element, index)=>{
      const totalAmount = this.salesService.getNetSalePrice(element);
      const paid = element.saleTransactions
                    .filter(d=>d.transactionType !== EnumTransactionType.refund)
                    .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
      const refund = element.saleTransactions
                    .filter(d=>d.transactionType === EnumTransactionType.refund)
                    .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
      const balance = totalAmount - paid + refund;
      const salesStatus = this.salesService.getSaleStatus(element);

      const salesStatusCompleteFlag = element.completedDate ? true : false;
      const salesStatusCancelledFlag = element.cancelledDate ? true : false;

      const tmpSaleData = {
        salesID: element.salesID,
        serialNumber: index + 1,
        customer: element.customer.clientName,
        saleType: element.saleType,
        remarks: element.remarks,
        salesDate: element.salesDate,
        numberOfProducts: element.saleEntries.length,
        sellingQuantity: element.saleEntries.map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0),
        totalAmount,
        paid,
        refund,
        balance,
        salesStatus,
        salesStatusCompleteFlag,
        salesStatusCancelledFlag
      };
      tmpSaleList.push(tmpSaleData);
    });
    this.dataSource.data = tmpSaleList;
  }

  calcTransactionData(transactionData: ISaleTransactions[]): any{
    const paidAmounts = transactionData.map(e=>e.transactionAmount);
    return paidAmounts.reduce((a, b)=> a+b, 0);
  }

  onAddSales(): void {
    this.router.navigate(['sale/add_update_sale', EnumRouteActions.create]);
  }

  onRowClick(e: any){
    this.router.navigate(['sale/transaction', e.salesID]);
  }

  onRefresh(){
    this.getSalesList();
  }

  ngOnInit(): void {
    this.getSalesList();
    this.salesService.getSalesList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setTableData(data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
