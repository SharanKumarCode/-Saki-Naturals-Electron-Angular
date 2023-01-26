import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IMaterialData } from '../../core/interfaces/interfaces';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Moment } from 'moment';
import { ExportService } from '../../core/services/export.service';
import { ProductionService } from '../../core/services/production/production.service';

@Component({
  selector: 'app-material-consumption-history-table',
  templateUrl: './material-consumption-history-table.component.html',
  styleUrls: ['./material-consumption-history-table.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':enter', [style({ height: 0 }), animate(100)]),
      transition(':leave', [animate(100, style({ height: 0 }))]),
    ]),
  ]
})
export class MaterialConsumptionHistoryTableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @Input() selectedMaterialData: IMaterialData;

  selectedProductionStatusValue: string;
  selectedStartDate: Moment;
  selectedEndDate: Moment;

  productionStatusList: string[];

  tmpConsumptionHistoryWithReturnList = [];
  dataSource = new MatTableDataSource([]);

  displayedColumns: string[] = [
    'serial_number',
    'productionDate',
    'consumedQuantity',
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
    this.selectedMaterialData.productionEntries.forEach((element, index)=>{
      const productionStatus = this.productionService.getProductionStatus(element.production);
      const productionStatusCompleteFlag = element.production.completedDate ? true : false;
      const productionStatusCancelledFlag = element.production.cancelledDate ? true : false;

      const consumptionHistoryData = {
        productionID: element.production.productionID,
        serialNumber: index + 1,
        consumedQuantity: element.materialQuantity,
        productionDate: element.production.productionDate,
        productionStatus,
        remarks: element.production.remarks,
        productionStatusCompleteFlag,
        productionStatusCancelledFlag
      };
      this.tmpConsumptionHistoryWithReturnList.push(consumptionHistoryData);
    });

    this.productionStatusList = ['Show all', ...new Set(this.tmpConsumptionHistoryWithReturnList.map(d=>d.productionStatus))];

    this.dataSource.data = this.tmpConsumptionHistoryWithReturnList;
  }

  onFilterChange(): void {
    this.dataSource = new MatTableDataSource(this.getFilteredList());
  }

  onClearFilters(): void {
    this.selectedProductionStatusValue = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dataSource = new MatTableDataSource(this.tmpConsumptionHistoryWithReturnList);
  }

  getFilteredList(): any[] {
    return this.tmpConsumptionHistoryWithReturnList
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
                          'Consumed Quantity',
                          'Production Status',
                          'Production Date',
                          'Remarks'
                        ];
    const exportFileContent = [];
    this.getFilteredList().forEach(elem=>{
      const tmp = {};
      tmp[columnNames[0]] = elem.productionID;
      tmp[columnNames[1]] = elem.consumedQuantity;
      tmp[columnNames[2]] = elem.productionStatus;
      tmp[columnNames[3]] = elem.productionDate;
      tmp[columnNames[4]] = elem.remarks;

      exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'consumption_history');
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
