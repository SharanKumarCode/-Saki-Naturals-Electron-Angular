import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { IProductionData } from '../../core/interfaces/interfaces';
import * as _moment from 'moment';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '../../core/services/notification/notification.service';
import { ProductiondbService } from '../../core/services/production/productiondb.service';

const moment = _moment;

@Component({
  selector: 'app-production-progress-tracker',
  templateUrl: './production-progress-tracker.component.html',
  styleUrls: ['./production-progress-tracker.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class ProductionProgressTrackerComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() productionData: IProductionData;

  @Output() refreshParent = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper;

  productionInitiateFormGroup: FormGroup;
  completedFormGroup: FormGroup;
  cancelledFormGroup: FormGroup;

  minCompletedDate: Date;

  cancelledFlag: boolean;
  productionDate: Date;

  private path = 'assets/icon/';

  constructor(
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private productionDBservice: ProductiondbService,
    private notificationService: NotificationService,
    ) {

    this.productionInitiateFormGroup = this.fb.group(
      {
        productionInitiatedDate: [{ value: '', disabled: true }]
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

    this.matIconRegistry
      .addSvgIcon('tick', this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'tick_white_icon.svg'));
  }

  setProductionDates(){
    this.productionInitiateFormGroup.controls.productionInitiatedDate.setValue(this.productionDate);

    this.minCompletedDate = this.productionDate;

    if (this.productionData.completedDate) {
      this.completedFormGroup.controls.completedDate.setValue(moment(this.productionData.completedDate));
    }

    if (this.productionData.cancelledDate) {
      this.cancelledFormGroup.controls.cancelledDate.setValue(moment(this.productionData.cancelledDate));
    }

   }

   resetDates(stepper: MatStepper): void {

    if (this.productionData.cancelledDate) {
      this.notificationService.updateSnackBarMessageSubject('Unable to reset dates as Production is marked as CANCELLED');
      return;
    }

    const tmp: IProductionData = {
      ...this.productionData,
      completedDate: null
    };

    this.productionDBservice.updateProduction(tmp)
      .then(_=>{
        this.notificationService.updateSnackBarMessageSubject('All Dates resetted');
        this.setProductionDates();
        stepper.reset();
        this.refreshParent.next('');
      })
      .catch(err=>{
        console.log(err);
        this.notificationService.updateSnackBarMessageSubject('Unable to reset dates');
      });
   }

   onProductionComplete(): void {
    const currCompletedDateTime = moment(this.productionData.completedDate).toDate().getTime();
    const inputCompletedDateTime = this.completedFormGroup.valid ?
                                  this.completedFormGroup.controls.completedDate.value?.toDate().getTime() : undefined;

    if (this.completedFormGroup.valid && currCompletedDateTime !== inputCompletedDateTime){
      const tmp: IProductionData = {
        ...this.productionData,
        completedDate: this.completedFormGroup.controls.completedDate.value.toDate()
      };
      this.productionDBservice.updateProduction(tmp)
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

   onProductionInComplete(): void {
    const tmp: IProductionData = {
      ...this.productionData,
      completedDate: null
    };
    this.productionDBservice.updateProduction(tmp)
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
    this.productionDate = this.productionData.productionDate;
    this.setProductionDates();
  }

  ngOnChanges(): void {
    this.productionDate = this.productionData.productionDate;
    this.setProductionDates();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.productionData.completedDate || this.productionData.cancelledDate){
        this.stepper.selectedIndex = 1;
      }
    }, 0);

  }

}
