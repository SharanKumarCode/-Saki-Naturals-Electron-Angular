import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { ipcRenderer } from 'electron';
import { SalesService } from './sales.service';
import { ISalesData } from '../../../sales/interfaces/salesdata.interface';

@Injectable({
  providedIn: 'root'
})
export class SalesdbService {

  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private salesService: SalesService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getSalesList(): void{
    console.log('info: getting all sales data');
    const salesList: ISalesData[] = [];
    // this.ipcRenderer.invoke('get-sales')
    // .then(data=>{
    //   console.log(data);
    // })
    // .catch(err=>{
    //   console.warn(err);
    // });
  }
}
