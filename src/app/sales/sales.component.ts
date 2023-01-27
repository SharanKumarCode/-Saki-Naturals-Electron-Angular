import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Input } from '@angular/core';
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
import { ISalesData, ISaleTransactions, EnumRouteActions, EnumTransactionType, IClientData } from '../core/interfaces/interfaces';
import { Moment } from 'moment';
import { ExportService } from '../core/services/export.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;
  @Input() selectedClientData?: IClientData;

  selectedCustomerValue: string;
  selectedSaleTypeValue: string;
  selectedSaleStatusValue: string;
  selectedStartDate: Moment;
  selectedEndDate: Moment;

  customerList: string[];
  saleTypeList: string[];
  saleStatusList: string[];

  salesList = [];

  displayedColumns: string[] = [
                                'serial_number',
                                'customer',
                                'numberOfProducts',
                                'saleType',
                                'soldQuantity',
                                'returnedQuantity',
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
    private exportService: ExportService,
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
    data.filter(d=>this.selectedClientData ? d.customer.clientID === this.selectedClientData?.clientID : true).forEach((element, index)=>{
      const totalAmount = this.salesService.getNetSalePrice(element);
      const paid = element.saleTransactions
                    .filter(d=>d.transactionType !== EnumTransactionType.refund)
                    .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
      const refund = element.saleTransactions
                    .filter(d=>d.transactionType === EnumTransactionType.refund)
                    .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
      const balance = totalAmount - paid + refund;

      const numberOfProducts = [...new Set(element.saleEntries.map(d=>d.product.productID))].length;
      const soldQuantity = element.saleEntries
                          .filter(d=>d.returnFlag === false)
                          .map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0);
      const returnedQuantity = element.saleEntries
                          .filter(d=>d.returnFlag === true)
                          .map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0);

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
        numberOfProducts,
        sellingQuantity: soldQuantity - returnedQuantity,
        returnedQuantity,
        totalAmount,
        paid,
        refund,
        balance,
        salesStatus,
        salesStatusCompleteFlag,
        salesStatusCancelledFlag
      };
      this.salesList.push(tmpSaleData);
    });

    this.customerList = ['Show all', ...new Set(this.salesList.map(d=>d.customer))];
    this.saleTypeList = ['Show all', ...new Set(this.salesList.map(d=>d.saleType))];
    this.saleStatusList = ['Show all', ...new Set(this.salesList.map(d=>d.salesStatus))];

    this.dataSource.data = this.salesList;
  }

  onFilterChange(): void {
    this.dataSource = new MatTableDataSource(this.getFilteredList());
  }

  onClearFilters(): void {
    this.selectedCustomerValue = '';
    this.selectedSaleStatusValue = '';
    this.selectedSaleTypeValue = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dataSource = new MatTableDataSource(this.salesList);
  }

  getFilteredList(): any[] {
    return this.salesList
                .filter(data=> this.selectedCustomerValue &&
                  this.selectedCustomerValue !== 'Show all'  ? data.customer === this.selectedCustomerValue : true)
                .filter(data=> this.selectedSaleTypeValue &&
                        this.selectedSaleTypeValue !== 'Show all' ? data.saleType === this.selectedSaleTypeValue : true)
                .filter(data=> this.selectedSaleStatusValue &&
                  this.selectedSaleStatusValue !== 'Show all'  ? data.salesStatus === this.selectedSaleStatusValue : true)
                .filter(data=> {

                  if (!this.selectedStartDate) {
                    return true;
                  }

                  const date = new Date(data.salesDate);
                  const trimmedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  const startTimeSeconds = this.selectedStartDate?.toDate().getTime();
                  const endTimeSeconds = this.selectedEndDate?.toDate().getTime();

                  if (!endTimeSeconds) {
                    return trimmedDate.getTime() <= startTimeSeconds ? true : false;
                  } else {
                    return trimmedDate.getTime() >= startTimeSeconds && trimmedDate.getTime() <= endTimeSeconds? true : false;
                  }

                });

  }

  onExportAsExcel(): void {
    const columnNames = [
                          'SalesID',
                          'Customer',
                          'Sale Type',
                          'Sold Quantity',
                          'Returned Quantity',
                          'Total Amount',
                          'Paid Amount',
                          'Refund Amount',
                          'Balance Amount',
                          'Sale Status',
                          'Sale Date',
                          'Remarks'
                        ];
    const exportFileContent = [];
    this.getFilteredList().forEach(elem=>{
      const tmp = {};
      tmp[columnNames[0]] = elem.salesID;
      tmp[columnNames[1]] = elem.customer;
      tmp[columnNames[2]] = elem.saleType;
      tmp[columnNames[3]] = elem.sellingQuantity;
      tmp[columnNames[4]] = elem.returnedQuantity;
      tmp[columnNames[5]] = elem.totalAmount;
      tmp[columnNames[6]] = elem.paid;
      tmp[columnNames[7]] = elem.refund;
      tmp[columnNames[8]] = elem.balance;
      tmp[columnNames[9]] = elem.salesStatus;
      tmp[columnNames[10]] = elem.salesDate;
      tmp[columnNames[11]] = elem.remarks;

      exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'sales_list');
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
    if (this.selectedClientData) {
      this.displayedColumns = [
                                'serial_number',
                                'salesDate',
                                'numberOfProducts',
                                'saleType',
                                'soldQuantity',
                                'returnedQuantity',
                                'totalAmount',
                                'paidAmount',
                                'refundAmount',
                                'balanceAmount',
                                'salesStatus',
                              ];
    }
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
