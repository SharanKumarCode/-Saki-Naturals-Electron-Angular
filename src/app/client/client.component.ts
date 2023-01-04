import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EnumClientType, IClientData } from '../core/interfaces/interfaces';
import { AddClientDialogComponent } from '../dialogs/add-client-dialog/add-client-dialog/add-client-dialog.component';
import { ClientdbService } from '../core/services/client/clientdb.service';
import { ClientService } from '../core/services/client/client.service';
import { Subject } from 'rxjs';


interface IClientTypeFilter {
  value: string;
  viewValue: string;
}

const tmpClientList = [];

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

  private clientListObservable: Subject<IClientData[]>;
  private clientData: IClientData;
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private clientDBservice: ClientdbService,
    private clientService: ClientService
  ) {

    this.clientData = {
      clientID: '',
      clientType: EnumClientType.supplier,
      clientName: '',
      contactPerson: '',
      description: '',
      contact1: '',
      contact2: '',
      addressLine1: '',
      addressLine2: '',
      createdDate: new Date(),
      city: '',
      state: '',
      country: '',
      pincode: '',
      email: '',
      remarks: ''
    };

    this.matIconRegistry
    .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));
   }

   openAddDialog(): void {
    console.log('INFO : Opening dialog box add products..');
    const dialogRef = this.dialog.open(AddClientDialogComponent, {
      width: '50%',
      data: this.clientData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      console.log(result);
      if (result){
        this.clientDBservice.insertClient(result);
      }
    });
  }

  getClients(): void {
    this.clientDBservice.getClients();
    this.clientListObservable.subscribe(data=>{
      data.map((value, index)=>({
          ...value,
          serialNumber: index
        })
      );
      tmpClientList.length = 0;
      data.forEach((element, index)=>{
        tmpClientList.push({
          ...element,
          serialNumber: index + 1
        });
      });
      this.dataSource = new MatTableDataSource(tmpClientList);
    });
  }


  ngOnInit(): void {
    this.clientListObservable = this.clientService.getClientList();
    this.getClients();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onRefresh(): void {
    this.clientDBservice.getClients();
  }

  onFilterChange(e): void {
    if (e.value === 'cust_suppl'){
      this.dataSource = new MatTableDataSource(tmpClientList);
    } else {
      const filteredList = tmpClientList.filter(data=> data.clientType === e.value);
      this.dataSource = new MatTableDataSource(filteredList);
    }
  }

  onRowClick(e: any){
    this.clientService.updateSelectedClientID(e.clientID);
    this.router.navigate(['clients/details']);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
