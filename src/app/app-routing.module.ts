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
import { ProductsDataResolverService } from './core/services/products/products-data-resolver.service';
import { ClientDataResolverService } from './core/services/client/client-data-resolver.service';
import { AddUpdateEmployeeComponent } from './employee/add-update-employee/add-update-employee.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { EmployeeDataResolverService } from './core/services/employee/employee-data-resolver.service';
import { LoginComponent } from './login/login.component';
import { AuthGuardServiceService } from './core/services/auth-guard-service.service';
import { AddUpdateCompanyComponent } from './settings/add-update-company/add-update-company.component';
import { CompanyDataResolverService } from './core/services/settings/company-data-resolver.service';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuardServiceService] },
  { path: 'product/detail/:selectedProductID',
    component: ProductsDetailComponent,
    canActivate: [AuthGuardServiceService],
    resolve: {
      productData: ProductsDataResolverService
    }},
  { path: 'materials', component: MaterialComponent, canActivate: [AuthGuardServiceService] },
  { path: 'materials/detail/:materialID',
    component: MaterialDetailComponent,
    canActivate: [AuthGuardServiceService],
    resolve: {
      materialData: MaterialDataResolverService
    } },
  { path: 'production', component: ProductionComponent, canActivate: [AuthGuardServiceService] },
  { path: 'production/add_update_production/:createOrUpdate',
    component: AddUpdateProductionComponent,
    canActivate: [AuthGuardServiceService]},
  { path: 'production/add_update_production/:createOrUpdate/:selectedProductionID',
  component: AddUpdateProductionComponent,
  canActivate: [AuthGuardServiceService],
  resolve: {
    productionData: ProductionDataResolverService
  }},
  { path: 'production/detail/:selectedProductionID',
    component: ProductionDetailComponent,
    canActivate: [AuthGuardServiceService],
    resolve: {
      productionData: ProductionDataResolverService
    }},
  { path: 'clients', component: ClientComponent, canActivate: [AuthGuardServiceService] },
  { path: 'clients/detail/:selectedClientID',
    component: ClientDetailComponent,
    canActivate: [AuthGuardServiceService],
    resolve: {
      clientData: ClientDataResolverService
    }},
  { path: 'transactions', component: TransactionsComponent,canActivate: [AuthGuardServiceService] },
  { path: 'expense', component: ExpenseComponent,canActivate: [AuthGuardServiceService] },
  { path: 'sales', component: SalesComponent, canActivate: [AuthGuardServiceService] },
  { path: 'purchase', component: PurchaseComponent, canActivate: [AuthGuardServiceService] },
  { path: 'purchase/transaction/:selectedPurchaseID',
    component: PurchaseTransactionComponent,
    canActivate: [AuthGuardServiceService],
    resolve: {
      purchaseData: PurchaseDataResolverService
    }},
  { path: 'purchase/add_update_purchase/:createOrUpdate', component: AddUpdatePurchaseComponent, canActivate: [AuthGuardServiceService]},
  { path: 'purchase/add_update_purchase/:createOrUpdate/:selectedPurchaseID',
  component: AddUpdatePurchaseComponent,
  canActivate: [AuthGuardServiceService],
  resolve: {
    purchaseData: PurchaseDataResolverService
  }},
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuardServiceService] },
  { path: 'employee/add_update_employee/:createOrUpdate', component: AddUpdateEmployeeComponent, canActivate: [AuthGuardServiceService]},
  { path: 'employee/add_update_employee/:createOrUpdate/:selectedEmployeeID',
  component: AddUpdateEmployeeComponent,
  canActivate: [AuthGuardServiceService],
  resolve: {
    employeeData: EmployeeDataResolverService
  }},
  { path: 'employee/detail/:selectedEmployeeID',
    component: EmployeeDetailComponent,
    canActivate: [AuthGuardServiceService],
    resolve: {
      employeeData: EmployeeDataResolverService
    }
  },
  { path: 'sale/transaction/:selectedSalesID',
    component: SalesTransactionComponent,
    canActivate: [AuthGuardServiceService],
    resolve: {
      saleData: SaleDataResolverService
    }},
  { path: 'sale/add_update_sale/:createOrUpdate', component: AddUpdateSaleComponent, canActivate: [AuthGuardServiceService]},
  { path: 'sale/add_update_sale/:createOrUpdate/:selectedSalesID',
  component: AddUpdateSaleComponent,
  canActivate: [AuthGuardServiceService],
  resolve: {
    saleData: SaleDataResolverService
  }},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardServiceService] },
  { path: 'settings/add_update_company', component: AddUpdateCompanyComponent, canActivate: [AuthGuardServiceService] },
  { path: 'settings/add_update_company/:selectedCompanyID',
    component: AddUpdateCompanyComponent,
    canActivate: [AuthGuardServiceService],
    resolve: {
      companyData: CompanyDataResolverService
    }
  },
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
