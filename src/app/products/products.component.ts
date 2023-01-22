import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { AddProductsDialogComponent } from '../dialogs/add-products-dialog/add-products-dialog.component';
import { ProductsService } from '../core/services/products/products.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductsdbService } from '../core/services/products/productsdb.service';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IProductData } from '../core/interfaces/interfaces';
import { ProductGroupDialogComponent } from '../dialogs/product-group-dialog/product-group-dialog.component';

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
                                'priceDirectSale',
                                'priceReseller',
                                'priceDealer',
                                'inProduction',
                                'stock',
                                'sold'];
  dataSource = new MatTableDataSource([]);

  private productdata: IProductData;
  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    private productdbservice: ProductsdbService,
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private productService: ProductsService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
    ) {
      this.productdata = {
        productName: '',
        productGroupID: '',
        productGroupName: '',
        description: '',
        stock: 0,
        priceDirectSale: 0,
        priceReseller: 0,
        priceDealer: 0,
        sold: 0,
      };

      this.matIconRegistry
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'))
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'));

    }

  openProductGroupDialog(): void {
    console.log('INFO : Opening dialog box add product group..');
    const dialogRef = this.dialog.open(ProductGroupDialogComponent, {
      width: '50%', height: '80%'
    });

    dialogRef.afterClosed().subscribe(_ => {
      console.log('INFO : The dialog box is closed');
    });
  }

  openAddDialog(): void {
    console.log('INFO : Opening dialog box add products..');
    const dialogRef = this.dialog.open(AddProductsDialogComponent, {
      width: '50%',
      data: this.productdata,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      if (result){
        this.productdbservice.insertProduct(result);
      }
    });
  }

  setProductsData(data: IProductData[]){
    data.map((value, index)=>{
      value.createdDate = value.createdDate;
      return {
        ...value,
        serialNumber: index
      };
    }
    );
    const tmp = [];
    data.forEach((element, index)=>{
      tmp.push({
        ...element,
        serialNumber: index + 1
      });
    });
    this.dataSource = new MatTableDataSource(tmp);
  }

  onRefresh(){
    this.productdbservice.getProducts();
  }

  onRowClick(e: any){
    this.router.navigate(['product/detail', e.productID]);
  }

  ngOnInit(): void {
    this.productdbservice.getProducts();
    this.productService.getProductList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setProductsData(data);
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
