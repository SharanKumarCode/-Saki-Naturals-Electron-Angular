import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsComponent } from './products/products.component';
import { ExpenseComponent } from './expense/expense.component';
import { SalesComponent } from './sales/sales.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { EmployeeComponent } from './employee/employee.component';
import { SettingsComponent } from './settings/settings.component';
import { AddProductsDialogComponent } from './dialogs/add-products-dialog/add-products-dialog.component';
import { SalesReturnDialogComponent } from './dialogs/sales-return-dialog/sales-return-dialog.component';
import { SalesTransactionComponent } from './sales/sales-transaction/sales-transaction.component';
import {
  SalesPurchaseTransactionDialogComponent
 } from './dialogs/sales-purchase-transaction-dialog/sales-purchase-transaction-dialog.component';
import { SplashPageComponent } from './splash-page/splash-page.component';
import { ProductionComponent } from './production/production.component';
import { ProductsDetailComponent } from './products/products-detail/products-detail.component';
import { AddUpdateSaleComponent } from './sales/add-update-sale/add-update-sale.component';
import { ClientComponent } from './client/client.component';
import { ClientDetailComponent } from './client/client-detail/client-detail.component';
import { ProductGroupDialogComponent } from './dialogs/product-group-dialog/product-group-dialog.component';
import { AddClientDialogComponent } from './dialogs/add-client-dialog/add-client-dialog/add-client-dialog.component';
import { MaterialModule } from '../material.module';
import { SaleProgressTrackerComponent } from './sales/sale-progress-tracker/sale-progress-tracker/sale-progress-tracker.component';
import { SalesTransactionTableComponent } from './sales/sales-transaction-table/sales-transaction-table.component';
import { MaterialComponent } from './material/material.component';
import { AddUpdateMaterialDialogComponent } from './dialogs/add-update-material-dialog/add-update-material-dialog.component';
import { MaterialDetailComponent } from './material/material-detail/material-detail.component';
import { PromptDialogComponent } from './dialogs/prompt-dialog/prompt-dialog.component';
import { AddUpdatePurchaseComponent } from './purchase/add-update-purchase/add-update-purchase.component';
import { PurchaseTransactionComponent } from './purchase/purchase-transaction/purchase-transaction.component';
import { PurchaseTransactionTableComponent } from './purchase/purchase-transaction-table/purchase-transaction-table.component';
import { PurchaseReturnDialogComponent } from './dialogs/purchase-return-dialog/purchase-return-dialog.component';
import { PurchaseProgressTrackerComponent } from './purchase/purchase-progress-tracker/purchase-progress-tracker.component';
import { AddUpdateProductionComponent } from './production/add-update-production/add-update-production.component';
import { ProductionDetailComponent } from './production/production-detail/production-detail.component';
import { ProductionProgressTrackerComponent } from './production/production-progress-tracker/production-progress-tracker.component';
import { ProductSalesHistoryTableComponent } from './products/product-sales-history-table/product-sales-history-table.component';
import {
  ProductsProductionHistoryTableComponent
 } from './products/products-production-history-table/products-production-history-table.component';
import {
  MaterialPurchaseHistoryTableComponent
} from './material/material-purchase-history-table/material-purchase-history-table.component';
import {
  MaterialConsumptionHistoryTableComponent
} from './material/material-consumption-history-table/material-consumption-history-table.component';
import { AddUpdateEmployeeComponent } from './employee/add-update-employee/add-update-employee.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';
import { CalendarComponent } from './employee/calendar/calendar.component';
import {
  EmployeeAttendanceHistoryTableComponent
} from './employee/employee-attendance-history-table/employee-attendance-history-table.component';
import { EmployeeSalaryHistoryTableComponent } from './employee/employee-salary-history-table/employee-salary-history-table.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardServiceService } from './core/services/auth-guard-service.service';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';


// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');
const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const lang = 'en-US';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductsComponent,
    ExpenseComponent,
    SalesComponent,
    PurchaseComponent,
    EmployeeComponent,
    SettingsComponent,
    AddProductsDialogComponent,
    SalesReturnDialogComponent,
    SalesTransactionComponent,
    SalesPurchaseTransactionDialogComponent,
    SplashPageComponent,
    ProductionComponent,
    ProductsDetailComponent,
    AddUpdateSaleComponent,
    ClientComponent,
    ClientDetailComponent,
    ProductGroupDialogComponent,
    AddClientDialogComponent,
    SaleProgressTrackerComponent,
    SalesTransactionTableComponent,
    MaterialComponent,
    AddUpdateMaterialDialogComponent,
    MaterialDetailComponent,
    PromptDialogComponent,
    AddUpdatePurchaseComponent,
    PurchaseTransactionComponent,
    PurchaseTransactionTableComponent,
    PurchaseReturnDialogComponent,
    PurchaseProgressTrackerComponent,
    AddUpdateProductionComponent,
    ProductionDetailComponent,
    ProductionProgressTrackerComponent,
    ProductSalesHistoryTableComponent,
    ProductsProductionHistoryTableComponent,
    MaterialPurchaseHistoryTableComponent,
    MaterialConsumptionHistoryTableComponent,
    AddUpdateEmployeeComponent,
    EmployeeDetailComponent,
    CalendarComponent,
    EmployeeAttendanceHistoryTableComponent,
    EmployeeSalaryHistoryTableComponent,
    LoginComponent

    ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocialLoginModule,

    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatCardModule,
    MatTabsModule,
    MaterialModule,
    MatStepperModule,
    MatRadioModule,
    MatSlideToggleModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('78240900209-7t7he8b9tbgt22d54gflduvfcavhisqe.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig,
    }, AuthGuardServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
