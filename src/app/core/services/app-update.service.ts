import { Injectable } from '@angular/core';
import { ElectronService } from './electron/electron.service';
import { ipcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  private ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
  ) {
    this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  checkForAppUpdates() {
    return this.ipcRenderer.invoke('check-for-updates');
  }

  getAppVersion() {
    return this.ipcRenderer.invoke('get-app-version');
  }
}
