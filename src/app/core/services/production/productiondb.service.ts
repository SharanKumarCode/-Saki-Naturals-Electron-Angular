import { Injectable } from '@angular/core';
import { IProductionData } from '../../interfaces/interfaces';
import { ProductionService } from './production.service';
import { ElectronService } from '../electron/electron.service';
import { ipcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class ProductiondbService {

  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private productionService: ProductionService,
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getProductionList(): void{
    console.log('INFO: Getting all production data');
    const productionList: IProductionData[] = [];
    this.ipcRenderer.invoke('get-production')
    .then(data=>{

      data.forEach(element=>{
        console.log(element);
        const productionData: IProductionData = {
          productionID: element.productionID,
          productionDate: element.productionDate,
          productionEntries: element.productionEntries,
          product: element.product,
          productQuantity: element.productQuantity,
          remarks: element.remarks,
          completedDate: element.completedDate,
          cancelledDate: element.cancelledDate
        };
        productionList.push(productionData);
      });
      this.productionService.updateProductionList(productionList);
    })
    .catch(err=>{
      console.error(err);
    });
  }

  getProductionByID(productionID: string): any{
    console.log('INFO: Getting production by ID');
    return this.ipcRenderer.invoke('get-production-by-id', productionID)
    .then(data=>{

      this.productionService.updateSelectedProductionData(data[0]);

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

  insertProduction(productionData: IProductionData): Promise<any>{
    console.log('INFO: Inserting production data');
    return this.ipcRenderer.invoke('insert-production', productionData);
  }

  updateProduction(productionData: IProductionData): Promise<any>{
    console.log('INFO: Updating production data');
    return this.ipcRenderer.invoke('update-production', productionData);
  }

  deleteProduction(productionID: string): Promise<any>{
    console.log('INFO: Deleting production data');
    return this.ipcRenderer.invoke('delete-production', productionID);
  }

  deleteProductionEntry(productionEntryIDs: any): Promise<any>{
    return this.ipcRenderer.invoke('delete-production-entry', productionEntryIDs);
  }
}
