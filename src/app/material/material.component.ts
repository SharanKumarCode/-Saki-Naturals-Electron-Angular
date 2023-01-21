import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { IMaterialData } from '../core/interfaces/interfaces';
import { AddUpdateMaterialDialogComponent } from '../dialogs/add-update-material-dialog/add-update-material-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { MaterialService } from '../core/services/material/material.service';
import { MaterialdbService } from '../core/services/material/materialdb.service';
import { Router } from '@angular/router';
import { __values } from 'tslib';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
                                'serial_number',
                                'material_name',
                                'stock',
                                'consumed',
                                'createdDate'];
  dataSource = new MatTableDataSource();

  private materialListObservable: Subject<IMaterialData[]>;

  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private materialService: MaterialService,
    private materialDBservice: MaterialdbService,
    private router: Router
  ) {

    this.matIconRegistry
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'))
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'));

  }

  getMaterials(): void {
    this.materialDBservice.getMaterials();
    this.materialListObservable.subscribe(data=>{
      data.map((value, index)=>({
          ...value,
          serialNumber: index
        }));
      const tmp = [];
      data.forEach((element, index)=>{
        tmp.push({
          ...element,
          serialNumber: index + 1
        });
      });
      this.dataSource = new MatTableDataSource(tmp);
    });
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

  ngOnInit(): void {
    this.materialListObservable = this.materialService.getMaterialList();
    this.getMaterials();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
