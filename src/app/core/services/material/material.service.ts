import { Injectable } from '@angular/core';
import { IMaterialData } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private materialListSubject$: Subject<IMaterialData[]>;
  private selectedMaterialID: string;
  private selectedMaterialDataSubject$: Subject<IMaterialData>;

  constructor() {
    this.materialListSubject$ = new Subject<IMaterialData[]>();
    this.selectedMaterialDataSubject$ = new Subject<IMaterialData>();
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

   getSelectedMaterialData(): Subject<IMaterialData>{
    return this.selectedMaterialDataSubject$;
   }

   updateSelectedMaterialData(data: IMaterialData): void {
      this.selectedMaterialDataSubject$.next(data);
   }
}
