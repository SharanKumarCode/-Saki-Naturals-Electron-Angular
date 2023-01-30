import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IProductionData } from '../../core/interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { ProductionService } from '../../core/services/production/production.service';
import { ProductiondbService } from '../../core/services/production/productiondb.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptDialogComponent } from '../../dialogs/prompt-dialog/prompt-dialog.component';
import { EnumProductionStatus, EnumRouteActions } from '../../core/interfaces/enums';

@Component({
  selector: 'app-production-detail',
  templateUrl: './production-detail.component.html',
  styleUrls: ['./production-detail.component.scss']
})
export class ProductionDetailComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  materialPanelOpenState = false;
  returnPanelOpenState = false;

  selectedProductionID: string;
  selectedProductionData: IProductionData;
  productionDetail: any;
  productionStatus: EnumProductionStatus;

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private productionService: ProductionService,
    private productionDBService: ProductiondbService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService
  ) {

    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));

  }

  setProductionStatus(){
    this.productionStatus = this.selectedProductionData ?
                          this.productionService.getProductionStatus(this.selectedProductionData) : EnumProductionStatus.initiated;
  }

  getProductionReturnEntriesToBeDeleted(currentProductionReturn, prevProductionReturn) {
    const productionEntriesToBeDeleted = [];
    const currentProductionEntryIDs = currentProductionReturn.map(d => d.productionEntryID);
    const prevProductionEntryIDs = prevProductionReturn.map(d => d.productionEntryID);
    prevProductionEntryIDs.forEach(data => {
      if (!currentProductionEntryIDs.includes(data)) {
        productionEntriesToBeDeleted.push(data);
      }
    });
    return productionEntriesToBeDeleted;
  }

  setProductionDetails(): void {

    this.productionDetail = {
      productionID: this.selectedProductionData?.productionID,
      productionDate: this.selectedProductionData?.productionDate,
      productID: this.selectedProductionData?.product.productID,
      productName: this.selectedProductionData?.product.productName,
      productGroupName: this.selectedProductionData?.product.productGroup.productGroupName,
      productQuantity: this.selectedProductionData?.productQuantity,
      remarks: this.selectedProductionData?.remarks,
      materialsUsed: this.selectedProductionData?.productionEntries.length,
      materialList: this.selectedProductionData?.productionEntries.map(d=>({
        materialName: d.material.materialName,
        materialQuantity: d.materialQuantity,
        }))
    };
  }

  openEditProductionDialog(): void {
    this.router.navigate(['production/add_update_production',
                        EnumRouteActions.update,
                         this.selectedProductionData.productionID]);
  }

  onUpdateProduction(){
    if (this.selectedProductionData.completedDate || this.selectedProductionData.cancelledDate) {
      const message = `Unable to make changes as Production is marked as ${this.selectedProductionData.completedDate
                      ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    this.openEditProductionDialog();
  }

  onDeleteProduction(){
    if (this.selectedProductionData.completedDate || this.selectedProductionData.cancelledDate) {
      const message = `Unable to make changes as Production is marked as ${this.selectedProductionData.completedDate
                      ? 'COMPLETED' : 'CANCELLED'}`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    this.productionDBService.deleteProduction(this.selectedProductionID)
    .then(_=>{
      console.log('INFO: Deleted production');
      this.onBack();
    })
    .catch(err=>{
      console.log(err);
    });

  }

  onCancelProduction(){
    if (this.selectedProductionData.completedDate) {
      const message = `Unable to make changes as Production is marked as COMPLETED`;
      this.notificationService.updateSnackBarMessageSubject(message);
      return;
    }

    const dialogRef = this.dialog.open(PromptDialogComponent, {
      width: '30%',
      height: 'auto',
      data: {
        message: `Are you sure to ${this.selectedProductionData.cancelledDate ? 'UNCANCEL' : 'CANCEL'} production ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tmp = {...this.selectedProductionData};
        tmp.cancelledDate = this.selectedProductionData.cancelledDate ? null : new Date();
        this.updatePurchase(tmp);
      }

    });

  }

  updatePurchase(data): void {
    this.productionDBService.updateProduction(data)
        .then(_=>{
          this.notificationService.updateSnackBarMessageSubject('Operation successfully');
          this.onRefresh();
        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to Cancel Production');
        });
  }

  onRefresh(){
    this.productionDBService.getProductionByID(this.selectedProductionID);
    this.setProductionStatus();
  }

  onBack(){
    this.location.back();
  }

  ngOnInit(): void {
    this.setProductionStatus();
    this.selectedProductionID = this.productionService.getSelectedProductionID();
    this.activatedRoute.data.subscribe(data=>{
      this.selectedProductionData = data.productionData;
      this.setProductionDetails();
      this.setProductionStatus();
      this.productionService.getSelectedProductionData().pipe(takeUntil(this.destroy$)).subscribe(d=>{
        this.selectedProductionData = d;
        this.setProductionDetails();
        this.setProductionStatus();
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
