import { Component, OnInit } from '@angular/core';
import { AppUpdateService } from '../core/services/app-update.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  statusMessage: string;
  appVersion: string;

  constructor(
    private appUpdateService: AppUpdateService
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

  ngOnInit(): void {
    this.appUpdateService.getAppVersion()
    .then(data=>{
      console.log(data);
      this.appVersion = data;
    });
    // this.appUpdateService.checkForAppUpdates()
    // .then(data=>{
    //   this.statusMessage = data;
    // })
    // .catch(err=>{
    //   console.log(err);
    //   this.statusMessage = err;
    // });
  }

}
