import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IMaterialData, IProductData, IProductionData, IProductionEntry } from '../../core/interfaces/interfaces';
import * as _moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../core/services/notification/notification.service';
import { ProductsService } from '../../core/services/products/products.service';
import { ProductsdbService } from '../../core/services/products/productsdb.service';
import { ProductiondbService } from '../../core/services/production/productiondb.service';
import { MaterialdbService } from '../../core/services/material/materialdb.service';
import { MaterialService } from '../../core/services/material/material.service';
import { EnumRouteActions } from '../../core/interfaces/enums';

const moment = _moment;

interface IProductGroupSelect {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-update-production',
  templateUrl: './add-update-production.component.html',
  styleUrls: ['./add-update-production.component.scss'],
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})
export class AddUpdateProductionComponent implements OnInit, OnDestroy {

  componentBehaviourFlag: boolean;
  form: FormGroup;
  formProductionEntry: FormGroup;
  selectedProductionData: IProductionData;

  addProductionEntryFlag: boolean;

  products: IProductData[];
  productsFiltered: IProductData[];
  productGroupFiltered: IProductGroupSelect[];
  materials: IMaterialData[];
  addedProductionEntries: IProductionEntry[];
  remarks: string;

  productQuantity: number;
  selectedMaterialCurrentStock: number;
  materialQuantity: number;
  productStock: number;

  displayedColumnsMaterialList: string[] = [
    'materialName',
    'quantity',
    'stock',
    'action'
  ];

  dataSourceMaterialList = new MatTableDataSource([]);
  date = new FormControl(moment());

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private productsDBservice: ProductsdbService,
    private productionDBservice: ProductiondbService,
    private materialDBservice: MaterialdbService,
    private materialService: MaterialService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private notificationService: NotificationService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {

    this.addProductionEntryFlag = false;
    this.selectedMaterialCurrentStock = 0;

    this.form = this.fb.group(
      {
        productGroup: ['', [Validators.required]],
        productName: ['', [Validators.required]],
        productQuantity: ['', [Validators.required]],
        remarks: [''],
      }
    );

    this.formProductionEntry = this.fb.group(
      {
        materialName: ['', [Validators.required]],
        materialQuantity: ['', [Validators.required]],
      }
    );

    this.matIconRegistry
      .addSvgIcon('add', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'add_icon.svg'))
      .addSvgIcon('close', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
      .addSvgIcon('plus', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
      .addSvgIcon('back', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'));
  }

  setProductionData() {

    this.selectedProductionData.productionEntries.forEach(data => {
      const tmp: IProductionEntry = {
        productionEntryID: data.productionEntryID,
        materialQuantity: data.materialQuantity,
        material: data.material
      };

      if (this.addedProductionEntries) {
        this.addedProductionEntries.push(tmp);
      } else {
        this.addedProductionEntries = [tmp];
      }
      this.dataSourceMaterialList.data = this.addedProductionEntries;
    });

    this.form.controls.productGroup.setValue(this.selectedProductionData.product.productGroup.productGroupID);
    this.productsFiltered = this.products
                                  .filter(data => data.productGroupID === this.selectedProductionData.product.productGroup.productGroupID);
    this.form.controls.productName.setValue(this.selectedProductionData.product.productID);
    this.form.controls.productQuantity.setValue(this.selectedProductionData.productQuantity);
    this.form.controls.remarks.setValue(this.selectedProductionData.remarks);
    this.date.setValue(moment(this.selectedProductionData.productionDate));
    this.productStock = 800;

  }

  getProductionEntriesToBeDeleted() {
    const productionEntriesToBeDeleted = [];
    const currentProductionEntryIDs = this.addedProductionEntries.map(d => d.productionEntryID);
    const prevProductionEntryIDs = this.selectedProductionData.productionEntries.map(d => d.productionEntryID);
    prevProductionEntryIDs.forEach(data => {
      if (!currentProductionEntryIDs.includes(data)) {
        productionEntriesToBeDeleted.push(data);
      }
    });

    return productionEntriesToBeDeleted;
  }

  onProductGroupChange(e): void {
    if (e.isUserInput) {
      this.productsFiltered = this.products.filter(data => data.productGroupID === e.source.value);
    }
  }

  onProductChange(e): void {
    if (e.isUserInput) {
      this.productStock = 800;
    }
  }

  onMaterialChange(e): void {
    if (e.isUserInput) {
      this.selectedMaterialCurrentStock = 100;
    }
  }

  onAddMaterial(): void {
    this.addProductionEntryFlag = !this.addProductionEntryFlag;
    this.formProductionEntry.reset();
  }

  onAddProductionEntry(): void {
    const { value, valid } = this.formProductionEntry;
    if (valid) {
      const tmp: IProductionEntry = {
        materialQuantity: value.materialQuantity,
        material: this.materials.filter(d => d.materialID === value.materialName)[0]
      };
      if (this.addedProductionEntries && (this.addedProductionEntries.some(d => d.material.materialID === value.materialName))) {
        this.notificationService.updateSnackBarMessageSubject('Material Entry already exists');
        return;
      }
      if (this.addedProductionEntries) {
        this.addedProductionEntries.push(tmp);
      } else {
        this.addedProductionEntries = [tmp];
      }

      this.addProductionEntryFlag = false;
      this.formProductionEntry.reset();
      this.dataSourceMaterialList.data = this.addedProductionEntries;
    }

  }

  onDeleteProductionEntry(materialID): void {
    this.addedProductionEntries = this.addedProductionEntries.filter(d => d.material.materialID !== materialID);
    this.dataSourceMaterialList.data = this.addedProductionEntries;

  }

  onProductionEntryCancel(): void {
    this.addProductionEntryFlag = false;
    this.formProductionEntry.reset();
  }

  onCreateProduction(): void {

    const { value, valid } = this.form;
    if (valid && this.addedProductionEntries && this.addedProductionEntries.length > 0) {
      const productionData: IProductionData = {
        productionDate: this.date.value.toDate(),
        productionEntries: this.addedProductionEntries,
        product: this.products.filter(d=> d.productID === value.productName)[0],
        productQuantity: value.productQuantity,
        remarks: value.remarks
      };

      this.productionDBservice.insertProduction(productionData)
        .then(_ => {
          this.notificationService.updateSnackBarMessageSubject('Production created successfully');
          this.router.navigate(['production']);
        })
        .catch(err => {
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to create production');
        });
    }
  }

  onUpdateProduction(): void {
    const { value, valid } = this.form;
    if (valid && this.addedProductionEntries && this.addedProductionEntries.length > 0) {
      const productionData: IProductionData = {
        productionID: this.selectedProductionData.productionID,
        productionDate: this.date.value.toDate(),
        productionEntries: this.addedProductionEntries,
        product: this.products.filter(d=> d.productID === value.productName)[0],
        productQuantity: value.productQuantity,
        cancelledDate: this.selectedProductionData.cancelledDate,
        completedDate: this.selectedProductionData.completedDate,
        remarks: value.remarks

      };

      if (this.getProductionEntriesToBeDeleted().length > 0) {
        this.productionDBservice.deleteProductionEntry(this.getProductionEntriesToBeDeleted())
        .then(_=>{
            this.updateProduction(productionData);
        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to update production');
        });
      } else {
        this.updateProduction(productionData);
      }
    }
  }

  updateProduction(productionData: IProductionData): void {
    this.productionDBservice.updateProduction(productionData)
          .then(__=>{
            this.notificationService.updateSnackBarMessageSubject('Production Updated successfully');
            this.router.navigate(['production/detail', this.selectedProductionData.productionID]);
          })
          .catch(err=>{
            console.log(err);
            this.notificationService.updateSnackBarMessageSubject('Unable to update production');
          });
  }

  onBack(): void {
    if (this.componentBehaviourFlag) {
      this.router.navigate(['production']);
    } else {
      this.router.navigate(['production/detail', this.selectedProductionData.productionID]);
    }
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.componentBehaviourFlag = params.createOrUpdate === EnumRouteActions.create ? true : false;

      this.productsDBservice.getProducts();
      this.productService.getProductList().pipe(takeUntil(this.destroy$)).subscribe(data => {

        // Assign list of products for drop down
        this.products = data;

        // Assign list of productGroups for drop down
        const tmp = data.map(d => ({
          viewValue: d.productGroupName,
          value: d.productGroupID
        }));
        tmp.forEach(d => {
          if (this.productGroupFiltered) {
            if (!(this.productGroupFiltered.some(e => e.value === d.value))) {
              this.productGroupFiltered.push(d);
            }
          } else {
            this.productGroupFiltered = [d];
          }
        });

      this.materialDBservice.getMaterials();
      this.materialService.getMaterialList().pipe(takeUntil(this.destroy$)).subscribe(d=>{
        this.materials = d;
      });

      if (params.createOrUpdate === EnumRouteActions.update) {
        this.activateRoute.data.subscribe(d=>{
          this.selectedProductionData = d.productionData;
          this.setProductionData();
        });
      }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
