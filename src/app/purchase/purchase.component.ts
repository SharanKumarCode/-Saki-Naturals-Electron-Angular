import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EnumRouteActions, EnumTransactionType, IPurchaseData, IPurchaseTransactions } from '../core/interfaces/interfaces';
import { Subject } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PurchaseService } from '../core/services/purchase/purchase.service';
import { PurchasedbService } from '../core/services/purchase/purchasedb.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
                                'serial_number',
                                'supplier',
                                'numberOfMaterials',
                                'purchasedQuantity',
                                'totalPrice',
                                'paidAmount',
                                'balanceAmount',
                                'purchaseStatus',
                                'purchaseDate'
                              ];
  dataSource = new MatTableDataSource([]);

  private purchaseDataListObservable: Subject<IPurchaseData[]>;
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private purchaseService: PurchaseService,
    private purchaseDBservice: PurchasedbService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {

    this.matIconRegistry
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
  }

  ngOnInit(): void {
    this.getPurchaseList();
    this.purchaseDataListObservable = this.purchaseService.getPurchaseList();
    this.setTableData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getPurchaseList(){
    this.purchaseDBservice.getPurchaseList();
  }

  setTableData(){
    this.purchaseDataListObservable.subscribe(data=>{
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

        const purchaseStatus = this.purchaseService.getPurchaseStatus(element);

        const purchaseStatusCompleteFlag = element.completedDate ? true : false;
        const purchaseStatusCancelledFlag = element.cancelledDate ? true : false;

        const tmpPurchaseData = {
          purchaseID: element.purchaseID,
          serialNumber: index + 1,
          supplier: element.supplier.clientName,
          remarks: element.remarks,
          purchaseDate: element.purchaseDate,
          numberOfMaterials: element.purchaseEntries.length,
          purchasedQuantity: element.purchaseEntries.map(d=>d.quantity).reduce((partialSum, a) => partialSum + a, 0),
          totalPrice,
          paidAmount,
          balance,
          purchaseStatus,
          purchaseStatusCompleteFlag,
          purchaseStatusCancelledFlag
        };
        tmpPurchaseList.push(tmpPurchaseData);
      });
      this.dataSource.data = tmpPurchaseList;

    });
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
