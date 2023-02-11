import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IMaterialData } from '../../core/interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PromptDialogComponent } from '../../dialogs/prompt-dialog/prompt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateMaterialDialogComponent } from '../../dialogs/add-update-material-dialog/add-update-material-dialog.component';
import { MaterialdbService } from '../../core/services/material/materialdb.service';
import { MaterialService } from '../../core/services/material/material.service';

@Component({
  selector: 'app-material-detail',
  templateUrl: './material-detail.component.html',
  styleUrls: ['./material-detail.component.scss']
})
export class MaterialDetailComponent implements OnInit {

  materialData: IMaterialData;

  panelOpenState = false;
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private materialDBservice: MaterialdbService,
    private materialService: MaterialService,
    private location: Location,
  ) {

    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));
  }

  onUpdateMaterial(): void {
    console.log('INFO : Opening dialog box add Material');
    const dialogRef = this.dialog.open(AddUpdateMaterialDialogComponent, {
      width: '50%',
      data: {
        materialID: this.materialData.materialID,
        materialName: this.materialData.materialName,
        description: this.materialData.description,
        remarks: this.materialData.remarks,
        editCreate: 'Edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      if (result){
        this.materialDBservice.updateMaterial(result);
      }
    });
  }

  onDeleteMaterial(): void {
    const dialogRef = this.dialog.open(PromptDialogComponent, {
      width: '50%',
      data: 'Are you sure you want to delete the Material ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        console.log(result);
      }
    });
  }

  onRefresh(): void {

  }

  onBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data=>{
      this.materialData = data.materialData;
      this.materialService.getSelectedMaterialData().subscribe(d=>{
        this.materialData = d;
      });
    });
  }

}
