import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SalesService } from './sales.service';
import { Subject } from 'rxjs';
import { ISalesData } from '../../interfaces/interfaces';
import { SalesdbService } from './salesdb.service';

@Injectable({
  providedIn: 'root'
})
export class SaleDataResolverService implements Resolve<Subject<ISalesData>>{

  constructor(
    private salesService: SalesService,
    private salesDBservice: SalesdbService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Subject<ISalesData>{
    this.salesService.updateSelectedSalesID(route.paramMap.get('selectedSalesID'));
    this.salesDBservice.getSalesByID(this.salesService.getSelectedSalesID());
    return this.salesService.getSelectedSaleData();
  }
}
