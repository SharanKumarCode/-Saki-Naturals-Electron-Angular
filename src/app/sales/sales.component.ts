import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { SalesDialogComponent } from '../dialogs/sales-dialog/sales-dialog.component';

import { ElectronService } from '../core/services';

import { EnumSaleType, ISalesData, ISaleTransactions } from './interfaces/salesdata.interface';
import { SalesService } from '../core/services/sales/sales.service';
import { SalesdbService } from '../core/services/sales/salesdb.service';

import { Subject } from 'rxjs';
import { ProductsdbService } from '../core/services/productsdb.service';
import { IProductData } from '../products/interfaces/productdata.interface';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
                                'serial_number',
                                'purchaser',
                                'supplier',
                                'productGroup',
                                'productName',
                                'saleType',
                                'sellingPrice',
                                'soldQuantity',
                                'totalAmount',
                                'paidAmount',
                                'balanceAmount',
                                'salesDate'
                              ];
  dataSource = new MatTableDataSource([]);

  private salesData: ISalesData;
  private salesDataListObservable: Subject<ISalesData[]>;

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private salesService: SalesService,
    private salesdbService: SalesdbService,
    private productdbService: ProductsdbService
  ) {
    this.salesData = {
      productID: '',
      productName: '',
      currentStock: 0,
      group: '',
      saleDate: '',
      saleTime: '',
      purchaser: '',
      supplier: '',
      saleType: EnumSaleType.dealer,
      sellingPrice: 0,
      sellingQuantity: 0,
      remarks: ''
    };
  }

  ngOnInit(): void {
    this.getSalesList();
    this.salesDataListObservable = this.salesService.getSalesList();
    this.setTableData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getSalesList(){
    this.salesdbService.getSalesList();
  }

  setTableData(){
    this.salesDataListObservable.subscribe(data=>{
      this.dataSource = new MatTableDataSource();

      // getting product data
      const tmp = new Subject<ISalesData[]>();
      const tmpTableList = [];
      data.forEach((element, index)=>{
        this.productdbService.getProductByID(element.productID)
        .then(f=>{
          element.productGroup = f[0].group;
          element.productName = f[0].product_name;
          element.productDescription = f[0].description;

          // setting transaction data
          element.paid = this.calcTransactionData(element.transactionHistory);
          element.totalAmount = element.sellingPrice * element.sellingQuantity;
          element.balance = element.totalAmount - element.paid;
          tmp.next([{
            ...element,
            serialNumber: index + 1
          }]);
        })
        .catch(err=>{
          console.error(err);
        });
      });

      // setting data to table
      tmp.subscribe(g=>{
        tmpTableList.push(g[0]);
        this.dataSource.data = tmpTableList;
      });
    });
  }

  calcTransactionData(transactionData: ISaleTransactions[]): any{
    const paidAmounts = transactionData.map(e=>e.paid);
    return paidAmounts.reduce((a, b)=> a+b, 0);
  }

  openAddDialog(): void {
    console.log('opening dialog box add sales..');
    const dialogRef = this.dialog.open(SalesDialogComponent, {
      width: '50%',
      data: this.salesData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        // this.electronService.insertProduct(result);
        this.salesdbService.insertSales(result);
      }
    });
  }

  onRowClick(e: any){
    console.log(e);
  }

  onRefresh(){
    this.getSalesList();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
