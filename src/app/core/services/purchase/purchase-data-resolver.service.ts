import { Injectable } from '@angular/core';
import { PurchaseService } from './purchase.service';
import { PurchasedbService } from './purchasedb.service';
import { IPurchaseData } from '../../interfaces/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseDataResolverService {

  constructor(
    private purchaseService: PurchaseService,
    private purchaseDBService: PurchasedbService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Subject<IPurchaseData>{
    this.purchaseService.updateSelectedPurchaseID(route.paramMap.get('selectedPurchaseID'));
    this.purchaseDBService.getPurchaseByID(this.purchaseService.getSelectedPurchaseID());
    return this.purchaseService.getSelectedPurchaseData();
  }
}
