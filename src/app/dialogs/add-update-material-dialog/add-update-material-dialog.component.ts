import { Component, Inject, OnInit } from '@angular/core';
import { IMaterialData } from '../../core/interfaces/interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-update-material-dialog',
  templateUrl: './add-update-material-dialog.component.html',
  styleUrls: ['./add-update-material-dialog.component.scss']
})
export class AddUpdateMaterialDialogComponent implements OnInit {

  form: FormGroup;
  materialName: string;
  description: string;
  remarks: string;
  editCreate: string;

  private path = 'assets/icon/';

  constructor(
    public dialogRef: MatDialogRef<AddUpdateMaterialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMaterialData,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
  ) {

    this.materialName = this.data.materialName;
    this.description = this.data.description;
    this.remarks = this.data.remarks;

    this.form = this.fb.group(
      {
        materialName: [this.materialName, [Validators.required, Validators.maxLength(30)]],
        description: [this.description, [Validators.required, Validators.maxLength(100)]],
        remarks: [this.remarks, [Validators.maxLength(100)]]
      }
    );

    this.matIconRegistry
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'));
  }

  onSave(): void {
    const {value, valid} = this.form;
    if (valid) {
      const materialData: IMaterialData = {
        materialName: value.materialName,
        description: value.description,
        remarks: value.remarks
      };
      this.dialogRef.close(materialData);
    }
  }

  onUpdate(): void {
    const {value, valid} = this.form;
    if (valid) {
      const materialData: IMaterialData = {
        ...this.data,
        materialName: value.materialName,
        description: value.description,
        remarks: value.remarks
      };
      this.dialogRef.close(materialData);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
