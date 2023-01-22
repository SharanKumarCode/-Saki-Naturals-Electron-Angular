import {MediaMatcher} from '@angular/cdk/layout';
import {Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  private path = 'assets/icon/';

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private domSanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry,
              private electronService: ElectronService) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);

    this.matIconRegistry
    .addSvgIcon('products',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'products_icon.svg'))
    .addSvgIcon('production',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'production_icon.svg'))
    .addSvgIcon('employee',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'employee_icon.svg'))
    .addSvgIcon('expense',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'expense_icon.svg'))
    .addSvgIcon('clients',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'clients_icon.svg'))
    .addSvgIcon('purchase',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'purchase_icon.svg'))
    .addSvgIcon('sales',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'sales_icon.svg'))
    .addSvgIcon('settings',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'settings_icon.svg'))
    .addSvgIcon('menu',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'menu_icon.svg'))
    .addSvgIcon('close',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'close_icon.svg'));

  }


  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.electronService.closeApp();
  }

}
