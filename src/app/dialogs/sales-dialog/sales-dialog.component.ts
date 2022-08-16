import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { EnumSaleType, ISalesData } from '../../sales/interfaces/salesdata.interface';
import { ProductsService } from '../../core/services/products.service';
import { ElectronService } from '../../core/services';
import { IProductData } from '../../products/interfaces/productdata.interface';

import * as _moment from 'moment';

const moment = _moment;

interface IProductGroup {
  value: string;
  viewValue: string;
}

interface IProductNames {
  value: string;
  viewValue: string;
}

interface ISaleType{
  value: EnumSaleType;
  viewValue: string;
}

@Component({
  selector: 'app-sales-dialog',
  templateUrl: './sales-dialog.component.html',
  styleUrls: ['./sales-dialog.component.scss']
})
export class SalesDialogComponent implements OnInit {

  form: FormGroup;
  productID: string;
  productName: string;
  currentStock: number;
  group: string;
  saleDate: string;
  saleTime: string;
  purchaser: string;
  supplier: string;
  saleType: EnumSaleType;
  sellingPrice: number;
  sellingQuantity: number;
  totalAmount: number;
  stockAfterSale: number;
  paid: number;
  balance: number;
  remarks: string;
  editCreate: string;
  date = new FormControl(moment());
  myDatePicker = new FormControl(new Date());
  myTimePicker = '';

  productGroups: IProductGroup[] = [
    {
      value: 'Soap',
      viewValue: 'Soap'
    },
    {
      value: 'Cream',
      viewValue: 'Cream'
    },
    {
      value: 'Shampoo',
      viewValue: 'Shampoo'
    },
  ];

  saleTypeList: ISaleType[] = [
    {
      viewValue: 'Dealer',
      value: EnumSaleType.dealer
    },
    {
      viewValue: 'Direct Sale',
      value: EnumSaleType.directSale
    },
    {
      viewValue: 'Reseller',
      value: EnumSaleType.reseller
    },
  ];

  productList: IProductData[];
  productNames: IProductNames[] = [];

  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<SalesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISalesData,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private productService: ProductsService,
    private electronService: ElectronService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    this.productID = this.data.productID;
    this.productName = this.data.productName;
    this.currentStock = this.data.currentStock;
    this.group = this.data.group;
    this.saleDate = this.data.saleDate;
    this.purchaser = this.data.purchaser;
    this.supplier = this.data.supplier;
    this.saleType = this.data.saleType;
    this.sellingPrice = this.data.sellingPrice;
    this.sellingQuantity = this.data.sellingQuantity;
    this.stockAfterSale = this.currentStock - this.sellingQuantity;
    this.totalAmount = this.sellingPrice * this.sellingQuantity;
    this.paid = this.data.paid;
    this.balance = this.totalAmount - this.paid;
    this.editCreate = this.data.editCreate;

    this.form = this.fb.group(
      {
        productgroups: [this.group, [Validators.required]],
        productNames: [this.productName, [Validators.required]],
        saleTypeList: [this.saleTypeList, [Validators.required]],
        purchaser: [this.purchaser, [Validators.required]],
        supplier: [this.supplier, [Validators.required]],
        sellingPrice: [this.sellingPrice, [Validators.required]],
        sellingQuantity: [this.sellingQuantity, [Validators.required]],
        stockAfterSale: [{value:this.stockAfterSale, disabled: true}, [Validators.required]],
        totalAmount: [{value:this.totalAmount, disabled: true}, [Validators.required]],
        paidAmount: [this.stockAfterSale, [Validators.required]],
        balanceAmount: [{value:this.balance, disabled: true}, [Validators.required]]
      }
    );

    this.matIconRegistry
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));

    dialogRef.disableClose = true;
  }

  onGroupChange(group): void {
    let selectedGroup: string;
    if (group.isUserInput){
      this.productNames = [];
      selectedGroup = group.source.value;
      this.productList.forEach(value=>{
        if (value.group === selectedGroup){
          this.productNames.push({
            value: value.productId,
            viewValue: value.productName
          });
        }
      });
    }
  }

  onProductNameChange(name): void {
    if(name.isUserInput){
      console.log(name.source.value);
      this.productID = name.source.value;
      const tmp = this.productList.filter(e=>e.productId === this.productID);
      this.currentStock = tmp[0].stock;
      console.log(this.currentStock);
      this.onPriceQuantityChange();
    }
  }

  onPriceQuantityChange(): void {
    const totalAmount = this.form.controls.sellingPrice.value * this.form.controls.sellingQuantity.value;
    this.form.controls.totalAmount.setValue(totalAmount);
    const balanceAmount = this.form.controls.totalAmount.value - this.form.controls.paidAmount.value;
    this.form.controls.balanceAmount.setValue(balanceAmount);
    const stockAfterSale = this.currentStock - this.form.controls.sellingQuantity.value;
    this.form.controls.stockAfterSale.setValue(stockAfterSale);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void{
    const {value, valid} = this.form;
    if (valid) {
      const finalSalesData = value;
      this.dialogRef.close(finalSalesData);
    }
  }

  onUpdate(): void {
    // const {value, valid} = this.form;
    // if (valid) {
    //   if (value.priceDealer === 0 && value.priceDirectSale === 0 && value.priceReseller === 0){
    //     this.snackbar.open('Please provide alteast one Price.', 'close');
    //   } else {
    //     const finalProductData = value;
    //     finalProductData.productID = this.data.productId;
    //     finalProductData.editCreate = 'Edit';
    //     this.dialogRef.close(finalProductData);
    //   }
    // }
  }

  onDelete(): void{
    this.dialogRef.close({
      salesID: this.data.salesID,
      editCreate: 'Delete'
    });
  }

  ngOnInit(): void {
    this.electronService.getProducts();
    this.productService.getProductList().subscribe(data=>{
      this.productList = data;
      const groups: IProductGroup[] = [];
      data.forEach(value=>{
        if (groups.filter(e=>e.value === value.group).length === 0){
          groups.push({
            viewValue: value.group,
            value: value.group
          });
        }
      });
      this.productGroups = groups;
    });
  }

}
