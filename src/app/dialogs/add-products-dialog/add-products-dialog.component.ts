import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { IProductData, IProductGroup } from '../../core/interfaces/interfaces';
import { Subject } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { ProductsdbService } from '../../core/services/productsdb.service';

@Component({
  selector: 'app-add-products-dialog',
  templateUrl: './add-products-dialog.component.html',
  styleUrls: ['./add-products-dialog.component.scss']
})
export class AddProductsDialogComponent implements OnInit {
  productName: string;
  productGroup: IProductGroup[];
  description: string;
  priceDirectSale: number;
  priceReseller: number;
  priceDealer: number;
  remarks: string;
  editCreate: string;
  form: FormGroup;

  private productGroupListObservable: Subject<IProductGroup[]>;

  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<AddProductsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProductData,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private productService: ProductsService,
    private productsDBservice: ProductsdbService
  ) {
    this.dialogRef.disableClose = true;
    this.productName = this.data.productName;
    this.description = this.data.description;
    this.remarks = this.data.remarks;
    this.priceDirectSale = this.data.priceDirectSale;
    this.priceReseller = this.data.priceReseller;
    this.priceDealer = this.data.priceDealer;
    this.editCreate = this.data.editCreate;

    this.form = this.fb.group(
      {
        productName: [this.productName, [Validators.required, Validators.maxLength(30)]],
        productGroup: [this.productGroup, [Validators.required]],
        description: [this.description, [Validators.required, Validators.maxLength(100)]],
        priceDirectSale: [this.priceDirectSale, [Validators.required, Validators.min(0)]],
        priceReseller: [this.priceReseller, [Validators.required, Validators.min(0)]],
        priceDealer: [this.priceDealer, [Validators.required, Validators.min(0)]],
        remarks: [this.remarks, [Validators.maxLength(100)]]
      }
    );

    if (this.data.productGroupName){
      this.form.controls.productGroup.setValue(this.data.productGroupID);
    }


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
        finalProductData.productGroupID = value.productGroup;
        finalProductData.productGroupName = this.productGroup.filter(d=> d.productGroupID === value.productGroup)[0].productGroupName;
        delete finalProductData.productGroup;
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
        finalProductData.productID = this.data.productID;
        finalProductData.productGroupID = value.productGroup;
        finalProductData.productGroupName = this.productGroup.filter(d=> d.productGroupID === value.productGroup)[0].productGroupName;
        finalProductData.editCreate = 'Edit';
        delete finalProductData.productGroup;
        this.dialogRef.close(finalProductData);
      }
    }
  }

  onDelete(): void{
    this.dialogRef.close({
      productID: this.data.productID,
      editCreate: 'Delete'
    });
  }

  ngOnInit(): void {
    this.productsDBservice.getAllProductGroups();
    this.productGroupListObservable = this.productService.getProductGroupList();
    this.productGroupListObservable.subscribe(productGroupData=>{
      this.productGroup = productGroupData;
    });

  }

}
