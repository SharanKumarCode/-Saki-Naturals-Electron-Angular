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
import { Moment } from 'moment';
import { ExportService } from '../core/services/export.service';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss']
})
export class ProductionComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;

  selectedProductGroupValue: string;
  selectedProductNameValue: string;
  selectedProductionStatusValue: string;
  selectedStartDate: Moment;
  selectedEndDate: Moment;

  productGroupList: string[];
  productNameList: string[];
  productionStatusList: string[];

  productionList = [];

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
    private exportService: ExportService,
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
        this.productionList.push(tmpProductionData);
      });

    this.productGroupList = ['Show all', ...new Set(this.productionList.map(d=>d.product.productGroup.productGroupName))];
    this.productNameList = ['Show all', ...new Set(this.productionList.map(d=>d.product.productName))];
    this.productionStatusList = ['Show all', ...new Set(this.productionList.map(d=>d.productionStatus))];

    this.dataSource.data = this.productionList;
  }

  onFilterChange(): void {
    this.dataSource = new MatTableDataSource(this.getFilteredList());
  }

  onClearFilters(): void {
    this.selectedProductGroupValue = '';
    this.selectedProductNameValue = '';
    this.selectedProductionStatusValue = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dataSource = new MatTableDataSource(this.productionList);
  }

  getFilteredList(): any[] {
    return this.productionList
                .filter(data=> this.selectedProductGroupValue &&
                  this.selectedProductGroupValue !== 'Show all'  ?
                  data.product.productGroup.productGroupName === this.selectedProductGroupValue : true)
                .filter(data=> this.selectedProductNameValue &&
                  this.selectedProductNameValue !== 'Show all'  ? data.product.productName === this.selectedProductNameValue : true)
                .filter(data=> this.selectedProductionStatusValue &&
                  this.selectedProductionStatusValue !== 'Show all'  ? data.productionStatus === this.selectedProductionStatusValue : true)
                .filter(data=> {

                  if (!this.selectedStartDate) {
                    return true;
                  }

                  const date = new Date(data.productionDate);
                  const trimmedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  const startTimeSeconds = this.selectedStartDate?.toDate().getTime();
                  const endTimeSeconds = this.selectedEndDate?.toDate().getTime();

                  if (!endTimeSeconds) {
                    return trimmedDate.getTime() <= startTimeSeconds ? true : false;
                  } else {
                    return trimmedDate.getTime() >= startTimeSeconds && trimmedDate.getTime() <= endTimeSeconds? true : false;
                  }

                });

  }

  onExportAsExcel(): void {
    const columnNames = [
                          'ProductionID',
                          'Product Name',
                          'Product Group',
                          'Production Quantity',
                          'Production Status',
                          'Production Date',
                          'Remarks'
                        ];
    const exportFileContent = [];
    this.getFilteredList().forEach(elem=>{
      const tmp = {};
      tmp[columnNames[0]] = elem.productionID;
      tmp[columnNames[1]] = elem.product.productName;
      tmp[columnNames[2]] = elem.product.productGroup.productGroupName;
      tmp[columnNames[3]] = elem.productionQuantity;
      tmp[columnNames[4]] = elem.productionStatus;
      tmp[columnNames[5]] = elem.productionDate;
      tmp[columnNames[6]] = elem.remarks;

      exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'production_list');
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
