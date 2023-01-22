import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { IClientData } from '../../interfaces/interfaces';
import { ipcRenderer } from 'electron';
import { ElectronService } from '../electron/electron.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ClientdbService {

  ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private clientService: ClientService,
    private notificationService: NotificationService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getClients(): void{
    const clientsList: IClientData[]  = [];
    this.ipcRenderer.invoke('get-clients').then(data=>{
      console.log('INFO : Received all clients');
      data.forEach(element => {
        if (element.deleteFlag === false){
          const clientData: IClientData = {
            clientID: element.clientID,
            clientType: element.clientType,
            clientName: element.clientName,
            contactPerson: element.contactPerson,
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
            description: element.description,
            createdDate: element.createdDate,
            remarks: element.remarks
          };
          clientsList.push(clientData);
        }
      });
      this.clientService.updateClientList(clientsList);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to fetch clients data from DB');

    });
  }

  getClientByID(clientID: string): Promise<any>{
    return this.ipcRenderer.invoke('get-client-by-id', clientID);
  }

  insertClient(client: IClientData): void{
    this.ipcRenderer.invoke('insert-client', client)
    .then(_=>{
      console.log('INFO : added new client');
      this.getClients();
      this.notificationService.updateSnackBarMessageSubject('Inserted client data to DB');
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to insert client data to DB');

    });
  }

  updateClient(client: IClientData): void{
    this.ipcRenderer.invoke('update-client', client)
    .then(_=>{
      console.log('INFO : updated client');
      this.notificationService.updateSnackBarMessageSubject('Updated client data to DB');

    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to update client data to DB');
    });
  }

  deleteClient(clientID: string) {
    return this.ipcRenderer.invoke('soft-delete-client', clientID);

  }

}
