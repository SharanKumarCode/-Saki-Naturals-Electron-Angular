import { Component, OnInit } from '@angular/core';
import { AppUpdateService } from '../core/services/app-update.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

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
  defaultPhotoUrl = './../../assets/icon/user_photo.png';
  appVersion: string;

  constructor(
    private appUpdateService: AppUpdateService,
    private socialAuthService: SocialAuthService
  ) { }

  checkForUpdate(): void {
    this.appUpdateService.checkForAppUpdates()
    .then(data=>{
      console.log(data);
    })
    .catch(err=>{
      console.log(err);
    });
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  ngOnInit(): void {
    this.photoUrl = this.defaultPhotoUrl;
    this.socialAuthService.authState.subscribe((user)=>{
      this.name = user.name;
      this.email = user.email;
      this.photoUrl = user.photoUrl ? user.photoUrl : this.defaultPhotoUrl;
    });
    this.appUpdateService.getAppVersion()
    .then(data=>{
      console.log(data);
      this.appVersion = data;
    });
  }

}
