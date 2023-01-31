import { Component, OnInit } from '@angular/core';
import { AppUpdateService } from '../core/services/app-update.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ICompanyData } from '../core/interfaces/interfaces';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  statusMessage: string;
  name: string;
  email: string;
  photoUrl: string;
  userPhotoUrl: string;
  lastBackup: Date;
  defaultPhotoUrl = './../../assets/icon/user_photo.png';
  appVersion: string;
  selectedCompanyData: ICompanyData;
  categories: any[];

  constructor(
    private appUpdateService: AppUpdateService,
    private socialAuthService: SocialAuthService
  ) {

    this.categories = [
      {
        name: 'Deep Purple-Amber',
        selected: true
      },
      {
        name: 'Indigo-Pink',
        selected: false
      },
      {
        name: 'Pink-Bluegrey',
        selected: false
      },
      {
        name: 'Purple-Green',
        selected: false
      }
    ];
   }

  checkForUpdate(): void {
    this.appUpdateService.checkForAppUpdates()
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
    });
  }

  onChipClicked(category): void {
    this.categories.map(d=>{
      if (d.name !== category.name){
        d.selected = false;
      } else {
        d.selected = true;
      }
    });
  }

  onUpdateCompany(): void {

  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  ngOnInit(): void {
    // this.photoUrl = this.defaultPhotoUrl;
    // this.socialAuthService.authState.subscribe((user)=>{
    //   this.name = user.name;
    //   this.email = user.email;
    //   this.photoUrl = user.photoUrl ? user.photoUrl : this.defaultPhotoUrl;
    // });
    this.name = 'sharan kumar';
    this.email = 'sharankumaraero@gmail.com';
    this.photoUrl = this.defaultPhotoUrl;
    this.appUpdateService.getAppVersion()
    .then(data=>{
      console.log(data);
      this.appVersion = data;
    });

    this.lastBackup = new Date();

    this.selectedCompanyData = {
      companyID: '8956-4684asd-awd546awd584-46a8wd84',
      companyName: 'Saki Products',
      proprietor: 'Sharan Kumar',
      contact1: '9941677517',
      contact2: '8668159714',
      landline: '0422-658785',
      addressLine1: '655/2B/45, Bharathi Avenue, Ponnegoundenpudur',
      addressLine2: 'Masagoundenchettipalayam',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '641031',
      email: 'sharankumaraero@gmail.com',
      remarks: 'Manufacturing Company',
      gstNumber: '12DWWPB9503H1Z3',
      msmeNumber: 'DL01F0006288',
      createdDate: new Date()
    };
  }

}
