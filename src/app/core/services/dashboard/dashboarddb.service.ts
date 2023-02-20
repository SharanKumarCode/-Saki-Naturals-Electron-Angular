import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { NotificationService } from '../notification/notification.service';
import { ipcRenderer } from 'electron';
import { DashboardService } from './dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboarddbService {

  ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private notificationService: NotificationService,
    private dashboardService: DashboardService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getAllTransactions(): void {
    this.ipcRenderer.invoke('get-all-transactions-dashboard').then(data=>{
      console.log(data);
      this.dashboardService.updateIncomExpenseTransactionList(data);
    })
    .catch(err=>{
      console.error(err);
    });
  }
}
