import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EnumRouteActions, EnumTransactionType, IPurchaseData, IPurchaseTransactions } from '../core/interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PurchaseService } from '../core/services/purchase/purchase.service';
import { PurchasedbService } from '../core/services/purchase/purchasedb.service';
import { Moment } from 'moment';
import { ExportService } from '../core/services/export.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;

  selectedSupplierValue: string;
  selectedPurchaseStatusValue: string;
  selectedStartDate: Moment;
  selectedEndDate: Moment;

  supplierList: string[];
  purchaseStatusList: string[];

  purchaseList = [];

  displayedColumns: string[] = [
                                'serial_number',
                                'supplier',
                                'numberOfMaterials',
                                'purchasedQuantity',
                                'returnedQuantity',
                                'totalPrice',
                                'paidAmount',
                                'balanceAmount',
                                'purchaseStatus',
                                'purchaseDate'
                              ];
  dataSource = new MatTableDataSource([]);

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private purchaseService: PurchaseService,
    private purchaseDBservice: PurchasedbService,
    private exportService: ExportService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {

    this.matIconRegistry
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
  }

  getPurchaseList(){
    this.purchaseDBservice.getPurchaseList();
  }

  setTableData(data: IPurchaseData[]){
    this.dataSource = new MatTableDataSource();
      const tmpPurchaseList = [];
      data.forEach((element, index)=>{

      let totalPrice = element
                      ?.purchaseEntries
                      .filter(d=>d.returnFlag === false).map(d=>d.price * d.quantity).reduce((partialSum, a) => partialSum + a, 0);
                      totalPrice -= element
                      ?.purchaseEntries.filter(d=>d.returnFlag === true)
                      .map(d=>d.price * d.quantity)
                      .reduce((partialSum, a) => partialSum + a, 0);

      const paidAmount = element.purchaseTransactions
                              .filter(d=>d.transactionType !== EnumTransactionType.refund)
                              .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
      const totalRefundAmount = element.purchaseTransactions
                                  .filter(d=>d.transactionType === EnumTransactionType.refund)
                                  .map(d=>d.transactionAmount).reduce((partialSum, a) => partialSum + a, 0);
      const balance = totalPrice + totalRefundAmount - paidAmount;

      const numberOfMaterials = [...new Set(element.purchaseEntries.map(d=>d.material.materialID))].length;
      const purchasedQuantity = element.purchaseEntries
                          .filter(d=>d.returnFlag === false)
                          .map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0);
      const returnedQuantity = element.purchaseEntries
                          .filter(d=>d.returnFlag === true)
                          .map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0);

      const purchaseStatus = this.purchaseService.getPurchaseStatus(element);
      const purchaseStatusCompleteFlag = element.completedDate ? true : false;
      const purchaseStatusCancelledFlag = element.cancelledDate ? true : false;

      const tmpPurchaseData = {
        purchaseID: element.purchaseID,
        serialNumber: index + 1,
        supplier: element.supplier.clientName,
        remarks: element.remarks,
        purchaseDate: element.purchaseDate,
        numberOfMaterials,
        purchasedQuantity: purchasedQuantity - returnedQuantity,
        returnedQuantity,
        totalPrice,
        paidAmount,
        balance,
        purchaseStatus,
        purchaseStatusCompleteFlag,
        purchaseStatusCancelledFlag
      };
      this.purchaseList.push(tmpPurchaseData);
    });

    this.supplierList = ['Show all', ...new Set(this.purchaseList.map(d=>d.supplier))];
    this.purchaseStatusList = ['Show all', ...new Set(this.purchaseList.map(d=>d.purchaseStatus))];

    this.dataSource.data = this.purchaseList;
  }

  onFilterChange(): void {
    this.dataSource = new MatTableDataSource(this.getFilteredList());
  }

  onClearFilters(): void {
    this.selectedSupplierValue = '';
    this.selectedPurchaseStatusValue = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dataSource = new MatTableDataSource(this.purchaseList);
  }

  getFilteredList(): any[] {
    return this.purchaseList
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
                          'Purchased Quantity',
                          'Returned Quantity',
                          'Total Price',
                          'Paid Amount',
                          'Balance Amount',
                          'Purchase Status',
                          'Purchase Date',
                          'Remarks'
                        ];
    const exportFileContent = [];
    this.getFilteredList().forEach(elem=>{
      const tmp = {};
      tmp[columnNames[0]] = elem.purchaseID;
      tmp[columnNames[1]] = elem.supplier;
      tmp[columnNames[2]] = elem.purchasedQuantity;
      tmp[columnNames[3]] = elem.returnedQuantity;
      tmp[columnNames[4]] = elem.totalPrice;
      tmp[columnNames[5]] = elem.paidAmount;
      tmp[columnNames[6]] = elem.balance;
      tmp[columnNames[7]] = elem.purchaseStatus;
      tmp[columnNames[8]] = elem.purchaseDate;
      tmp[columnNames[9]] = elem.remarks;

      exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'purchase_history');
  }

  calcTransactionData(transactionData: IPurchaseTransactions[]): any{
    const paidAmounts = transactionData.map(e=>e.transactionAmount);
    return paidAmounts.reduce((a, b)=> a+b, 0);
  }

  onAddPurchase(): void {
    this.router.navigate(['purchase/add_update_purchase', EnumRouteActions.create]);
  }

  onRowClick(e: any){
    this.router.navigate(['purchase/transaction', e.purchaseID]);
  }

  onRefresh(){
    this.getPurchaseList();
  }

  ngOnInit(): void {
    this.getPurchaseList();
    this.purchaseService.getPurchaseList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
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
