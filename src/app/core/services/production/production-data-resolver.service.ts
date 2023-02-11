import { Injectable } from '@angular/core';
import { ProductionService } from './production.service';
import { ProductiondbService } from './productiondb.service';
import { IProductionData } from '../../interfaces/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionDataResolverService {

  constructor(
    private productionService: ProductionService,
    private productionDBService: ProductiondbService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Subject<IProductionData>{
    this.productionService.updateSelectedProductionID(route.paramMap.get('selectedProductionID'));
    this.productionDBService.getProductionByID(this.productionService.getSelectedProductionID());
    return this.productionService.getSelectedProductionData();
  }
}
