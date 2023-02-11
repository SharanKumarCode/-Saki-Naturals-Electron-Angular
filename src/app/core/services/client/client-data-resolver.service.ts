import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { ClientdbService } from './clientdb.service';
import { IClientData } from '../../interfaces/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientDataResolverService {

  constructor(
    private clientService: ClientService,
    private clientDBService: ClientdbService
  ) {   }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Subject<IClientData>{
    this.clientService.updateSelectedClientID(route.paramMap.get('selectedClientID'));
    this.clientDBService.getClientByID(this.clientService.getSelectedClientID());
    return this.clientService.getSelectedClientData();
  }
}
