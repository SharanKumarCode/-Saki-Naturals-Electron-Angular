import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IProductData } from '../../core/interfaces/interfaces';
import { SalesService } from '../../core/services/sales/sales.service';
import { Moment } from 'moment';
import { animate, style, transition, trigger } from '@angular/animations';
import { ExportService } from '../../core/services/export.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-sales-history-table',
  templateUrl: './product-sales-history-table.component.html',
  styleUrls: ['./product-sales-history-table.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})
export class ProductSalesHistoryTableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @Input() selectedProductData: IProductData;

  selectedCustomerValue: string;
  selectedSaleTypeValue: string;
  selectedSaleStatusValue: string;
  selectedStartDate: Moment;
  selectedEndDate: Moment;

  customerList: string[];
  saleTypeList: string[];
  saleStatusList: string[];

  tmpSalesHistoryWithReturnList = [];
  dataSource = new MatTableDataSource([]);

  displayedColumns: string[] = [
    'serial_number',
    'customer',
    'saleType',
    'sellingPrice',
    'soldQuantity',
    'returnedQuantity',
    'discount',
    'grossPrice',
    'salesStatus',
    'salesDate'
  ];

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private salesService: SalesService,
    private exportService: ExportService,
    private router: Router,
  ) { }

  setTableData() {
    this.dataSource = new MatTableDataSource();
    const tmpSalesHistoryList = [];
    this.selectedProductData.saleEntries.filter(d=>d.returnFlag === false).forEach((element, index)=>{

      const saleStatus = this.salesService.getSaleStatus(element.sale);
      const salesStatusCompleteFlag = element.sale.completedDate ? true : false;
      const salesStatusCancelledFlag = element.sale.cancelledDate ? true : false;
      const grossPrice = ((element.price * element.quantity)
                          - (element.price * element.quantity * element.discountPercentage / 100)).toFixed(2);
      const salesHistoryData = {
        salesID: element.sale.salesID,
        serialNumber: index + 1,
        customer: element.sale.customer.clientName,
        saleType: element.sale.saleType,
        sellingPrice: element.price,
        sellingQuantity: element.quantity,
        returnedQuantity: 0,
        discount: element.discountPercentage,
        grossPrice,
        saleDate: element.sale.salesDate,
        saleStatus,
        salesStatusCompleteFlag,
        salesStatusCancelledFlag
      };
      tmpSalesHistoryList.push(salesHistoryData);
    });

    this.selectedProductData.saleEntries.forEach(element=>{
      tmpSalesHistoryList.forEach(data=>{
        if (data.salesID === element.sale.salesID && element.returnFlag){

          const netQuantity = data.sellingQuantity - element.quantity;
          const totalPriceOfNetQuantity = data.sellingPrice * netQuantity;
          const discountPrice = totalPriceOfNetQuantity * data.discount / 100;
          const modGrossPrice = (totalPriceOfNetQuantity - discountPrice).toFixed(2);

          this.tmpSalesHistoryWithReturnList.push({
            ...data,
            returnedQuantity: element.quantity,
            grossPrice: modGrossPrice
          });
        } else if (this.tmpSalesHistoryWithReturnList.filter(d=>d.salesID === data.salesID).length === 0) {
          this.tmpSalesHistoryWithReturnList.push(data);
        }

      });
    });

    this.customerList = ['Show all', ...new Set(this.tmpSalesHistoryWithReturnList.map(d=>d.customer))];
    this.saleTypeList = ['Show all', ...new Set(this.tmpSalesHistoryWithReturnList.map(d=>d.saleType))];
    this.saleStatusList = ['Show all', ...new Set(this.tmpSalesHistoryWithReturnList.map(d=>d.saleStatus))];

    this.dataSource.data = this.tmpSalesHistoryWithReturnList;
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
    this.dataSource = new MatTableDataSource(this.tmpSalesHistoryWithReturnList);
  }

  getFilteredList(): any[] {
    return this.tmpSalesHistoryWithReturnList
                .filter(data=> this.selectedCustomerValue &&
                  this.selectedCustomerValue !== 'Show all'  ? data.customer === this.selectedCustomerValue : true)
                .filter(data=> this.selectedSaleTypeValue &&
                        this.selectedSaleTypeValue !== 'Show all' ? data.saleType === this.selectedSaleTypeValue : true)
                .filter(data=> this.selectedSaleStatusValue &&
                  this.selectedSaleStatusValue !== 'Show all'  ? data.saleStatus === this.selectedSaleStatusValue : true)
                .filter(data=> {

                  if (!this.selectedStartDate) {
                    return true;
                  }

                  const date = new Date(data.saleDate);
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
                          'Selling Price',
                          'Sold Quantity',
                          'Returned Quantity',
                          'Discount',
                          'Gross Price',
                          'Sale Status',
                          'Sale Date'
                        ];
    const exportFileContent = [];
    this.getFilteredList().forEach(elem=>{
      const tmp = {};
      tmp[columnNames[0]] = elem.salesID;
      tmp[columnNames[1]] = elem.customer;
      tmp[columnNames[2]] = elem.saleType;
      tmp[columnNames[3]] = elem.sellingPrice;
      tmp[columnNames[4]] = elem.sellingQuantity;
      tmp[columnNames[5]] = elem.returnedQuantity;
      tmp[columnNames[6]] = elem.discount;
      tmp[columnNames[7]] = elem.grossPrice;
      tmp[columnNames[8]] = elem.saleStatus;
      tmp[columnNames[9]] = elem.saleDate;

      exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'sample');
  }

  onRowClick(e: any){
    console.log(e);
    this.router.navigate(['sale/transaction', e.salesID]);
  }

  ngOnInit(): void {
    this.setTableData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
