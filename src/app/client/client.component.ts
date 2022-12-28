import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EnumClientType } from '../core/interfaces/interfaces';


interface IClientTypeFilter {
  value: string;
  viewValue: string;
}

const tmp = [
  {
    serialNumber: 1,
    clientType: EnumClientType.customer,
    clientName: 'Sharan Industries',
    clientLocation: 'Bharathi Avenue, Coimbatore - 641017',
    contact: '9941677517',
    email: 'sharankumaraero@gmail.com',
    createdDate: new Date()
  },
  {
    serialNumber: 2,
    clientType: EnumClientType.supplier,
    clientName: 'Shanthi Industries',
    clientLocation: 'Av residency Avenue, Coimbatore - 641017',
    contact: '7584589652',
    email: 'cnshanthi@gmail.com',
    createdDate: new Date()
  }
];

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  form: FormGroup;
  selectedValue: string;
  clientTypes: IClientTypeFilter[] = [
    {value: 'cust_suppl', viewValue: 'Customer and Supplier'},
    {value: EnumClientType.customer, viewValue: EnumClientType.customer},
    {value: EnumClientType.supplier, viewValue: EnumClientType.supplier},
  ];

  displayedColumns: string[] = [
    'serial_number',
    'clientType',
    'clientName',
    'contact',
    'email',
    'clientLocation',
    'createdDate'];

  dataSource = new MatTableDataSource([]);
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private fb: FormBuilder,
  ) {

    this.matIconRegistry
    .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
   }


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(tmp);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onAddClient(): void {

  }

  onRefresh(): void {

  }

  onFilterChange(e): void {
    if (e.value === 'cust_suppl'){
      this.dataSource = new MatTableDataSource(tmp);
    } else {
      const filteredList = tmp.filter(data=> data.clientType === e.value);
      this.dataSource = new MatTableDataSource(filteredList);
    }
  }

  onRowClick(e: any){
    // this.productService.updateSelectedProductID(e.productID);
    // this.router.navigate(['product/detail']);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
