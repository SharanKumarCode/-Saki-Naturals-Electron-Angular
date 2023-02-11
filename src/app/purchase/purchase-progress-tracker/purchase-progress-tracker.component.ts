import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { IPurchaseData } from '../../core/interfaces/interfaces';
import * as _moment from 'moment';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { PurchasedbService } from '../../core/services/purchase/purchasedb.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '../../core/services/notification/notification.service';

const moment = _moment;

@Component({
  selector: 'app-purchase-progress-tracker',
  templateUrl: './purchase-progress-tracker.component.html',
  styleUrls: ['./purchase-progress-tracker.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class PurchaseProgressTrackerComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() purchaseData: IPurchaseData;
  @Output() refreshParent = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper;

  purchaseInitiateFormGroup: FormGroup;
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

  purchaseDate: Date;

  private path = 'assets/icon/';

  constructor(
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private purchaseDBservice: PurchasedbService,
    private notificationService: NotificationService,
    ) {

    this.purchaseInitiateFormGroup = this.fb.group(
      {
        purchaseInitiatedDate: [{ value: '', disabled: true }]
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

  setPurchaseDates(){
    this.purchaseInitiateFormGroup.controls.purchaseInitiatedDate.setValue(this.purchaseDate);

    this.minDispatchDate = this.purchaseDate;
    this.minDeliveredDate = this.purchaseDate;
    this.minCompletedDate = this.purchaseDate;

    if (this.purchaseData.dispatchDate) {
      this.dispatchFormGroup.controls.dispatchedDate.setValue(moment(this.purchaseData.dispatchDate));
      this.minDeliveredDate = this.purchaseData.dispatchDate;
      this.minCompletedDate = this.purchaseData.dispatchDate;

    }

    if (this.purchaseData.deliveredDate) {
      this.deliveredFormGroup.controls.deliveredDate.setValue(moment(this.purchaseData.deliveredDate));
      this.minCompletedDate = this.purchaseData.deliveredDate;
    }

    if (this.purchaseData.returnedDate) {
      this.returnedFormGroup.controls.returnedDate.setValue(moment(this.purchaseData.returnedDate));
      this.minRefundedDate = this.purchaseData.returnedDate;
      this.minCompletedDate = this.purchaseData.returnedDate;

    }

    if (this.purchaseData.refundedDate) {
      this.refundedFormGroup.controls.refundedDate.setValue(moment(this.purchaseData.refundedDate));
      this.minCompletedDate = this.purchaseData.refundedDate;
    }

    if (this.purchaseData.completedDate) {
      this.completedFormGroup.controls.completedDate.setValue(moment(this.purchaseData.completedDate));
    }

    if (this.purchaseData.cancelledDate) {
      this.cancelledFormGroup.controls.cancelledDate.setValue(moment(this.purchaseData.cancelledDate));
    }

   }

   resetDates(stepper: MatStepper): void {

    if (this.purchaseData.cancelledDate) {
      this.notificationService.updateSnackBarMessageSubject('Unable to reset dates as Purchase is marked as CANCELLED');
      return;
    }

    const tmp: IPurchaseData = {
      ...this.purchaseData,
      dispatchDate: null,
      deliveredDate: null,
      refundedDate: null,
      completedDate: null
    };

    this.purchaseDBservice.updatePurchase(tmp)
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('All Dates resetted');
        this.setPurchaseDates();
        stepper.reset();
        this.refreshParent.next('');
      })
      .catch(err=>{
        console.log(err);
        this.notificationService.updateSnackBarMessageSubject('Unable to reset dates');
      });
   }

   onDispatchDateChange(): void {
    const currDispatchDateTime = moment(this.purchaseData.dispatchDate).toDate().getTime();
    const inputDispatchDateTime = this.dispatchFormGroup.valid ?
                                  this.dispatchFormGroup.controls.dispatchedDate.value.toDate().getTime() : undefined;

    if (this.dispatchFormGroup.valid && currDispatchDateTime !== inputDispatchDateTime){
      const tmp: IPurchaseData = {
        ...this.purchaseData,
        dispatchDate: this.dispatchFormGroup.controls.dispatchedDate.value.toDate()
      };
      this.purchaseDBservice.updatePurchase(tmp)
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
    const currDeliveredDateTime = moment(this.purchaseData.deliveredDate).toDate().getTime();
    const inputDeliveredDateTime = this.deliveredFormGroup.valid ?
                                  this.deliveredFormGroup.controls.deliveredDate.value.toDate().getTime() : undefined;

    if (this.deliveredFormGroup.valid && currDeliveredDateTime !== inputDeliveredDateTime){
      const tmp: IPurchaseData = {
        ...this.purchaseData,
        deliveredDate: this.deliveredFormGroup.controls.deliveredDate.value.toDate()
      };
      this.purchaseDBservice.updatePurchase(tmp)
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
    const currRefundedDateTime = moment(this.purchaseData.refundedDate).toDate().getTime();
    const inputRefundedDateTime = this.refundedFormGroup.valid ?
                                  this.refundedFormGroup.controls.refundedDate.value.toDate().getTime() : undefined;

    if (this.refundedFormGroup.valid && currRefundedDateTime !== inputRefundedDateTime){
      const tmp: IPurchaseData = {
        ...this.purchaseData,
        refundedDate: this.refundedFormGroup.controls.refundedDate.value.toDate()
      };
      this.purchaseDBservice.updatePurchase(tmp)
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

   onPurchaseComplete(): void {
    const currCompletedDateTime = moment(this.purchaseData.completedDate).toDate().getTime();
    const inputCompletedDateTime = this.completedFormGroup.valid ?
                                  this.completedFormGroup.controls.completedDate.value?.toDate().getTime() : undefined;

    if (this.completedFormGroup.valid && currCompletedDateTime !== inputCompletedDateTime){
      const tmp: IPurchaseData = {
        ...this.purchaseData,
        completedDate: this.completedFormGroup.controls.completedDate.value.toDate()
      };
      this.purchaseDBservice.updatePurchase(tmp)
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

   onPurchaseInComplete(): void {
    const tmp: IPurchaseData = {
      ...this.purchaseData,
      completedDate: null
    };
    this.purchaseDBservice.updatePurchase(tmp)
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
    this.purchaseDate = this.purchaseData.purchaseDate;
    this.setPurchaseDates();
    this.returnFlag = this.purchaseData.returnedDate ? true : false;

    if (this.purchaseData.cancelledDate) {
      this.dispatchFormGroup.controls.dispatchedDate.disable();
      this.deliveredFormGroup.controls.deliveredDate.disable();
      this.refundedFormGroup.controls.refundedDate.disable();
    }

  }

  ngOnChanges(): void {
    this.purchaseDate = this.purchaseData.purchaseDate;
    this.setPurchaseDates();
    this.returnFlag = this.purchaseData.returnedDate ? true : false;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.purchaseData.dispatchDate){
        this.stepper.selectedIndex = 1;
      }
      if (this.purchaseData.deliveredDate){
        this.stepper.selectedIndex = 2;
      }
      if (this.purchaseData.returnedDate || this.purchaseData.completedDate || this.purchaseData.cancelledDate){
        this.stepper.selectedIndex = 3;
      }
      if (this.purchaseData.refundedDate){
        this.stepper.selectedIndex = 4;
      }
      if (this.purchaseData.completedDate || this.purchaseData.cancelledDate){
        this.stepper.selectedIndex = 5;
      }
    }, 0);

  }

}
