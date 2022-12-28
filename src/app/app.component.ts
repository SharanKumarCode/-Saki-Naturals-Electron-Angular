import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { Subject } from 'rxjs';
import { NotificationService } from './core/services/notification/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  timerFlag = true;
  private snackBarMessageObservable: Subject<string>;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private snackbar: MatSnackBar,
  ) {
    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (this.electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
    } else {
      console.log('Run in browser');
    }

    setInterval(()=>this.timerFlag = false, 2500);

    this.snackBarMessageObservable = this.notificationService.getSnackBarMessageSubject();
    this.snackBarMessageObservable.subscribe(message=>{
      this.snackbar.open(message, 'close');
    });
  }
}
