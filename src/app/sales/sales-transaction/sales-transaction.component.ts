import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductsdbService } from '../../core/services/productsdb.service';
import { SalesService } from '../../core/services/sales/sales.service';
import { SalesdbService } from '../../core/services/sales/salesdb.service';
import { SalesDialogComponent } from '../../dialogs/sales-dialog/sales-dialog.component';
import { SalesTransactionDialogComponent } from '../../dialogs/sales-transaction-dialog/sales-transaction-dialog.component';
import { EnumSaleType, ISalesData, ISaleTransactions } from '../interfaces/salesdata.interface';

@Component({
  selector: 'app-sales-transaction',
  templateUrl: './sales-transaction.component.html',
  styleUrls: ['./sales-transaction.component.scss']
})
export class SalesTransactionComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  panelOpenState = false;

  displayedColumns: string[] = [
                                'serial_number',
                                'transactionDate',
                                'paidAmount',
                                'remarks'
                              ];
  dataSource = new MatTableDataSource([]);
  selectedSalesID: string;
  selectedSaleData: ISalesData = {
    productID: '',
    saleDate: '',
    purchaser: '',
    supplier: '',
    saleType: EnumSaleType.directSale,
    sellingPrice: 0,
    sellingQuantity: 0
  };
  totalPaidAmount = 0;
  balanceAmount = 0;
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private salesService: SalesService,
    private salesdbService: SalesdbService,
    private productsdbService: ProductsdbService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
  ) {
    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));
  }

  ngOnInit(): void {
    console.log(this.salesService.getSelectedSalesID());
    this.selectedSalesID = this.salesService.getSelectedSalesID();
    this.getSalesData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getSalesData(){
    this.salesdbService.getSalesByID(this.selectedSalesID)
    .then(data=>{
      console.log(data);
      this.selectedSaleData = data[0];
      this.productsdbService.getProductByID(this.selectedSaleData.productID)
      .then(prodData=>{
        console.log(prodData);
        this.selectedSaleData.group = prodData[0].group;
        this.setTableData();
      })
      .catch(err=>{
        console.error(err);
      });
    })
    .catch(err=>{
      console.error(err);
    });
  }

  setTableData(): void{
    const tmp = [];
    console.log(this.selectedSaleData);
    this.selectedSaleData.saleTransactions.forEach((element, index) => {
      tmp.push({
        ...element,
        serialNumber: index + 1
      });
    });
    this.dataSource.data = tmp;
    this.totalPaidAmount = this.calcTransactionData(this.selectedSaleData.saleTransactions);
    this.balanceAmount = (this.selectedSaleData.sellingPrice * this.selectedSaleData.sellingQuantity) - this.totalPaidAmount;
  }

  calcTransactionData(transactionData: ISaleTransactions[]): any{
    const paidAmounts = transactionData.map(e=>e.paid);
    return paidAmounts.reduce((a, b)=> a+b, 0);
  }

  openAddDialog(): void {
    console.log('opening dialog box add transaction..');
    const dialogRef = this.dialog.open(SalesTransactionDialogComponent, {
      width: '50%',
      data: {
        sellingPrice: this.selectedSaleData.sellingPrice,
        sellingQuantity: this.selectedSaleData.sellingQuantity,
        paid: 0,
        remarks: '',
        editCreate: 'Create',
        transactionDate: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        console.log(result);
        const saleTransactionData: ISaleTransactions = {
          transactionDate: result.transactionDate,
          paid: result.paid,
          remarks: result.remarks,
          salesID: this.selectedSalesID
        };
        this.salesdbService.insertSaleTransaction(saleTransactionData)
        .then(_=>{
          console.log('INFO: Created new sale transaction data');
          this.onRefresh();
        })
        .catch(err=>{
          console.log(err);
        });
      }
    });
  }

  openEditDeleteDialog(transactionData: any): void {
    console.log('opening dialog box edit/delete transaction..');
    const dialogRef = this.dialog.open(SalesTransactionDialogComponent, {
      width: '50%',
      data: {
        sellingPrice: this.selectedSaleData.sellingPrice,
        sellingQuantity: this.selectedSaleData.sellingQuantity,
        paid: transactionData.paid,
        remarks: transactionData.remarks,
        editCreate: 'Edit',
        transactionDate: transactionData.transactionDate,
        transactionID: transactionData.transactionID,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        console.log(result);
        if (result.editCreate === 'Edit'){
          const saleTransactionData: ISaleTransactions = {
            transactionDate: result.transactionDate,
            paid: result.paid,
            remarks: result.remarks,
            transactionID: transactionData.transactionID
          };
          this.salesdbService.updateSaleTransaction(saleTransactionData)
          .then(_=>{
            console.log('INFO: Updated sale transaction data');
            this.onRefresh();
          })
          .catch(err=>{
            console.log(err);
          });
        } else {
          this.salesdbService.deleteSaleTransaction(transactionData.transactionID)
          .then(_=>{
            console.log('INFO: Deleted sale transaction data');
            this.onRefresh();
          })
          .catch(err=>{
            console.log(err);
          });
        }
      }
    });
  }

  openEditSaleDialog(): void {
    console.log('opening dialog box edit/delete sale..');
    console.log(this.selectedSaleData);
    const dialogRef = this.dialog.open(SalesDialogComponent, {
      width: '50%',
      data: {
        productID: this.selectedSaleData.productID,
        productName: this.selectedSaleData.productName,
        currentStock: this.selectedSaleData.currentStock,
        group: this.selectedSaleData.group,
        saleDate: this.selectedSaleData.saleDate,
        saleTime: '',
        purchaser: this.selectedSaleData.purchaser,
        supplier: this.selectedSaleData.supplier,
        saleType: this.selectedSaleData.saleType,
        sellingPrice: this.selectedSaleData.sellingPrice,
        sellingQuantity: this.selectedSaleData.sellingQuantity,
        remarks: this.selectedSaleData.remarks,
        editCreate: 'Edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed after update');
      if (result){
        result.saleData.salesID = this.selectedSalesID;
        this.salesdbService.updateSales(result.saleData)
        .then(_=>{
          console.log('INFO: Updated sales data');
          this.onRefresh();
        })
        .catch(err=>{
          console.log(err);
        });
      }
    });
  }

  onUpdateSale(){
    this.openEditSaleDialog();
  }

  onDeleteSale(){
    this.salesdbService.deleteSales(this.selectedSalesID)
    .then(_=>{
      console.log('INFO: Deleted sale');
      this.onBack();
    })
    .catch(err=>{
      console.log(err);
    });

  }

  onRowClick(e: any){
    console.log(e);
    this.openEditDeleteDialog(e);
  }

  onRefresh(){
    this.getSalesData();
  }

  onBack(){
    this.router.navigate(['sales']);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
