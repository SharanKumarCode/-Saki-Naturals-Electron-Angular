import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { AddProductsDialogComponent } from '../dialogs/add-products-dialog/add-products-dialog.component';
import { ElectronService } from '../core/services';
import { IProductData } from './interfaces/productdata.interface';

const PRODUCT_DATA_DUMMY: IProductData[] = [
  {
    productName: 'Herbal Soap',
    description: 'Bid Soap',
    group: 'Soap',
    stock: 19,
    priceDirectSale: 36.3,
    priceReseller: 46.5,
    priceDealer: 96.3,
    createdDate: new Date(),
    sold: 56,
  },
  {
    productName: 'Traditional Cream',
    group: 'Cream',
    description: 'Bid Cream',
    stock: 4569,
    priceDirectSale: 5.3,
    priceReseller: 0,
    priceDealer: 59,
    createdDate: new Date('Mon Aug 19 2022'),
    sold: 46,
  },
];

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit{

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['product_name', 'group', 'stock', 'priceDirectSale', 'priceReseller', 'priceDealer', 'sold', 'createdDate'];
  dataSource = new MatTableDataSource(PRODUCT_DATA_DUMMY);

  private productdata: IProductData;

  constructor(
    private electronService: ElectronService,
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer
    ) {
      this.productdata = {
        productName: '',
        group: '',
        description: '',
        stock: 0,
        priceDirectSale: 0,
        priceReseller: 0,
        priceDealer: 0,
        sold: 0,
      };
    }

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  openDialog(): void {
    console.log('opening dialog box add products..');
    const dialogRef = this.dialog.open(AddProductsDialogComponent, {
      width: '50%',
      data: this.productdata,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      console.log(result);
      this.electronService.insertProduct(result);
    });
  }

  getProducts(){
    const res = this.electronService.getProducts();
    console.log('called get products')
    console.log(res);
  }

  onRefresh(){
  }

  onRowClick(e: any){
    console.log(e);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
