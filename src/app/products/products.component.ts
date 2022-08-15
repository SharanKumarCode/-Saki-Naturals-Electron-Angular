import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AddProductsDialogComponent } from '../dialogs/add-products-dialog/add-products-dialog.component';
import { ElectronService } from '../core/services';
import { IProductData } from './interfaces/productdata.interface';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  private productdata: IProductData;

  constructor(
    private electronService: ElectronService,
    public dialog: MatDialog
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
    this.electronService.getProducts();
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

  onRefresh(){
  }

}
