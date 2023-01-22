import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { IProductData, IProductGroup } from '../../core/interfaces/interfaces';
import { Subject } from 'rxjs';
import { ProductsService } from '../../core/services/products/products.service';
import { ProductsdbService } from '../../core/services/products/productsdb.service';

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

    if (this.data.productGroup?.productGroupName){
      this.form.controls.productGroup.setValue(this.data.productGroup.productGroupID);
      this.form.controls.productGroup.disable();
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
    console.log(this.productGroup.filter(d=> d.productGroupID === value.productGroup)[0]);

    if (valid) {
      if (value.priceDealer === 0 && value.priceDirectSale === 0 && value.priceReseller === 0){
        this.snackbar.open('Please provide alteast one Price.', 'close');
      } else {
        const finalProductData: IProductData = {
          productName: value.productName,
          description: value.description,
          productGroup: {
            productGroupID: value.productGroup,
            productGroupName: this.productGroup
                      .filter(d=> d.productGroupID === value.productGroup)[0].productGroupName
          },
          priceDealer: value.priceDealer,
          priceDirectSale: value.priceDirectSale,
          priceReseller: value.priceReseller,
          remarks: value.remarks
        };
        this.dialogRef.close(finalProductData);
        };
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
        finalProductData.productGroup = this.data.productGroup;
        finalProductData.editCreate = 'Edit';
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
