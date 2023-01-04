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

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  { path: 'products', component: ProductsComponent },
  { path: 'product/detail', component: ProductsDetailComponent },
  { path: 'production', component: ProductionComponent },
  { path: 'clients', component: ClientComponent },
  { path: 'clients/details', component: ClientDetailComponent },
  { path: 'expense', component: ExpenseComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'purchase', component: PurchaseComponent },
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
