import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { SalesDialogComponent } from '../dialogs/sales-dialog/sales-dialog.component';

import { ElectronService } from '../core/services';
import { ProductsService } from '../core/services/products.service';

import { Subject } from 'rxjs';

import { EnumSaleType, ISalesData } from './interfaces/salesdata.interface';
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
                                'product_name',
                                'group',
                                'stock',
                                'priceDirectSale',
                                'priceReseller',
                                'priceDealer',
                                'sold',
                                'createdDate'];
  dataSource = new MatTableDataSource([]);

  private productdata: IProductData;
  private salesData: ISalesData;
  private productList: IProductData[];
  private productListObservalble: Subject<IProductData[]>;

  constructor(
    private electronService: ElectronService,
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private productService: ProductsService
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
      paid: 0,
      balance: 0,
      remarks: ''
    };
  }

  ngOnInit(): void {
    this.getProductList();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getProductList(){
    this.productService.getProductList().subscribe(data=>{
      this.productList = data;
    });
  }

  openAddDialog(): void {
    console.log('opening dialog box add sales..');
    const dialogRef = this.dialog.open(SalesDialogComponent, {
      width: '50%',
      data: this.salesData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      console.log(result);
      if (result){
        // this.electronService.insertProduct(result);
      }
    });
  }

  onRefresh(){

  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
