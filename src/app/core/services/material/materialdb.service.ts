import { Injectable } from '@angular/core';
import { MaterialService } from './material.service';
import { IMaterialData } from '../../interfaces/interfaces';
import { ipcRenderer } from 'electron';
import { NotificationService } from '../notification/notification.service';
import { ElectronService } from '../electron/electron.service';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialdbService {

  ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private materialService: MaterialService,
    private notificationService: NotificationService,
    private commonService: CommonService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getMaterials(): void{
    const materialList: IMaterialData[]  = [];
    this.ipcRenderer.invoke('get-materials').then(data=>{
      console.log('INFO : Received all Materials');
      data.forEach(element => {
        if (element.deleteFlag === false){
          const materialData: IMaterialData = {
            materialID: element.materialID,
            materialName: element.materialName,
            description: element.description,
            productionEntries: element.productionEntries,
            purchaseEntries: element.purchaseEntries,
            stock: element.stock,
            consumed: element.consumed,
            createdDate: element.createdDate,
            remarks: element.remarks
          };
          materialData.consumed = this.commonService.getMaterialConsumed(materialData);
          materialData.toBeConsumed = this.commonService.getMaterialToBeConsumed(materialData);
          materialData.stock = this.commonService.getMaterialStock(materialData);
          materialData.toBeInStock = this.commonService.getMaterialToBeInStock(materialData);

          materialList.push(materialData);
        }
      });
      this.materialService.updateMaterialList(materialList);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to fetch materials data from DB');

    });
  }

  getMaterialByID(materialID: string): Promise<any>{
    return this.ipcRenderer.invoke('get-material-by-id', materialID)
    .then(data=>{
      const materialData = data[0];
      materialData.consumed = this.commonService.getMaterialConsumed(materialData);
      materialData.toBeConsumed = this.commonService.getMaterialToBeConsumed(materialData);
      materialData.stock = this.commonService.getMaterialStock(materialData);
      materialData.toBeInStock = this.commonService.getMaterialToBeInStock(materialData);

      this.materialService.updateSelectedMaterialData(data[0]);

      return new Promise((res, rej)=>{
        res(true);
      });
    })
    .catch(err=>{
      console.error(err);

      return new Promise((res, rej)=>{
        rej(true);
      });
    });
  }

  insertMaterial(material: IMaterialData): void{
    this.ipcRenderer.invoke('insert-material', material)
    .then(_=>{
      console.log('INFO : added new material');
      this.getMaterials();
      this.notificationService.updateSnackBarMessageSubject('Inserted material data to DB');
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to insert material data to DB');

    });
  }

  updateMaterial(material: IMaterialData): void{
    this.ipcRenderer.invoke('update-material', material)
    .then(_=>{
      console.log('INFO : updated material');
      this.notificationService.updateSnackBarMessageSubject('Updated material data to DB');
      this.getMaterialByID(material.materialID);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to update material data to DB');
    });
  }

  deleteMaterial(materialID: string) {
    return this.ipcRenderer.invoke('soft-delete-material', materialID);

  }
}
