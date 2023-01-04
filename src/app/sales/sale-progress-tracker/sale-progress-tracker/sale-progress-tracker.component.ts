import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit, AfterContentChecked, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import * as _moment from 'moment';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ISalesData } from '../../../core/interfaces/interfaces';
import { SalesdbService } from '../../../core/services/sales/salesdb.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { MatStepper } from '@angular/material/stepper';

const moment = _moment;


@Component({
  selector: 'app-sale-progress-tracker',
  templateUrl: './sale-progress-tracker.component.html',
  styleUrls: ['./sale-progress-tracker.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class SaleProgressTrackerComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() saleData: ISalesData;
  @Output() refreshParent = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper;

  saleInitiateFormGroup: FormGroup;
  dispatchFormGroup: FormGroup;
  deliveredFormGroup: FormGroup;
  returnedFormGroup: FormGroup;
  refundedFormGroup: FormGroup;
  completedFormGroup: FormGroup;
  cancelledFormGroup: FormGroup;

  minDispatchDate: Date;
  minDeliveredDate: Date;
  minReturnedDate: Date;
  minRefundedDate: Date;
  minCompletedDate: Date;

  returnFlag: boolean;
  cancelledFlag: boolean;

  saleDate: Date;

  private path = 'assets/icon/';

  constructor(
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private salesdbService: SalesdbService,
    private notificationService: NotificationService,
    ) {

    this.saleInitiateFormGroup = this.fb.group(
      {
        saleInitiatedDate: [{ value: '', disabled: true }]
      }
    );

    this.dispatchFormGroup = this.fb.group(
      {
        dispatchedDate: ['', [Validators.required]]
      }
    );

    this.deliveredFormGroup = this.fb.group(
      {
        deliveredDate: ['', [Validators.required]]
      }
    );

    this.returnedFormGroup = this.fb.group(
      {
        returnedDate: [{ value: '', disabled: true }]
      }
    );

    this.refundedFormGroup = this.fb.group(
      {
        refundedDate: ['', [Validators.required]]
      }
    );

    this.completedFormGroup = this.fb.group(
      {
        completedDate: ['', [Validators.required]]
      }
    );

    this.cancelledFormGroup = this.fb.group(
      {
        cancelledDate: [{ value: '', disabled: true }]
      }
    );

    this.cancelledFlag = false;
    this.returnFlag = false;

    this.matIconRegistry
      .addSvgIcon('tick', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'tick_white_icon.svg'));
  }

   setSaleDates(){
    this.saleInitiateFormGroup.controls.saleInitiatedDate.setValue(this.saleDate);

    this.minDispatchDate = this.saleDate;
    this.minDeliveredDate = this.saleDate;
    this.minCompletedDate = this.saleDate;

    if (this.saleData.dispatchDate) {
      this.dispatchFormGroup.controls.dispatchedDate.setValue(moment(this.saleData.dispatchDate));
      this.minDeliveredDate = this.saleData.dispatchDate;
      this.minCompletedDate = this.saleData.dispatchDate;

    }

    if (this.saleData.deliveredDate) {
      this.deliveredFormGroup.controls.deliveredDate.setValue(moment(this.saleData.deliveredDate));
      this.minCompletedDate = this.saleData.deliveredDate;
    }

    if (this.saleData.returnedDate) {
      this.returnedFormGroup.controls.returnedDate.setValue(moment(this.saleData.returnedDate));
      this.minRefundedDate = this.saleData.returnedDate;
      this.minCompletedDate = this.saleData.returnedDate;

    }

    if (this.saleData.refundedDate) {
      this.refundedFormGroup.controls.refundedDate.setValue(moment(this.saleData.refundedDate));
      this.minCompletedDate = this.saleData.refundedDate;
    }

    if (this.saleData.completedDate) {
      this.completedFormGroup.controls.completedDate.setValue(moment(this.saleData.completedDate));
    }

    if (this.saleData.cancelledDate) {
      this.cancelledFormGroup.controls.cancelledDate.setValue(moment(this.saleData.cancelledDate));
    }

   }

   resetDates(stepper: MatStepper): void {

    if (this.saleData.cancelledDate) {
      this.notificationService.updateSnackBarMessageSubject('Unable to reset dates as Sale is marked as CANCELLED');
      return;
    }

    const tmp: ISalesData = {
      ...this.saleData,
      dispatchDate: null,
      deliveredDate: null,
      refundedDate: null,
      completedDate: null
    };

    this.salesdbService.updateSales(tmp)
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('All Dates resetted');
        this.setSaleDates();
        stepper.reset();
        this.refreshParent.next('');
      })
      .catch(err=>{
        console.log(err);
        this.notificationService.updateSnackBarMessageSubject('Unable to reset dates');
      });
   }

   onDispatchDateChange(): void {
    const currDispatchDateTime = moment(this.saleData.dispatchDate).toDate().getTime();
    const inputDispatchDateTime = this.dispatchFormGroup.valid ?
                                  this.dispatchFormGroup.controls.dispatchedDate.value.toDate().getTime() : undefined;

    if (this.dispatchFormGroup.valid && currDispatchDateTime !== inputDispatchDateTime){
      const tmp: ISalesData = {
        ...this.saleData,
        dispatchDate: this.dispatchFormGroup.controls.dispatchedDate.value.toDate()
      };
      this.salesdbService.updateSales(tmp)
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('Dispatch Date updated successfully');
        this.minDeliveredDate = this.dispatchFormGroup.controls.dispatchedDate.value;
        this.refreshParent.next('');
      })
      .catch(err=>{
        console.log(err);
        this.notificationService.updateSnackBarMessageSubject('Unable to update Dispatch Date');
      });
    }
   }

   onDeliveredDateChange(): void {
    const currDeliveredDateTime = moment(this.saleData.deliveredDate).toDate().getTime();
    const inputDeliveredDateTime = this.deliveredFormGroup.valid ?
                                  this.deliveredFormGroup.controls.deliveredDate.value.toDate().getTime() : undefined;

    if (this.deliveredFormGroup.valid && currDeliveredDateTime !== inputDeliveredDateTime){
      const tmp: ISalesData = {
        ...this.saleData,
        deliveredDate: this.deliveredFormGroup.controls.deliveredDate.value.toDate()
      };
      this.salesdbService.updateSales(tmp)
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('Delivered Date updated successfully');
        this.minCompletedDate = this.deliveredFormGroup.controls.deliveredDate.value;
        this.refreshParent.next('');
      })
      .catch(err=>{
        console.log(err);
        this.notificationService.updateSnackBarMessageSubject('Unable to update Delivered Date');
      });
    }
   }

   onRefundedDateChange(): void {
    const currRefundedDateTime = moment(this.saleData.refundedDate).toDate().getTime();
    const inputRefundedDateTime = this.refundedFormGroup.valid ?
                                  this.refundedFormGroup.controls.refundedDate.value.toDate().getTime() : undefined;

    if (this.refundedFormGroup.valid && currRefundedDateTime !== inputRefundedDateTime){
      const tmp: ISalesData = {
        ...this.saleData,
        refundedDate: this.refundedFormGroup.controls.refundedDate.value.toDate()
      };
      this.salesdbService.updateSales(tmp)
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('Refunded Date updated successfully');
        this.minCompletedDate = this.refundedFormGroup.controls.refundedDate.value;
        this.refreshParent.next('');
      })
      .catch(err=>{
        console.log(err);
        this.notificationService.updateSnackBarMessageSubject('Unable to update Refunded Date');
      });
    }
   }

   onSaleComplete(): void {
    const currCompletedDateTime = moment(this.saleData.completedDate).toDate().getTime();
    const inputCompletedDateTime = this.completedFormGroup.valid ?
                                  this.completedFormGroup.controls.completedDate.value?.toDate().getTime() : undefined;

    if (this.completedFormGroup.valid && currCompletedDateTime !== inputCompletedDateTime){
      const tmp: ISalesData = {
        ...this.saleData,
        completedDate: this.completedFormGroup.controls.completedDate.value.toDate()
      };
      this.salesdbService.updateSales(tmp)
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('Completed Date updated successfully');
        this.refreshParent.next('');

      })
      .catch(err=>{
        console.log(err);
        this.notificationService.updateSnackBarMessageSubject('Unable to update Completed Date');
      });
    }


   }

   onSaleInComplete(): void {
    const tmp: ISalesData = {
      ...this.saleData,
      completedDate: null
    };
    this.salesdbService.updateSales(tmp)
    .then(_=>{
      this.notificationService.updateSnackBarMessageSubject('Resetted Completed Date successfully');
      this.refreshParent.next('');
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to reset Completed Date');
    });
   }

  ngOnInit(): void {
    this.saleDate = this.saleData.salesDate;
    this.setSaleDates();
    this.returnFlag = this.saleData.returnedDate ? true : false;

    if (this.saleData.cancelledDate) {
      this.dispatchFormGroup.controls.dispatchedDate.disable();
      this.deliveredFormGroup.controls.deliveredDate.disable();
      this.refundedFormGroup.controls.refundedDate.disable();
    }

  }

  ngOnChanges(): void {
    this.saleDate = this.saleData.salesDate;
    this.setSaleDates();
    this.returnFlag = this.saleData.returnedDate ? true : false;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.saleData.dispatchDate){
        this.stepper.selectedIndex = 1;
      }
      if (this.saleData.deliveredDate){
        this.stepper.selectedIndex = 2;
      }
      if (this.saleData.returnedDate || this.saleData.completedDate || this.saleData.cancelledDate){
        this.stepper.selectedIndex = 3;
      }
      if (this.saleData.refundedDate){
        this.stepper.selectedIndex = 4;
      }
      if (this.saleData.completedDate || this.saleData.cancelledDate){
        this.stepper.selectedIndex = 5;
      }
    }, 0);

  }

}
