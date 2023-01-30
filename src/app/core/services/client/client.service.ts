import { Injectable } from '@angular/core';
import { IClientData } from '../../interfaces/interfaces';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private clientListSubject$: Subject<IClientData[]>;
  private selectedClientID: string;
  private selectedClientDataSubject$: Subject<IClientData>;

  constructor() {
    this.clientListSubject$ = new Subject<IClientData[]>();
    this.selectedClientDataSubject$ = new Subject<IClientData>();
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

   getSelectedClientData(): Subject<IClientData>{
    return this.selectedClientDataSubject$;
   }

   updateSelectedClientData(data: IClientData): void {
      this.selectedClientDataSubject$.next(data);
   }

}
