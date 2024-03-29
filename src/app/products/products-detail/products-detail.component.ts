import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IProductData } from '../../core/interfaces/interfaces';
import { ProductsService } from '../../core/services/products/products.service';
import { ProductsdbService } from '../../core/services/products/productsdb.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { AddProductsDialogComponent } from '../../dialogs/add-products-dialog/add-products-dialog.component';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss']
})
export class ProductsDetailComponent implements OnInit {

  panelOpenState = false;

  selectedProductID: string;
  selectedProductData: IProductData;
  productDetail: any;
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService,
    private productDBService: ProductsdbService,
    private notificationService: NotificationService
  ) {
    this.selectedProductData = {
      productID: '',
      productName: '',
      productGroupID: '',
      productGroupName: '',
      description: '',
      priceDirectSale: 0,
      priceReseller: 0,
      priceDealer: 0,
      createdDate: new Date(),
      remarks: '',
    };
    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
  }

  setProductDetails(){
    this.productDetail = {
      productID: this.selectedProductData?.productID,
      createdDate: this.selectedProductData?.createdDate,
      productGroupName: this.selectedProductData?.productGroup.productGroupName,
      productName: this.selectedProductData?.productName,
      priceDealer: this.selectedProductData?.priceDealer,
      priceDirectSale: this.selectedProductData?.priceDirectSale,
      priceReseller: this.selectedProductData?.priceReseller,
      inProduction: this.selectedProductData?.inProduction,
      toBeSold: this.selectedProductData?.toBeSold,
      stock: this.selectedProductData?.stock,
      sold: this.selectedProductData?.sold,
      description: this.selectedProductData?.description,
      remarks: this.selectedProductData?.remarks
    };
  }

  onUpdateProduct(){
    const editProductData: IProductData = {
          ...this.selectedProductData,
          editCreate: 'Edit'
        };
    this.openEditDialog(editProductData);
  }

  onDeleteProduct(){
    this.productDBService.deleteProduct(this.selectedProductID)
    .then(_=>{
      console.log('INFO : deleted product');
      this.notificationService.updateSnackBarMessageSubject('Deleted product from DB');
      this.onBack();

    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to delete product from DB');

    });
  }

  openEditDialog(editProductData: IProductData): void {
    console.log('INFO : Opening dialog box edit product');
    const dialogRef = this.dialog.open(AddProductsDialogComponent, {
      width: '50%',
      data: editProductData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        console.log(result);
        this.productDBService.updateProduct(result);
      }
    });
  }

  ngOnInit(): void {
    this.selectedProductID = this.productService.getSelectedProductID();
    this.activatedRoute.data.subscribe(data=>{
      this.selectedProductData = data.productData;
      this.setProductDetails();
      this.productService.getSelectedProductData().subscribe(d=>{
        this.selectedProductData = d;
        this.setProductDetails();
      });
    });
  }

  onRefresh(){
    this.productDBService.getProductByID(this.selectedProductID);
  }

  onBack(){
    this.router.navigate(['products']);
  }

}
