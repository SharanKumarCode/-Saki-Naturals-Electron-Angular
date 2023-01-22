import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { ProductsComponent } from './products/products.component';
import { ExpenseComponent } from './expense/expense.component';
import { SalesComponent } from './sales/sales.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { SettingsComponent } from './settings/settings.component';
import { EmployeeComponent } from './employee/employee.component';
import { SalesTransactionComponent } from './sales/sales-transaction/sales-transaction.component';
import { ProductionComponent } from './production/production.component';
import { ProductsDetailComponent } from './products/products-detail/products-detail.component';
import { AddUpdateSaleComponent } from './sales/add-update-sale/add-update-sale.component';
import { ClientComponent } from './client/client.component';
import { ClientDetailComponent } from './client/client-detail/client-detail.component';
import { SaleDataResolverService } from './core/services/sales/sale-data-resolver.service';
import { MaterialComponent } from './material/material.component';
import { MaterialDetailComponent } from './material/material-detail/material-detail.component';
import { MaterialDataResolverService } from './core/services/material/material-data-resolver.service';
import { AddUpdatePurchaseComponent } from './purchase/add-update-purchase/add-update-purchase.component';
import { PurchaseDataResolverService } from './core/services/purchase/purchase-data-resolver.service';
import { PurchaseTransactionComponent } from './purchase/purchase-transaction/purchase-transaction.component';
import { AddUpdateProductionComponent } from './production/add-update-production/add-update-production.component';
import { ProductionDataResolverService } from './core/services/production/production-data-resolver.service';
import { ProductionDetailComponent } from './production/production-detail/production-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  { path: 'products', component: ProductsComponent },
  { path: 'product/detail', component: ProductsDetailComponent },
  { path: 'materials', component: MaterialComponent },
  { path: 'materials/detail/:materialID',
    component: MaterialDetailComponent,
    resolve: {
      materialData: MaterialDataResolverService
    } },
  { path: 'production', component: ProductionComponent },
  { path: 'production/add_update_production/:createOrUpdate', component: AddUpdateProductionComponent},
  { path: 'production/add_update_production/:createOrUpdate/:selectedProductionID',
  component: AddUpdateProductionComponent,
  resolve: {
    productionData: ProductionDataResolverService
  }},
  { path: 'production/detail/:selectedProductionID',
    component: ProductionDetailComponent,
    resolve: {
      productionData: ProductionDataResolverService
    }},
  { path: 'clients', component: ClientComponent },
  { path: 'clients/details', component: ClientDetailComponent },
  { path: 'expense', component: ExpenseComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'purchase/transaction/:selectedPurchaseID',
    component: PurchaseTransactionComponent,
    resolve: {
      purchaseData: PurchaseDataResolverService
    }},
  { path: 'purchase/add_update_purchase/:createOrUpdate', component: AddUpdatePurchaseComponent},
  { path: 'purchase/add_update_purchase/:createOrUpdate/:selectedPurchaseID',
  component: AddUpdatePurchaseComponent,
  resolve: {
    purchaseData: PurchaseDataResolverService
  }},
  { path: 'employee', component: EmployeeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'sale/transaction/:selectedSalesID',
    component: SalesTransactionComponent,
    resolve: {
      saleData: SaleDataResolverService
    }},
  { path: 'sale/add_update_sale/:createOrUpdate', component: AddUpdateSaleComponent},
  { path: 'sale/add_update_sale/:createOrUpdate/:selectedSalesID',
  component: AddUpdateSaleComponent,
  resolve: {
    saleData: SaleDataResolverService
  }},
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
