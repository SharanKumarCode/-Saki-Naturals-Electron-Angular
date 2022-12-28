import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ProductsService } from '../../core/services/products.service';

import * as _moment from 'moment';
import { ProductsdbService } from '../../core/services/productsdb.service';
import { EnumSaleType, IProductData, ISalesData, ISaleTransactionComplete, ISaleTransactions } from '../../core/interfaces/interfaces';

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
    private productDBService: ProductsdbService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    console.log(this.data);
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
    this.paid = 0;
    this.balance = this.totalAmount - this.paid;
    this.editCreate = this.data.editCreate;
    this.remarks = this.data.remarks;

    this.form = this.fb.group(
      {
        productgroups: [this.group, [Validators.required]],
        productNames: [this.productName, [Validators.required]],
        saleTypeList: [this.saleTypeList, [Validators.required]],
        purchaser: [this.purchaser, [Validators.required]],
        supplier: [this.supplier, [Validators.required]],
        sellingPrice: [{value:this.sellingPrice, disabled: true}, [Validators.required]],
        sellingQuantity: [this.sellingQuantity, [Validators.required]],
        stockAfterSale: [{value:this.stockAfterSale, disabled: true}, [Validators.required]],
        totalAmount: [{value:this.totalAmount, disabled: true}, [Validators.required]],
        paidAmount: [this.paid, [Validators.required]],
        balanceAmount: [{value:this.balance, disabled: true}, [Validators.required]],
        remarks: [this.remarks]
      }
    );

    this.matIconRegistry
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));

    dialogRef.disableClose = true;

  }

  onGroupChange(group): void {
    if (group.isUserInput){
      this.fetchAndSetProductsList(group.source.value);
    }
  }

  onProductNameChange(name): void {
    if(name.isUserInput){
      this.productID = name.source.value;
      this.setCurrentStock();
      this.onPriceQuantityChange();
    }

    // set selling price if sale type is selected
    if(typeof this.form.controls.saleTypeList.value == 'string'){
      this.setSellingPrice(this.form.controls.saleTypeList.value);
    }
  }

  onSaleTypeChange(saleType): void {
    if(saleType.isUserInput && this.productID){
      this.setSellingPrice(saleType.source.value);
    }
  }

  onPriceQuantityChange(): void {
    const totalAmount = this.sellingPrice * this.form.controls.sellingQuantity.value;
    this.form.controls.totalAmount.setValue(totalAmount);
    const balanceAmount = this.form.controls.totalAmount.value - this.form.controls.paidAmount.value;
    this.form.controls.balanceAmount.setValue(balanceAmount);
    const stockAfterSale = this.currentStock - this.form.controls.sellingQuantity.value;
    this.form.controls.stockAfterSale.setValue(stockAfterSale);
  }

  setDefaultTableValue(){
    this.form.controls.productgroups.setValue(this.productGroups.filter(e=>e.value===this.data.group)[0].value);
    this.fetchAndSetProductsList(this.data.group);
    this.form.controls.productNames.setValue(this.productNames.filter(e=>e.value===this.data.productID)[0].value);
    this.form.controls.saleTypeList.setValue(this.saleTypeList.filter(e=>e.value===this.data.saleType)[0].value);
    this.setCurrentStock();
    this.form.controls.stockAfterSale.setValue(this.currentStock - this.form.controls.sellingQuantity.value);
    this.date.setValue(moment(this.data.saleDate));
  }

  fetchAndSetProductsList(group: string){
    this.productNames = [];
    this.productList.forEach(value=>{
      if (value.productGroupName === group){
        this.productNames.push({
          value: value.productID,
          viewValue: value.productName
        });
      }
    });
  }

  setSellingPrice(saleType): void{
    const tmp = this.productList.filter(e=>e.productID === this.productID);
      switch (saleType) {
        case EnumSaleType.dealer:
          this.sellingPrice = tmp[0].priceDealer;
          break;

        case EnumSaleType.directSale:
          this.sellingPrice = tmp[0].priceDirectSale;
          break;

        case EnumSaleType.reseller:
          this.sellingPrice = tmp[0].priceReseller;
          break;

        default:
          break;
      }
  }

  setCurrentStock(): void{
    const tmp = this.productList.filter(e=>e.productID === this.productID);
    this.currentStock = tmp[0].stock;
    console.log(this.currentStock);
  }

  setFinalSaleData(): ISaleTransactionComplete{
    const saleData: ISalesData = {
      productID: this.productID,
      saleDate: this.date.value.toString(),
      purchaser: this.form.controls.purchaser.value,
      supplier: this.form.controls.supplier.value,
      saleType: this.saleType,
      sellingPrice: this.sellingPrice,
      sellingQuantity: this.form.controls.sellingQuantity.value,
      remarks: this.form.controls.remarks.value
    };

    const transactionData: ISaleTransactions = {
      transactionDate: this.date.value.toDate(),
      amount: this.form.controls.paidAmount.value,
      remarks: this.form.controls.remarks.value
    };

    const completeSaleData: ISaleTransactionComplete = {
      saleData,
      transactionData
    };

    return completeSaleData;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void{
    const {value, valid} = this.form;
    if (valid) {
      const finalSalesData = this.setFinalSaleData();
      this.dialogRef.close(finalSalesData);
    }
  }

  ngOnInit(): void {
    this.productDBService.getProducts();
    this.productService.getProductList().subscribe(data=>{
      this.productList = data;
      console.log(this.productList);
      const groups: IProductGroup[] = [];
      data.forEach(value=>{
        if (groups.filter(e=>e.value === value.productGroupName).length === 0){
          groups.push({
            viewValue: value.productGroupName,
            value: value.productGroupID
          });
        }
      });
      this.productGroups = groups;

      if (this.editCreate === 'Edit'){
        this.setDefaultTableValue();
      }
    });
  }

}
