import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Moment } from 'moment';
import { IProductData } from '../../core/interfaces/interfaces';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ProductionService } from '../../core/services/production/production.service';
import { ExportService } from '../../core/services/export.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-products-production-history-table',
  templateUrl: './products-production-history-table.component.html',
  styleUrls: ['./products-production-history-table.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})
export class ProductsProductionHistoryTableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @Input() selectedProductData: IProductData;

  selectedProductionStatusValue: string;
  selectedStartDate: Moment;
  selectedEndDate: Moment;

  productionStatusList: string[];

  tmpProductionHistoryWithDefectList = [];
  dataSource = new MatTableDataSource([]);

  displayedColumns: string[] = [
    'serial_number',
    'productionDate',
    'producedQuantity',
    'defectQuantity',
    'productionStatus',
    'remarks'
  ];

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private productionService: ProductionService,
    private exportService: ExportService,
    private router: Router,
  ) { }

  setTableData() {
    this.dataSource = new MatTableDataSource();
    this.selectedProductData.production.forEach((element, index)=>{
      const productionStatus = this.productionService.getProductionStatus(element);
      const productionStatusCompleteFlag = element.completedDate ? true : false;
      const productionStatusCancelledFlag = element.cancelledDate ? true : false;

      const productionHistoryData = {
        productionID: element.productionID,
        serialNumber: index + 1,
        producedQuantity: element.productQuantity,
        productionDate: element.productionDate,
        defectQuantity: 0,
        productionStatus,
        remarks: element.remarks,
        productionStatusCompleteFlag,
        productionStatusCancelledFlag
      };
      this.tmpProductionHistoryWithDefectList.push(productionHistoryData);
    });

    this.productionStatusList = ['Show all', ...new Set(this.tmpProductionHistoryWithDefectList.map(d=>d.productionStatus))];

    this.dataSource.data = this.tmpProductionHistoryWithDefectList;
  }

  onFilterChange(): void {
    this.dataSource = new MatTableDataSource(this.getFilteredList());
  }

  onClearFilters(): void {
    this.selectedProductionStatusValue = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dataSource = new MatTableDataSource(this.tmpProductionHistoryWithDefectList);
  }

  getFilteredList(): any[] {
    return this.tmpProductionHistoryWithDefectList
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
                          'Produced Quantity',
                          'Defect Quantity',
                          'Production Status',
                          'Production Date',
                          'Remarks'
                        ];
    const exportFileContent = [];
    this.getFilteredList().forEach(elem=>{
      const tmp = {};
      tmp[columnNames[0]] = elem.productionID;
      tmp[columnNames[1]] = elem.producedQuantity;
      tmp[columnNames[2]] = elem.defectQuantity;
      tmp[columnNames[3]] = elem.productionStatus;
      tmp[columnNames[4]] = elem.productionDate;
      tmp[columnNames[5]] = elem.remarks;

      exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'production_history');
  }

  onRowClick(e: any){
    this.router.navigate(['production/detail', e.productionID]);
  }

  ngOnInit(): void {
    this.setTableData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
