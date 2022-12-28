import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';
import { EnumSaleType } from '../../core/interfaces/interfaces';
import { ProductsService } from '../../core/services/products.service';
import { ProductsdbService } from '../../core/services/productsdb.service';

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
  selector: 'app-add-update-sale',
  templateUrl: './add-update-sale.component.html',
  styleUrls: ['./add-update-sale.component.scss']
})
export class AddUpdateSaleComponent implements OnInit {

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
  paid: number;
  balance: number;
  remarks: string;
  editCreate: string;
  date = new FormControl(moment());
  myTimePicker = '';

  tmplist = [];

  displayedColumnsProductList: string[] = [
    'position',
    'productGroup',
    'productName',
    'sellingPrice',
    'quantity',
    'amount',
    'action'
  ];

  dataSourceProductList = new MatTableDataSource([]);

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

  private path = 'assets/icon/';

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private productDBService: ProductsdbService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    this.matIconRegistry
    .addSvgIcon('add',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'add_icon.svg'))
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'));
  }

  onSaleTypeChange(saleType): void {
  }

  onPriceQuantityChange(): void {

  }

  ngOnInit(): void {
  }

  onCreateSale(): void {

  }

  onAddProduct(): void {
    const tmp = {
      position: 1,
      productGroup: 'Soap',
      productName: 'Coffee Soap',
      sellingPrice: 235.6,
      quantity: 10,
      amount: 2356.00,
    };
    this.tmplist.push(tmp);
    this.dataSourceProductList.data = this.tmplist;
  }

  onProductDelete(): void {
    const tmp = this.dataSourceProductList.data;
    tmp.pop();
    this.dataSourceProductList.data = tmp;
  }

  onBack(): void {

  }

}
