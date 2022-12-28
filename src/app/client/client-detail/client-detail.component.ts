import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EnumClientType, IClientData } from '../../core/interfaces/interfaces';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  panelOpenState = false;

  displayedColumns: string[] = [
                                  'serial_number',
                                  'productGroup',
                                  'productName',
                                  'saleType',
                                  'sellingPrice',
                                  'soldQuantity',
                                  'totalAmount',
                                  'paidAmount',
                                  'balanceAmount',
                                  'salesDate'
                                ];
  selectedClientID: string;
  selectedClientData: IClientData;
  dataSource = new MatTableDataSource([]);
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
  ) {
    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));

    this.selectedClientData = {
      clientContact: '+91 9941677517',
      clientLocation: '655/2B/45, Bharathi Avenue, Ponnegoundenpudur, Masagoundenchettipalayam, Coimbatore - 641107',
      clientName: 'Sharan Industries',
      clientType: EnumClientType.supplier,
      createdDate: 'March 16th 2022',
      clientID: '1456awd-awaewdwa-feafdawd',
      remarks: ''
    };
   }

  ngOnInit(): void {

  }

  onUpdateClient(): void {

  }

  onDeleteClient(): void {

  }

  onRowClick(row: any): void {

  }

  onRefresh(): void {

  }

  onBack(): void {

  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
