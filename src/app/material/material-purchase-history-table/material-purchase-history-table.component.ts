import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IMaterialData } from '../../core/interfaces/interfaces';
import { MatSort, Sort } from '@angular/material/sort';
import { PurchaseService } from '../../core/services/purchase/purchase.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Moment } from 'moment';
import { ExportService } from '../../core/services/export.service';

@Component({
  selector: 'app-material-purchase-history-table',
  templateUrl: './material-purchase-history-table.component.html',
  styleUrls: ['./material-purchase-history-table.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})
export class MaterialPurchaseHistoryTableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @Input() selectedMaterialData: IMaterialData;

  selectedSupplierValue: string;
  selectedPurchaseStatusValue: string;
  selectedStartDate: Moment;
  selectedEndDate: Moment;

  supplierList: string[];
  purchaseStatusList: string[];

  tmpPurchaseHistoryWithReturnList = [];
  dataSource = new MatTableDataSource([]);

  displayedColumns: string[] = [
    'serial_number',
    'supplier',
    'sellingPrice',
    'purchasedQuantity',
    'returnedQuantity',
    'discount',
    'grossPrice',
    'purchaseStatus',
    'purchaseDate'
  ];

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private purchaseService: PurchaseService,
    private exportService: ExportService,
    private router: Router,
  ) { }

  setTableData() {
    this.dataSource = new MatTableDataSource();
    const tmpPurchaseHistoryList = [];
    console.log(this.selectedMaterialData);
    this.selectedMaterialData.purchaseEntries.filter(d=>d.returnFlag === false).forEach((element, index)=>{

      const purchaseStatus = this.purchaseService.getPurchaseStatus(element.purchase);
      const purchaseStatusCompleteFlag = element.purchase.completedDate ? true : false;
      const purchaseStatusCancelledFlag = element.purchase.cancelledDate ? true : false;
      const grossPrice = ((element.price * element.quantity)
                          - (element.price * element.quantity * element.discountPercentage / 100)).toFixed(2);
      const purchaseHistoryData = {
        purchaseID: element.purchase.purchaseID,
        serialNumber: index + 1,
        supplier: element.purchase.supplier.clientName,
        sellingPrice: element.price,
        purchasedQuantity: element.quantity,
        returnedQuantity: 0,
        discount: element.discountPercentage,
        grossPrice,
        purchaseDate: element.purchase.purchaseDate,
        purchaseStatus,
        purchaseStatusCompleteFlag,
        purchaseStatusCancelledFlag
      };
      tmpPurchaseHistoryList.push(purchaseHistoryData);
    });

    this.selectedMaterialData.purchaseEntries.forEach(element=>{
      tmpPurchaseHistoryList.forEach(data=>{
        if (data.purchaseID === element.purchase.purchaseID && element.returnFlag){

          const netQuantity = data.sellingQuantity - element.quantity;
          const totalPriceOfNetQuantity = data.sellingPrice * netQuantity;
          const discountPrice = totalPriceOfNetQuantity * data.discount / 100;
          const modGrossPrice = (totalPriceOfNetQuantity - discountPrice).toFixed(2);

          this.tmpPurchaseHistoryWithReturnList.push({
            ...data,
            returnedQuantity: element.quantity,
            grossPrice: modGrossPrice
          });
        } else if (this.tmpPurchaseHistoryWithReturnList.filter(d=>d.purchaseID === data.purchaseID).length === 0) {
          this.tmpPurchaseHistoryWithReturnList.push(data);
        }

      });
    });

    this.supplierList = ['Show all', ...new Set(this.tmpPurchaseHistoryWithReturnList.map(d=>d.supplier))];
    this.purchaseStatusList = ['Show all', ...new Set(this.tmpPurchaseHistoryWithReturnList.map(d=>d.purchaseStatus))];

    this.dataSource.data = this.tmpPurchaseHistoryWithReturnList;
  }

  onFilterChange(): void {
    this.dataSource = new MatTableDataSource(this.getFilteredList());
  }

  onClearFilters(): void {
    this.selectedSupplierValue = '';
    this.selectedPurchaseStatusValue = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dataSource = new MatTableDataSource(this.tmpPurchaseHistoryWithReturnList);
  }

  getFilteredList(): any[] {
    return this.tmpPurchaseHistoryWithReturnList
                .filter(data=> this.selectedSupplierValue &&
                  this.selectedSupplierValue !== 'Show all'  ? data.supplier === this.selectedSupplierValue : true)
                .filter(data=> this.selectedPurchaseStatusValue &&
                  this.selectedPurchaseStatusValue !== 'Show all'  ? data.purchaseStatus === this.selectedPurchaseStatusValue : true)
                .filter(data=> {

                  if (!this.selectedStartDate) {
                    return true;
                  }

                  const date = new Date(data.purchaseDate);
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
                          'PurchaseID',
                          'Supplier',
                          'Purchase Type',
                          'Selling Price',
                          'Sold Quantity',
                          'Returned Quantity',
                          'Discount',
                          'Gross Price',
                          'Purchase Status',
                          'Purchase Date'
                        ];
    const exportFileContent = [];
    this.getFilteredList().forEach(elem=>{
      const tmp = {};
      tmp[columnNames[0]] = elem.purchaseID;
      tmp[columnNames[1]] = elem.supplier;
      tmp[columnNames[2]] = elem.purchaseType;
      tmp[columnNames[3]] = elem.sellingPrice;
      tmp[columnNames[4]] = elem.sellingQuantity;
      tmp[columnNames[5]] = elem.returnedQuantity;
      tmp[columnNames[6]] = elem.discount;
      tmp[columnNames[7]] = elem.grossPrice;
      tmp[columnNames[8]] = elem.purchaseStatus;
      tmp[columnNames[9]] = elem.purchaseDate;

      exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'purchase_history');
  }

  onRowClick(e: any){
    console.log(e);
    this.router.navigate(['purchase/transaction', e.purchaseID]);
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
