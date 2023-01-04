import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { ProductsdbService } from '../../core/services/productsdb.service';
import { IProductData } from '../interfaces/productdata.interface';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss']
})
export class ProductsDetailComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  panelOpenState = false;

  displayedColumns: string[] = [
                                  'serial_number',
                                  'purchaser',
                                  'supplier',
                                  'saleType',
                                  'sellingPrice',
                                  'soldQuantity',
                                  'totalAmount',
                                  'paidAmount',
                                  'balanceAmount',
                                  'salesDate'
                                ];
  selectedProductID: string;
  selectedProductData: IProductData;
  dataSource = new MatTableDataSource([]);
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private productService: ProductsService,
    private productDBService: ProductsdbService
  ) {
    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
  }

  getProductData(){
    this.productDBService.getProductByID(this.selectedProductID)
    .then(data=>{
      console.log(data);
      this.selectedProductData = data[0];
      console.log(this.selectedProductData);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  onUpdateProduct(){

  }

  onDeleteProduct(){

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.selectedProductID = this.productService.getSelectedProductID();
    this.getProductData();
  }

  onRowClick(e: any){
    console.log(e);
  }

  onRefresh(){
  }

  onBack(){
    this.router.navigate(['products']);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
