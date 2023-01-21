import { Injectable } from '@angular/core';
import { IMaterialData } from '../../interfaces/interfaces';
import { MaterialService } from './material.service';
import { MaterialdbService } from './materialdb.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialDataResolverService implements Resolve<Subject<IMaterialData>>{

  constructor(
    private materialService: MaterialService,
    private materialDBservice: MaterialdbService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Subject<IMaterialData>{
    this.materialDBservice.getMaterialByID(route.paramMap.get('materialID'));
    return this.materialService.getSelectedMaterialData();
  }
}
