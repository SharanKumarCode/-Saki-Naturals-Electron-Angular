import { Injectable } from '@angular/core';
import { ICompanyData } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';
import { EnumThemes } from '../../interfaces/enums';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private selectedCompanyID: string;
  private selectedCompanyDataSubject$: Subject<ICompanyData>;

  constructor(
  ) {
    this.selectedCompanyDataSubject$ = new Subject<ICompanyData>();

  }

  getSelectedCompanyID(): string{
    return this.selectedCompanyID;
   }

   updateSelectedCompanyID(companyID: string){
    this.selectedCompanyID = companyID;
   }

   getSelectedCompanyData(): Subject<ICompanyData>{
    return this.selectedCompanyDataSubject$;
   }

   updateSelectedCompanyData(data: ICompanyData): void {
      this.selectedCompanyDataSubject$.next(data);
   }

   getInitCompanyData(): ICompanyData {
    return {
      companyName: '-',
      proprietor: '-',
      gstNumber: '-',
      msmeNumber: '-',
      contact1: '-',
      contact2: '-',
      landline: '-',
      email: '-',
      addressLine1: '-',
      addressLine2: '-',
      city: '-',
      state: '-',
      country: 'India',
      pincode: '-',
      theme: EnumThemes.deeppurpleAmber,
      lastBackup: new Date(),
      remarks: '-'
    };
   }

}
