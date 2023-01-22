import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { SalesService } from '../core/services/sales/sales.service';
import { SalesdbService } from '../core/services/sales/salesdb.service';

import { Subject } from 'rxjs';
import { ProductsdbService } from '../core/services/productsdb.service';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ISalesData, EnumSaleType, ISaleTransactions, EnumRouteActions } from '../core/interfaces/interfaces';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
                                'serial_number',
                                'customer',
                                'numberOfProducts',
                                'saleType',
                                'soldQuantity',
                                'totalAmount',
                                'paidAmount',
                                'balanceAmount',
                                'salesDate'
                              ];
  dataSource = new MatTableDataSource([]);

  private salesData: ISalesData;
  private salesDataListObservable: Subject<ISalesData[]>;
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
    this.salesData = {
      salesDate: new Date(),
      currentStock: 0,
      saleType: EnumSaleType.dealer,
      gstPercentage: 0,
      overallDiscountPercentage: 0,
      transportCharges: 0,
      miscCharges: 0,
      paymentTerms: 0,
      remarks: ''
    };

    this.matIconRegistry
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
  }

  getSalesList(){
    this.salesdbService.getSalesList();
  }

  setTableData(){
    this.salesDataListObservable.subscribe(data=>{
      this.dataSource = new MatTableDataSource();
      const tmpSaleList = [];
      data.forEach((element, index)=>{
        const tmpSaleData = {
          salesID: element.salesID,
          serialNumber: index + 1,
          customer: element.customer.clientName,
          saleType: element.saleType,
          remarks: element.remarks,
          salesDate: element.salesDate,
          numberOfProducts: element.saleEntries.length,
          sellingQuantity: element.saleEntries.map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0),
          totalAmount: element.saleEntries.map(d=>d.price * d.quantity).reduce((partialSum, a) => partialSum + a, 0),
          paid: element.saleTransactions.map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0),
          balance: 0
        };
        tmpSaleData.balance = tmpSaleData.totalAmount - tmpSaleData.paid;
        tmpSaleList.push(tmpSaleData);
      });
      this.dataSource.data = tmpSaleList;

    });
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
    this.salesDataListObservable = this.salesService.getSalesList();
    this.setTableData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
