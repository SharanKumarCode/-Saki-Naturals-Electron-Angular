import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { IMaterialData } from '../core/interfaces/interfaces';
import { AddUpdateMaterialDialogComponent } from '../dialogs/add-update-material-dialog/add-update-material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { MaterialService } from '../core/services/material/material.service';
import { MaterialdbService } from '../core/services/material/materialdb.service';
import { Router } from '@angular/router';
import { __values } from 'tslib';
import { CommonService } from '../core/services/common.service';
import { ExportService } from '../core/services/export.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
                                'serial_number',
                                'material_name',
                                'toBeInStock',
                                'stock',
                                'toBeConsumed',
                                'consumed',
                                'lastSuppliedBy'];
  dataSource = new MatTableDataSource([]);

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private materialService: MaterialService,
    private materialDBservice: MaterialdbService,
    private exportService: ExportService,
    private commonService: CommonService,
    private router: Router
  ) {

    this.matIconRegistry
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'))
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'));

  }

  setMaterialData(data: IMaterialData[]): void {
    data.map((value, index)=>({
      ...value,
      serialNumber: index
    }));
    const tmp = [];
    data.forEach((element, index)=>{
      tmp.push({
        ...element,
        lastSuppliedBy: this.commonService.getLastSuppliedBy(element),
        serialNumber: index + 1
      });
    });
    this.dataSource = new MatTableDataSource(tmp);
  }

  openAddDialog(): void {
    console.log('INFO : Opening dialog box add Material');
    const dialogRef = this.dialog.open(AddUpdateMaterialDialogComponent, {
      width: '50%',
      data: {
        materialName: '',
        description: '',
        remarks: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      if (result){
        this.materialDBservice.insertMaterial(result);
      }
    });
  }

  onRefresh(): void {
    this.materialDBservice.getMaterials();
  }

  onRowClick(e): void {
    this.materialService.updateSelectedMaterialID(e.materialID);
    this.router.navigate(['materials/detail', e.materialID]);
  }

  onExportAsExcel(): void {
    const columnNames = [
      'MaterialID',
      'Material Name',
      'In Purchase Transit',
      'Stock',
      'To be Consumed',
      'Consumed',
      'Last Supplied by',
      'Created Date',
      'Remarks'
    ];
    const exportFileContent = [];
    this.dataSource.data.forEach(elem=>{
    const tmp = {};
    tmp[columnNames[0]] = elem.materialID;
    tmp[columnNames[1]] = elem.materialName;
    tmp[columnNames[2]] = elem.toBeInStock;
    tmp[columnNames[3]] = elem.stock;
    tmp[columnNames[4]] = elem.toBeConsumed;
    tmp[columnNames[5]] = elem.consumed;
    tmp[columnNames[6]] = elem.lastSuppliedBy;
    tmp[columnNames[7]] = elem.createdDate;
    tmp[columnNames[8]] = elem.remarks;

    exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'materials_list');
  }

  ngOnInit(): void {
    this.materialDBservice.getMaterials();
    this.materialService.getMaterialList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setMaterialData(data);
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
