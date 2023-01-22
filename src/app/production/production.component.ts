import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EnumProductionStatus, EnumRouteActions, IProductionData } from '../core/interfaces/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ProductionService } from '../core/services/production/production.service';
import { ProductiondbService } from '../core/services/production/productiondb.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss']
})
export class ProductionComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
                                'serial_number',
                                'productionDate',
                                'product_name',
                                'group',
                                'productionQuantity',
                                'productionStatus',
                                'remarks'
                              ];
  dataSource = new MatTableDataSource([]);

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    private productiondbservice: ProductiondbService,
    private productionService: ProductionService,
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
    ) {

      this.matIconRegistry
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'))
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'));

    }

  getProductionList(){
    this.productiondbservice.getProductionList();
  }

  getProductionStatus(){
    return EnumProductionStatus.initiated;
  }

  setTableData(data: IProductionData[]){
    this.dataSource = new MatTableDataSource();
      const tmpProductionList = [];
      data.forEach((element, index)=>{

        const productionStatus = this.productionService.getProductionStatus(element);
        const productionStatusCompleteFlag = element.completedDate ? true : false;
        const productionStatusCancelledFlag = element.cancelledDate ? true : false;

        const tmpProductionData = {
          productionID: element.productionID,
          serialNumber: index + 1,
          product: element.product,
          remarks: element.remarks,
          productionDate: element.productionDate,
          productionQuantity: element.productQuantity,
          productionStatus,
          productionStatusCompleteFlag,
          productionStatusCancelledFlag
        };
        tmpProductionList.push(tmpProductionData);
      });
      this.dataSource.data = tmpProductionList;
  }

  onAddProduction(): void {
    this.router.navigate(['production/add_update_production', EnumRouteActions.create]);
  }

  onRowClick(e: any){
    this.router.navigate(['production/detail', e.productionID]);
  }

  onRefresh(){
    this.getProductionList();
  }

  ngOnInit(): void {
    this.getProductionList();
    this.productionService.getProductionList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
    this.setTableData(data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
