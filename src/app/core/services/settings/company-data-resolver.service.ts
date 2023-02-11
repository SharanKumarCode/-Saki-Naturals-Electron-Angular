import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { CompanydbService } from './companydb.service';
import { ICompanyData } from '../../interfaces/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyDataResolverService {

  constructor(
    private settingsService: SettingsService,
    private companyDBService: CompanydbService
  ) {

     }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Subject<ICompanyData>{
    this.settingsService.updateSelectedCompanyID(route.paramMap.get('selectedCompanyID'));
    this.companyDBService.getCompanyByID(this.settingsService.getSelectedCompanyID());
    return this.settingsService.getSelectedCompanyData();
  }

}
