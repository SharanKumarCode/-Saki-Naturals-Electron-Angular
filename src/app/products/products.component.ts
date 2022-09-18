import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { AddProductsDialogComponent } from '../dialogs/add-products-dialog/add-products-dialog.component';
import { IProductData } from './interfaces/productdata.interface';
import { ProductsService } from '../core/services/products.service';
import { Subject } from 'rxjs';
import { ProductsdbService } from '../core/services/productsdb.service';
import * as _moment from 'moment';
import { Router } from '@angular/router';

const moment = _moment;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy{

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
  private productListObservalble: Subject<IProductData[]>;

  constructor(
    private productdbservice: ProductsdbService,
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private productService: ProductsService,
    private router: Router
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
    this.productListObservalble = this.productService.getProductList();
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    // this.productListObservalble.unsubscribe();
  }

  openAddDialog(): void {
    console.log('opening dialog box add products..');
    const dialogRef = this.dialog.open(AddProductsDialogComponent, {
      width: '50%',
      data: this.productdata,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      console.log(result);
      if (result){
        this.productdbservice.insertProduct(result);
      }
    });
  }

  openEditDialog(editProductData: IProductData): void {
    console.log('opening dialog box edit/delete product..');
    const dialogRef = this.dialog.open(AddProductsDialogComponent, {
      width: '50%',
      data: editProductData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        if (result.editCreate === 'Delete'){
          this.productdbservice.deleteProduct(result.productID);
        } else if (result.editCreate === 'Edit'){
          this.productdbservice.updateProduct(result);
        }
      }
    });
  }

  getProducts(){
    this.productdbservice.getProducts();
    this.productListObservalble.subscribe(d=>{
      d.map((value, index)=>{
        console.log(value.createdDate);
        value.createdDate = value.createdDate.toString();
        return {
          ...value,
          serialNumber: index
        };
      }
      );
      const tmp = [];
      d.forEach((element, index)=>{
        tmp.push({
          ...element,
          serialNumber: index + 1
        });
      });
      this.dataSource = new MatTableDataSource(tmp);
    });
  }

  onRefresh(){
    this.productdbservice.getProducts();
  }

  onRowClick(e: any){
    // const editProductData: IProductData = {
    //   ...e,
    //   editCreate: 'Edit'
    // };
    // this.openEditDialog(editProductData);
    this.productService.updateSelectedProductID(e.productID);
    this.router.navigate(['product/detail']);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
