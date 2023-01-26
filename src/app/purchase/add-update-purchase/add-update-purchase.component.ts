import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { EnumClientType,
          EnumRouteActions,
          IClientData,
          IMaterialData,
          IPurchaseData,
          IPurchaseEntry
        } from '../../core/interfaces/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { MaterialService } from '../../core/services/material/material.service';
import { MaterialdbService } from '../../core/services/material/materialdb.service';
import { ClientdbService } from '../../core/services/client/clientdb.service';
import { ClientService } from '../../core/services/client/client.service';
import { PurchasedbService } from '../../core/services/purchase/purchasedb.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { NotificationService } from '../../core/services/notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

const moment = _moment;

@Component({
  selector: 'app-add-update-purchase',
  templateUrl: './add-update-purchase.component.html',
  styleUrls: ['./add-update-purchase.component.scss'],
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})
export class AddUpdatePurchaseComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formPurchaseEntry: FormGroup;
  selectedPurchaseData: IPurchaseData;

  addPurchaseEntryFlag: boolean;
  materialID: string;
  suppliers: IClientData[];
  materials: IMaterialData[];
  materialsFiltered: IMaterialData[];
  materialName: string;
  currentStock: number;
  purchaseDate: string;
  supplier: string;
  netPrice: number;
  selectedSellingPrice: number;
  sellingQuantity: number;
  totalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  materialTotalPrice: number;
  quantity: number;

  overallDiscountPercentage: number;
  overallDiscountAmount: number;
  gstPercentage: number;
  gstAmount: number;
  transportCharges: number;
  miscCharges: number;
  paymentTerms: number;
  remarks: string;

  editCreate: string;
  date = new FormControl(moment());
  myTimePicker = '';
  addedPurchaseEntries: IPurchaseEntry[];

  tmplist = [];

  displayedColumnsMaterialList: string[] = [
    'materialName',
    'netPrice',
    'quantity',
    'discountPercentage',
    'discountAmount',
    'amount',
    'action'
  ];

  dataSourceMaterialList = new MatTableDataSource([]);

  componentBehaviourFlag: boolean;

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private materialDBservice: MaterialdbService,
    private clientDBservice: ClientdbService,
    private clientService: ClientService,
    private purchaseDBservice: PurchasedbService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private notificationService: NotificationService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {

    this.addPurchaseEntryFlag = false;

    this.form = this.fb.group(
      {
        supplier: ['', [Validators.required]],
        remarks: [''],
        totalAmount: [{ value: 0, disabled: true }],
        overallDiscountPercentage: [0],
        overallDiscountAmount: [0],
        gstPercentage: [0],
        gstAmount: [0],
        transportCharges: [0],
        miscCharges: [0],
        paymentTerms: [0],
      }
    );

    this.formPurchaseEntry = this.fb.group(
      {
        materialName: ['', [Validators.required]],
        quantity: ['', [Validators.required]],
        netPrice: ['', [Validators.required]],
        discountPercentage: [0],
        discountAmount: [0],
        materialTotalPrice: [{ value: 0, disabled: true }]

      }
    );


    this.matIconRegistry
      .addSvgIcon('add', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'add_icon.svg'))
      .addSvgIcon('close', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
      .addSvgIcon('plus', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
      .addSvgIcon('back', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'));
  }

  getPurchaseEntryTotalAmount(): number {
    return this.addedPurchaseEntries ?
      this.addedPurchaseEntries.map(d => d.price * d.quantity - (d.price * d.quantity * d.discountPercentage / 100))
        .reduce((partialSum, a) => partialSum + a, 0) : 0;
  }

  getPurchaseEntriesToBeDeleted() {
    const purchaseEntriesToBeDeleted = [];
    const currentPurchaseEntryIDs = this.addedPurchaseEntries.map(d => d.purchaseEntryID);
    const prevPurchaseEntryIDs = this.selectedPurchaseData.purchaseEntries.map(d => d.purchaseEntryID);
    prevPurchaseEntryIDs.forEach(data => {
      if (!currentPurchaseEntryIDs.includes(data)) {
        purchaseEntriesToBeDeleted.push(data);
      }
    });

    return purchaseEntriesToBeDeleted;
  }

  setPurchaseData() {

    this.selectedPurchaseData.purchaseEntries.forEach(data => {
      if (!data.returnFlag){
        const tmp: IPurchaseEntry = {
          purchaseEntryID: data.purchaseEntryID,
          quantity: data.quantity,
          price: data.price,
          discountPercentage: data.discountPercentage,
          material: data.material
        };

        if (this.addedPurchaseEntries) {
          this.addedPurchaseEntries.push(tmp);
        } else {
          this.addedPurchaseEntries = [tmp];
        }
        this.dataSourceMaterialList.data = this.addedPurchaseEntries;
      }
    });

    this.form.controls.supplier.setValue(this.selectedPurchaseData.supplier.clientID);
    this.form.controls.remarks.setValue(this.selectedPurchaseData.remarks);
    this.form.controls.overallDiscountPercentage.setValue(this.selectedPurchaseData.overallDiscountPercentage);
    this.form.controls.gstPercentage.setValue(this.selectedPurchaseData.gstPercentage);
    this.form.controls.transportCharges.setValue(this.selectedPurchaseData.transportCharges);
    this.form.controls.miscCharges.setValue(this.selectedPurchaseData.miscCharges);
    this.form.controls.paymentTerms.setValue(this.selectedPurchaseData.paymentTerms);
    this.date.setValue(moment(this.selectedPurchaseData.purchaseDate));

    this.onOverallDiscountPercentageChange();
  }

  setSelectedSellingPrice(materialValue_ = undefined): void {
    // const saleTypeValue = saleTypeValue_ ? saleTypeValue_ : this.form.controls.saleTypeList.value;

    // if (this.materialsFiltered && this.addPurchaseEntryFlag) {
    //   const selectedProductvalue = materialValue_ ? materialValue_ : this.formPurchaseEntry.controls.productName.value;
    //   const selectedProduct = this.materialsFiltered.filter(data => data.materialID === selectedProductvalue)[0];

    //   switch (saleTypeValue) {
    //     case EnumSaleType.dealer:
    //       this.formPurchaseEntry.controls.netPrice.setValue(selectedProduct.priceDealer);
    //       break;
    //     case EnumSaleType.directSale:
    //       this.formPurchaseEntry.controls.netPrice.setValue(selectedProduct.priceDirectSale);
    //       break;
    //     case EnumSaleType.reseller:
    //       this.formPurchaseEntry.controls.netPrice.setValue(selectedProduct.priceReseller);
    //       break;
    //     default:
    //       break;
    //   }
    // }

    // if (this.addedPurchaseEntries && this.addedPurchaseEntries.length > 0) {
    //   const tmp: ISaleEntry[] = [];
    //   this.addedPurchaseEntries.forEach(d => {
    //     const tmpData: ISaleEntry = d;

    //     switch (saleTypeValue) {
    //       case EnumSaleType.dealer:
    //         tmpData.price = d.material.priceDealer;
    //         break;
    //       case EnumSaleType.directSale:
    //         tmpData.price = d.material.priceDirectSale;
    //         break;
    //       case EnumSaleType.reseller:
    //         tmpData.price = d.material.priceReseller;
    //         break;
    //       default:
    //         break;
    //     }
    //     tmp.push(d);
    //   });

    //   this.dataSourceMaterialList.data = tmp;
    //   this.onOverallDiscountPercentageChange();
    //   this.setAmounts();
    // }

    // this.onDiscountAmountChange();
  }

  setMaterialTotalPrice(): void {
    this.formPurchaseEntry.controls.materialTotalPrice.setValue(
      ((this.formPurchaseEntry.controls.netPrice.value *
        this.formPurchaseEntry.controls.quantity.value) - this.formPurchaseEntry.controls.discountAmount.value).toFixed(2)
    );
  }

  setAmounts(): void {
    const { value } = this.form;
    this.totalAmount = this.getPurchaseEntryTotalAmount();
    this.totalAmount += value.transportCharges +
      value.miscCharges +
      value.gstAmount -
      value.overallDiscountAmount;
  }

  onPurchaseTypeChange(purchaseType): void {
    if (purchaseType.isUserInput) {
      this.setSelectedSellingPrice(purchaseType.source.value);
    }
  }

  onMaterialChange(e): void {
    if (e.isUserInput) {
      this.setSelectedSellingPrice(e.source.value);
    }
  }

  onDiscountPercentageChange(): void {
    const { value } = this.formPurchaseEntry;
    if (value.discountPercentage !== null){
      this.formPurchaseEntry.controls.discountAmount.setValue((this.formPurchaseEntry.controls.netPrice.value * value.quantity *
        (value.discountPercentage / 100)).toFixed(2));
      this.setMaterialTotalPrice();
    }
  }

  onDiscountAmountChange(): void {
    const { value } = this.formPurchaseEntry;
    this.formPurchaseEntry.controls.discountPercentage.setValue(((value.discountAmount * 100)
                                      / (this.formPurchaseEntry.controls.netPrice.value * value.quantity)).toFixed(2));
    this.setMaterialTotalPrice();
  }

  onOverallDiscountPercentageChange(): void {
    const { value } = this.form;

    const totAmt = this.getPurchaseEntryTotalAmount();
    const discAmount = parseFloat((value.overallDiscountPercentage * totAmt / 100).toFixed(2));
    this.form.controls.overallDiscountAmount.setValue(discAmount);

    this.onGSTpercentageChange();
    this.setAmounts();
  }

  onOverallDiscountAmountChange(): void {
    const { value } = this.form;

    const totAmt = this.getPurchaseEntryTotalAmount();
    const discPercent = parseFloat((value.overallDiscountAmount * 100 / totAmt).toFixed(2));
    this.form.controls.overallDiscountPercentage.setValue(discPercent);

    this.onGSTpercentageChange();
    this.setAmounts();
  }

  onGSTpercentageChange(): void {
    const { value } = this.form;

    const totAmt = this.getPurchaseEntryTotalAmount();
    const gstAmount = parseFloat(((totAmt - value.overallDiscountAmount) * value.gstPercentage / 100).toFixed(2));
    this.form.controls.gstAmount.setValue(gstAmount);

    this.setAmounts();

  }

  onGSTamountChange(): void {
    const { value } = this.form;

    const totAmt = this.getPurchaseEntryTotalAmount();
    const gstPercent = parseFloat(((value.gstAmount / (totAmt - value.overallDiscountAmount)) * 100).toFixed(2));
    this.form.controls.gstPercentage.setValue(gstPercent);
    this.setAmounts();

  }

  onAddMaterial(): void {
    this.addPurchaseEntryFlag = !this.addPurchaseEntryFlag;
    this.formPurchaseEntry.reset();
  }

  onAddPurchaseEntry(): void {
    const { value, valid } = this.formPurchaseEntry;
    if (valid) {
      const tmp: IPurchaseEntry = {
        quantity: value.quantity,
        price: this.formPurchaseEntry.controls.netPrice.value,
        discountPercentage: this.formPurchaseEntry.controls.discountPercentage.value,
        material: this.materials.filter(d => d.materialID === value.materialName)[0]
      };
      if (this.addedPurchaseEntries && (this.addedPurchaseEntries.some(d => d.material.materialID === value.materialName))) {
        this.notificationService.updateSnackBarMessageSubject('Material Entry already exists');
        return;
      }
      if (this.addedPurchaseEntries) {
        this.addedPurchaseEntries.push(tmp);
      } else {
        this.addedPurchaseEntries = [tmp];
      }

      this.addPurchaseEntryFlag = false;
      this.formPurchaseEntry.reset();
      this.dataSourceMaterialList.data = this.addedPurchaseEntries;
    }

    this.onOverallDiscountPercentageChange();
    this.setAmounts();
  }

  onDeletePurchaseEntry(materialID): void {
    this.addedPurchaseEntries = this.addedPurchaseEntries.filter(d => d.material.materialID !== materialID);
    this.dataSourceMaterialList.data = this.addedPurchaseEntries;

    this.onOverallDiscountPercentageChange();
    this.setAmounts();
  }

  onPurchaseEntryCancel(): void {
    this.addPurchaseEntryFlag = false;
    this.formPurchaseEntry.reset();
  }

  onCreatePurchase(): void {

    const { value, valid } = this.form;
    if (valid && this.addedPurchaseEntries && this.addedPurchaseEntries.length > 0) {
      const purchaseData: IPurchaseData = {
        supplier: this.suppliers.filter(d => d.clientID === value.supplier)[0],
        purchaseDate: this.date.value.toDate(),
        gstPercentage: value.gstPercentage,
        overallDiscountPercentage: value.overallDiscountPercentage,
        transportCharges: value.transportCharges,
        miscCharges: value.miscCharges,
        paymentTerms: value.paymentTerms,
        remarks: value.remarks,
        purchaseEntries: this.addedPurchaseEntries
      };

      this.purchaseDBservice.insertPurchase(purchaseData)
        .then(_ => {
          this.notificationService.updateSnackBarMessageSubject('Purchase created successfully');
          this.router.navigate(['purchase']);
        })
        .catch(err => {
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to create purchase');
        });
    }
  }

  onUpdatePurchase(): void {
    const { value, valid } = this.form;
    if (valid && this.addedPurchaseEntries && this.addedPurchaseEntries.length > 0) {
      const purchaseData: IPurchaseData = {
        purchaseID: this.selectedPurchaseData.purchaseID,
        purchaseTransactions: this.selectedPurchaseData.purchaseTransactions,
        supplier: this.suppliers.filter(d => d.clientID === value.supplier)[0],
        purchaseDate: this.date.value.toDate(),
        gstPercentage: value.gstPercentage,
        overallDiscountPercentage: value.overallDiscountPercentage,
        transportCharges: value.transportCharges,
        miscCharges: value.miscCharges,
        paymentTerms: value.paymentTerms,
        remarks: value.remarks,
        purchaseEntries: this.addedPurchaseEntries
      };

      if (this.getPurchaseEntriesToBeDeleted().length > 0) {
        this.purchaseDBservice.deletePurchaseEntry(this.getPurchaseEntriesToBeDeleted())
        .then(_=>{
            this.updatePurchase(purchaseData);
        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to update purchase');
        });
      } else {
        this.updatePurchase(purchaseData);
      }
    }
  }

  updatePurchase(purchaseData: IPurchaseData): void {
    this.purchaseDBservice.updatePurchase(purchaseData)
          .then(__=>{
            this.notificationService.updateSnackBarMessageSubject('Purchase Updated successfully');
            this.router.navigate(['purchase/transaction', this.selectedPurchaseData.purchaseID]);
          })
          .catch(err=>{
            console.log(err);
            this.notificationService.updateSnackBarMessageSubject('Unable to update purchase');
          });
  }



  onBack(): void {
    if (this.componentBehaviourFlag) {
      this.router.navigate(['purchase']);
    } else {
      this.router.navigate(['purchase/transaction', this.selectedPurchaseData.purchaseID]);
    }
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.componentBehaviourFlag = params.createOrUpdate === EnumRouteActions.create ? true : false;

      this.materialDBservice.getMaterials();
      this.clientDBservice.getClients();
      this.materialService.getMaterialList().pipe(takeUntil(this.destroy$)).subscribe(data => {

      // Assign list of materials for drop down
      this.materials = data;

      this.clientService.getClientList().pipe(takeUntil(this.destroy$)).subscribe(e => {
        this.suppliers = e.filter(d => d.clientType === EnumClientType.supplier);
      });

      if (params.createOrUpdate === EnumRouteActions.update) {
        this.activateRoute.data.subscribe(e=>{
          this.selectedPurchaseData = e.purchaseData;
          this.setPurchaseData();
        });
      }
    });
  });
}

ngOnDestroy(): void {
  this.destroy$.next(true);
}

}
