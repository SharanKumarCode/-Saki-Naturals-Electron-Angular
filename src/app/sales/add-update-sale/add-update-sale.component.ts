import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';
import {
  EnumClientType,
  EnumRouteActions,
  EnumSaleType,
  IClientData,
  IProductData,
  ISaleEntry,
  ISalesData
} from '../../core/interfaces/interfaces';
import { ProductsService } from '../../core/services/products.service';
import { ProductsdbService } from '../../core/services/productsdb.service';
import { Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { ClientdbService } from '../../core/services/client/clientdb.service';
import { ClientService } from '../../core/services/client/client.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { SalesdbService } from '../../core/services/sales/salesdb.service';
import { ActivatedRoute, Router } from '@angular/router';

const moment = _moment;

interface IProductGroupSelect {
  value: string;
  viewValue: string;
}

interface ISaleType {
  value: EnumSaleType;
  viewValue: string;
}

@Component({
  selector: 'app-add-update-sale',
  templateUrl: './add-update-sale.component.html',
  styleUrls: ['./add-update-sale.component.scss'],
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})

export class AddUpdateSaleComponent implements OnInit {

  form: FormGroup;
  formSaleEntry: FormGroup;
  selectedSaleData: ISalesData;

  addSaleEntryFlag: boolean;
  productID: string;
  customers: IClientData[];
  products: IProductData[];
  productsFiltered: IProductData[];
  productGroupFiltered: IProductGroupSelect[];
  productName: string;
  currentStock: number;
  saleDate: string;
  saleTime: string;
  purchaser: string;
  supplier: string;
  saleType: EnumSaleType;
  sellingPrice: number;
  selectedSellingPrice: number;
  sellingQuantity: number;
  totalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  productTotalPrice: number;
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
  addedSaleEntries: ISaleEntry[];

  tmplist = [];

  displayedColumnsProductList: string[] = [
    'productGroup',
    'productName',
    'sellingPrice',
    'quantity',
    'discountPercentage',
    'discountAmount',
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

  componentBehaviourFlag: boolean;

  private productListObservable: Subject<IProductData[]>;
  private clientListObservable: Subject<IClientData[]>;
  private path = 'assets/icon/';

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private productsDBservice: ProductsdbService,
    private clientDBservice: ClientdbService,
    private clientService: ClientService,
    private salesDBservice: SalesdbService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private notificationService: NotificationService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {

    this.addSaleEntryFlag = false;

    this.form = this.fb.group(
      {
        customer: ['', [Validators.required]],
        saleTypeList: ['', [Validators.required]],
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

    this.formSaleEntry = this.fb.group(
      {
        productGroup: ['', [Validators.required]],
        productName: ['', [Validators.required]],
        quantity: ['', [Validators.required]],
        sellingPrice: [{ value: 0, disabled: true }],
        discountPercentage: [0],
        discountAmount: [0],
        productTotalPrice: [{ value: 0, disabled: true }]

      }
    );


    this.matIconRegistry
      .addSvgIcon('add', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'add_icon.svg'))
      .addSvgIcon('close', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
      .addSvgIcon('plus', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
      .addSvgIcon('back', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'));
  }

  getSaleEntryTotalAmount(): number {
    return this.addedSaleEntries ?
      this.addedSaleEntries.map(d => d.price * d.quantity - (d.price * d.quantity * d.discountPercentage / 100))
        .reduce((partialSum, a) => partialSum + a, 0) : 0;
  }

  getSaleEntriesToBeDeleted() {
    const saleEntriesToBeDeleted = [];
    const currentSalesEntryIDs = this.addedSaleEntries.map(d => d.saleEntryID);
    const prevSalesEntryIDs = this.selectedSaleData.saleEntries.map(d => d.saleEntryID);
    prevSalesEntryIDs.forEach(data => {
      if (!currentSalesEntryIDs.includes(data)) {
        saleEntriesToBeDeleted.push(data);
      }
    });

    return saleEntriesToBeDeleted;
  }

  setSalesData() {

    this.selectedSaleData.saleEntries.forEach(data => {
      if (!data.returnFlag){
        const tmp: ISaleEntry = {
          saleEntryID: data.saleEntryID,
          quantity: data.quantity,
          price: data.price,
          discountPercentage: data.discountPercentage,
          product: data.product
        };
        tmp.product.productGroupName = data.product.productGroup.productGroupName;
        tmp.product.productGroupID = data.product.productGroup.productGroupID;

        if (this.addedSaleEntries) {
          this.addedSaleEntries.push(tmp);
        } else {
          this.addedSaleEntries = [tmp];
        }
        this.dataSourceProductList.data = this.addedSaleEntries;
      }
    });

    this.form.controls.customer.setValue(this.selectedSaleData.customer.clientID);
    this.form.controls.saleTypeList.setValue(this.selectedSaleData.saleType);
    this.form.controls.remarks.setValue(this.selectedSaleData.remarks);
    this.form.controls.overallDiscountPercentage.setValue(this.selectedSaleData.overallDiscountPercentage);
    this.form.controls.gstPercentage.setValue(this.selectedSaleData.gstPercentage);
    this.form.controls.transportCharges.setValue(this.selectedSaleData.transportCharges);
    this.form.controls.miscCharges.setValue(this.selectedSaleData.miscCharges);
    this.form.controls.paymentTerms.setValue(this.selectedSaleData.paymentTerms);
    this.date.setValue(moment(this.selectedSaleData.salesDate));

    this.onOverallDiscountPercentageChange();
  }

  setSelectedSellingPrice(saleTypeValue_ = undefined, productValue_ = undefined): void {
    const saleTypeValue = saleTypeValue_ ? saleTypeValue_ : this.form.controls.saleTypeList.value;

    if (this.productsFiltered && this.addSaleEntryFlag) {
      const selectedProductvalue = productValue_ ? productValue_ : this.formSaleEntry.controls.productName.value;
      const selectedProduct = this.productsFiltered.filter(data => data.productID === selectedProductvalue)[0];

      switch (saleTypeValue) {
        case EnumSaleType.dealer:
          this.formSaleEntry.controls.sellingPrice.setValue(selectedProduct.priceDealer);
          break;
        case EnumSaleType.directSale:
          this.formSaleEntry.controls.sellingPrice.setValue(selectedProduct.priceDirectSale);
          break;
        case EnumSaleType.reseller:
          this.formSaleEntry.controls.sellingPrice.setValue(selectedProduct.priceReseller);
          break;
        default:
          break;
      }
    }

    if (this.addedSaleEntries && this.addedSaleEntries.length > 0) {
      const tmp: ISaleEntry[] = [];
      this.addedSaleEntries.forEach(d => {
        const tmpData: ISaleEntry = d;

        switch (saleTypeValue) {
          case EnumSaleType.dealer:
            tmpData.price = d.product.priceDealer;
            break;
          case EnumSaleType.directSale:
            tmpData.price = d.product.priceDirectSale;
            break;
          case EnumSaleType.reseller:
            tmpData.price = d.product.priceReseller;
            break;
          default:
            break;
        }
        tmp.push(d);
      });

      this.dataSourceProductList.data = tmp;
      this.onOverallDiscountPercentageChange();
      this.setAmounts();
    }

    this.onDiscountAmountChange();
  }

  setProductTotalPrice(): void {
    this.formSaleEntry.controls.productTotalPrice.setValue(
      ((this.formSaleEntry.controls.sellingPrice.value *
        this.formSaleEntry.controls.quantity.value) - this.formSaleEntry.controls.discountAmount.value).toFixed(2)
    );
  }

  setAmounts(): void {
    const { value } = this.form;
    this.totalAmount = this.getSaleEntryTotalAmount();
    this.totalAmount += value.transportCharges +
      value.miscCharges +
      value.gstAmount -
      value.overallDiscountAmount;
  }

  onSaleTypeChange(saleType): void {
    if (saleType.isUserInput) {
      this.setSelectedSellingPrice(saleType.source.value);
    }
  }

  onProductGroupChange(e): void {
    if (e.isUserInput) {
      this.productsFiltered = this.products.filter(data => data.productGroupID === e.source.value);
    }
  }

  onProductChange(e): void {
    if (e.isUserInput) {
      this.setSelectedSellingPrice(undefined, e.source.value);
    }
  }

  onDiscountPercentageChange(): void {
    const { value } = this.formSaleEntry;
    if (value.discountPercentage !== null){
      this.formSaleEntry.controls.discountAmount.setValue((this.formSaleEntry.controls.sellingPrice.value * value.quantity *
        (value.discountPercentage / 100)).toFixed(2));
      this.setProductTotalPrice();
    }
  }

  onDiscountAmountChange(): void {
    const { value } = this.formSaleEntry;
    this.formSaleEntry.controls.discountPercentage.setValue(((value.discountAmount * 100)
                                      / (this.formSaleEntry.controls.sellingPrice.value * value.quantity)).toFixed(2));
    this.setProductTotalPrice();
  }

  onOverallDiscountPercentageChange(): void {
    const { value } = this.form;

    const totAmt = this.getSaleEntryTotalAmount();
    const discAmount = parseFloat((value.overallDiscountPercentage * totAmt / 100).toFixed(2));
    this.form.controls.overallDiscountAmount.setValue(discAmount);

    this.onGSTpercentageChange();
    this.setAmounts();
  }

  onOverallDiscountAmountChange(): void {
    const { value } = this.form;

    const totAmt = this.getSaleEntryTotalAmount();
    const discPercent = parseFloat((value.overallDiscountAmount * 100 / totAmt).toFixed(2));
    this.form.controls.overallDiscountPercentage.setValue(discPercent);

    this.onGSTpercentageChange();
    this.setAmounts();
  }

  onGSTpercentageChange(): void {
    const { value } = this.form;

    const totAmt = this.getSaleEntryTotalAmount();
    const gstAmount = parseFloat(((totAmt - value.overallDiscountAmount) * value.gstPercentage / 100).toFixed(2));
    this.form.controls.gstAmount.setValue(gstAmount);

    this.setAmounts();

  }

  onGSTamountChange(): void {
    const { value } = this.form;

    const totAmt = this.getSaleEntryTotalAmount();
    const gstPercent = parseFloat(((value.gstAmount / (totAmt - value.overallDiscountAmount)) * 100).toFixed(2));
    this.form.controls.gstPercentage.setValue(gstPercent);
    this.setAmounts();

  }

  onAddProduct(): void {
    this.addSaleEntryFlag = !this.addSaleEntryFlag;
    this.formSaleEntry.reset();
  }

  onAddSaleEntry(): void {
    const { value, valid } = this.formSaleEntry;
    if (valid && this.form.controls.saleTypeList.valid) {
      const tmp: ISaleEntry = {
        quantity: value.quantity,
        price: this.formSaleEntry.controls.sellingPrice.value,
        discountPercentage: this.formSaleEntry.controls.discountPercentage.value,
        product: this.productsFiltered.filter(d => d.productID === value.productName)[0]
      };
      if (this.addedSaleEntries && (this.addedSaleEntries.some(d => d.product.productID === value.productName))) {
        this.notificationService.updateSnackBarMessageSubject('Product Entry already exists');
        return;
      }
      if (this.addedSaleEntries) {
        this.addedSaleEntries.push(tmp);
      } else {
        this.addedSaleEntries = [tmp];
      }

      this.addSaleEntryFlag = false;
      this.formSaleEntry.reset();
      this.dataSourceProductList.data = this.addedSaleEntries;
    }

    this.onOverallDiscountPercentageChange();
    this.setAmounts();
  }

  onDeleteSaleEntry(productID): void {
    this.addedSaleEntries = this.addedSaleEntries.filter(d => d.product.productID !== productID);
    this.dataSourceProductList.data = this.addedSaleEntries;

    this.onOverallDiscountPercentageChange();
    this.setAmounts();
  }

  onSaleEntryCancel(): void {
    this.addSaleEntryFlag = false;
    this.formSaleEntry.reset();
  }

  onCreateSale(): void {

    const { value, valid } = this.form;
    if (valid && this.addedSaleEntries && this.addedSaleEntries.length > 0) {
      const saleData: ISalesData = {
        customer: this.customers.filter(d => d.clientID === value.customer)[0],
        saleType: value.saleTypeList,
        salesDate: this.date.value.toDate(),
        gstPercentage: value.gstPercentage,
        overallDiscountPercentage: value.overallDiscountPercentage,
        transportCharges: value.transportCharges,
        miscCharges: value.miscCharges,
        paymentTerms: value.paymentTerms,
        remarks: value.remarks,
        saleEntries: this.addedSaleEntries
      };

      this.salesDBservice.insertSales(saleData)
        .then(_ => {
          this.notificationService.updateSnackBarMessageSubject('Sale created successfully');
          this.router.navigate(['sales']);
        })
        .catch(err => {
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to create sale');
        });
    }
  }

  onUpdateSale(): void {
    const { value, valid } = this.form;
    if (valid && this.addedSaleEntries && this.addedSaleEntries.length > 0) {
      const saleData: ISalesData = {
        salesID: this.selectedSaleData.salesID,
        saleTransactions: this.selectedSaleData.saleTransactions,
        customer: this.customers.filter(d => d.clientID === value.customer)[0],
        saleType: value.saleTypeList,
        salesDate: this.date.value.toDate(),
        gstPercentage: value.gstPercentage,
        overallDiscountPercentage: value.overallDiscountPercentage,
        transportCharges: value.transportCharges,
        miscCharges: value.miscCharges,
        paymentTerms: value.paymentTerms,
        remarks: value.remarks,
        saleEntries: this.addedSaleEntries
      };

      if (this.getSaleEntriesToBeDeleted().length > 0) {
        this.salesDBservice.deleteSalesEntry(this.getSaleEntriesToBeDeleted())
        .then(_=>{
            this.updateSale(saleData);
        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to update sale');
        });
      } else {
        this.updateSale(saleData);
      }
    }
  }

  updateSale(saleData: ISalesData): void {
    console.log(saleData);
    this.salesDBservice.updateSales(saleData)
          .then(__=>{
            this.notificationService.updateSnackBarMessageSubject('Sale Updated successfully');
            this.router.navigate(['sale/transaction', this.selectedSaleData.salesID]);
          })
          .catch(err=>{
            console.log(err);
            this.notificationService.updateSnackBarMessageSubject('Unable to update sale');
          });
  }



  onBack(): void {
    if (this.componentBehaviourFlag) {
      this.router.navigate(['sales']);
    } else {
      this.router.navigate(['sale/transaction', this.selectedSaleData.salesID]);
    }
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.componentBehaviourFlag = params.createOrUpdate === EnumRouteActions.create ? true : false;

      this.productsDBservice.getProducts();
      this.clientDBservice.getClients();
      this.productListObservable = this.productService.getProductList();
      this.clientListObservable = this.clientService.getClientList();
      this.productListObservable.subscribe(data => {

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
      });

      this.clientListObservable.subscribe(data => {
        this.customers = data.filter(d => d.clientType === EnumClientType.customer);
      });

      if (params.createOrUpdate === EnumRouteActions.update) {
        this.activateRoute.data.subscribe(data=>{
          this.selectedSaleData = data.saleData;
          this.setSalesData();
        });
      }
    });
  }

}
