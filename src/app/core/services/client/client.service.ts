import { Injectable } from '@angular/core';
import { IClientData } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private clientListSubject$: Subject<IClientData[]>;
  private selectedClientID: string;

  constructor() {
    this.clientListSubject$ = new Subject<IClientData[]>();
   }

   getClientList(): Subject<IClientData[]>{
    return this.clientListSubject$;
   }

   updateClientList(data: IClientData[]): void{
    this.clientListSubject$.next(data);
   }

   getSelectedClientID(): string{
    return this.selectedClientID;
   }

   updateSelectedClientID(clientID: string){
    this.selectedClientID = clientID;
   }

}
