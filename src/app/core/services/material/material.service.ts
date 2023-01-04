import { Injectable } from '@angular/core';
import { IMaterialData } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private materialListSubject$: Subject<IMaterialData[]>;
  private selectedMaterialID: string;

  constructor() {
    this.materialListSubject$ = new Subject<IMaterialData[]>();
   }

  getMaterialList(): Subject<IMaterialData[]>{
    return this.materialListSubject$;
  }

  updateMaterialList(a: IMaterialData[]){
    this.materialListSubject$.next(a);
  }

  getSelectedMaterialID(): string{
    return this.selectedMaterialID;
   }

   updateSelectedMaterialID(materialID: string){
    this.selectedMaterialID = materialID;
   }
}
