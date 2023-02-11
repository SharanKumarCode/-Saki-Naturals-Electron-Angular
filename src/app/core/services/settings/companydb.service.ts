import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { ElectronService } from '../electron/electron.service';
import { ipcRenderer } from 'electron';
import { CommonService } from '../common.service';
import { ICompanyData } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CompanydbService {

  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private settingsService: SettingsService,
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getCompany(): any {
    console.log('INFO: Getting all company data');
    this.ipcRenderer.invoke('get-company')
    .then(data=>{
      data.forEach(element=>{

        const companyData: ICompanyData = {
          companyID: element.companyID,
          companyName: element.companyName,
          proprietor: element.proprietor,
          gstNumber: element.gstNumber,
          msmeNumber: element.msmeNumber,

          contact1: element.contact1,
          contact2: element.contact2,
          landline: element.landline,
          email: element.email,

          addressLine1: element.addressLine1,
          addressLine2: element.addressLine2,
          city: element.city,
          state: element.state,
          country: element.country,
          pincode: element.pincode,
          theme: element.theme,
          lastBackup: element.lastBackup,

          remarks: element.remarks,
          createdDate: element.createdDate

        };
        this.settingsService.updateSelectedCompanyData(companyData);

      });

      if (data.length === 0) {
        this.settingsService.updateSelectedCompanyData(null);
      }
    })
    .catch(err=>{
      console.error(err);
    });
  }

  getCompanyByID(companyID: string): any{
    console.log('INFO: Getting company by ID');
    return this.ipcRenderer.invoke('get-company-by-id', companyID)
    .then(data=>{

      this.settingsService.updateSelectedCompanyData(data[0]);

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

  initialiseCompany(companyData: ICompanyData): Promise<any>{
    console.log('INFO: Initialising company');
    return this.ipcRenderer.invoke('initialise-company', companyData);
  }

  updateCompany(companyData: ICompanyData): Promise<any>{
    console.log('INFO: Updating company data');
    return this.ipcRenderer.invoke('update-company', companyData);
  }

}
