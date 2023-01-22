import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IProductGroup } from '../../core/interfaces/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsdbService } from '../../core/services/products/productsdb.service';
import { Subject } from 'rxjs';
import { ProductsService } from '../../core/services/products/products.service';


@Component({
  selector: 'app-product-group-dialog',
  templateUrl: './product-group-dialog.component.html',
  styleUrls: ['./product-group-dialog.component.scss']
})
export class ProductGroupDialogComponent implements OnInit {

  productGroup: string;
  productGroupList: IProductGroup[];
  form: FormGroup;

  private productGroupListObservable: Subject<IProductGroup[]>;
  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<ProductGroupDialogComponent>,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private snackbar: MatSnackBar,
    private productService: ProductsService,
    private productsDBservice: ProductsdbService
  ) {
    this.dialogRef.disableClose = true;
    this.form = this.fb.group(
      {
        productGroup: [this.productGroup, [Validators.required, Validators.maxLength(20)]],
      }
    );

    this.matIconRegistry
    .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));
   }

  ngOnInit(): void {
    this.productsDBservice.getAllProductGroups();
    this.productGroupListObservable = this.productService.getProductGroupList();
    this.productGroupListObservable.subscribe(productGroupData=>{
      this.productGroupList = productGroupData;
    });
  }

  onAddProductGroup(): void {
    const {value, valid} = this.form;
    const productGroupNameExistFlag = this.productGroupList ?
                                      this.productGroupList.findIndex(
                                        item=>item.productGroupName.toLowerCase() === value.productGroup.toLowerCase())
                                      : -1;
    if (valid){
      if (productGroupNameExistFlag === -1){
        this.productsDBservice.insertProductGroup({
          productGroupName: value.productGroup,
        });
      } else {
        this.snackbar.open('Product group name already exists', 'close');
      }

    }
  }

  onDeleteProductGroup(selectedProductGroupID: string): void {
    this.productsDBservice.deleteProductGroup(selectedProductGroupID);
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
