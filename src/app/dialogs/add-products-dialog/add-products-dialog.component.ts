import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { IProductData } from '../../products/interfaces/productdata.interface';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-add-products-dialog',
  templateUrl: './add-products-dialog.component.html',
  styleUrls: ['./add-products-dialog.component.scss']
})
export class AddProductsDialogComponent implements OnInit {
  productName: string;
  group: string;
  description: string;
  stock: number;
  priceDirectSale: number;
  priceReseller: number;
  priceDealer: number;
  sold: number;
  editCreate: string;
  form: FormGroup;

  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<AddProductsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProductData,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    this.productName = this.data.productName;
    this.description = this.data.description;
    this.group = this.data.group;
    this.stock = this.data.stock;
    this.priceDirectSale = this.data.priceDirectSale;
    this.priceReseller = this.data.priceReseller;
    this.priceDealer = this.data.priceDealer;
    this.sold = this.data.sold;
    this.editCreate = this.data.editCreate;

    this.form = this.fb.group(
      {
        productName: [this.productName, [Validators.required, Validators.maxLength(30)]],
        group: [this.group, [Validators.required, Validators.maxLength(20)]],
        description: [this.description, [Validators.required, Validators.maxLength(50)]],
        stock: [this.stock, [Validators.required, Validators.min(0)]],
        priceDirectSale: [this.priceDirectSale, [Validators.required, Validators.min(0)]],
        priceReseller: [this.priceReseller, [Validators.required, Validators.min(0)]],
        priceDealer: [this.priceDealer, [Validators.required, Validators.min(0)]],
        sold: [this.sold, [Validators.required, Validators.min(0)]],
      }
    );

    this.matIconRegistry
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void{
    const {value, valid} = this.form;
    if (valid) {
      if (value.priceDealer === 0 && value.priceDirectSale === 0 && value.priceReseller === 0){
        this.snackbar.open('Please provide alteast one Price.', 'close');
      } else {
        const finalProductData = value;
        finalProductData.remarks = '';
        finalProductData.createdDate = moment()['_d'].toString();
        this.dialogRef.close(finalProductData);
      }
    }
  }

  onUpdate(): void {
    const {value, valid} = this.form;
    if (valid) {
      if (value.priceDealer === 0 && value.priceDirectSale === 0 && value.priceReseller === 0){
        this.snackbar.open('Please provide alteast one Price.', 'close');
      } else {
        const finalProductData = value;
        finalProductData.productID = this.data.productId;
        finalProductData.editCreate = 'Edit';
        this.dialogRef.close(finalProductData);
      }
    }
  }

  onDelete(): void{
    this.dialogRef.close({
      productID: this.data.productId,
      editCreate: 'Delete'
    });
  }

  ngOnInit(): void {
  }

}
