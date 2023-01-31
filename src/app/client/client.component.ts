import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IClientData } from '../core/interfaces/interfaces';
import { AddClientDialogComponent } from '../dialogs/add-client-dialog/add-client-dialog/add-client-dialog.component';
import { ClientdbService } from '../core/services/client/clientdb.service';
import { ClientService } from '../core/services/client/client.service';
import { Subject, takeUntil } from 'rxjs';
import { ExportService } from '../core/services/export.service';
import { EnumClientType } from '../core/interfaces/enums';


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
export class ClientComponent implements OnInit, AfterViewInit, OnDestroy {

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

  private destroy$ = new Subject();
  private clientData: IClientData;
  private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private exportService: ExportService,
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

  setClientData(data: IClientData[]): void {
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
  }

  onExportAsExcel(): void {
    const columnNames = [
                          'ClientID',
                          'Client Type',
                          'Client Name',
                          'Description',
                          'Contact Person',
                          'Primary Contact #',
                          'Secondary Contact #',
                          'Landline',
                          'Email',
                          'Address',
                          'City',
                          'State',
                          'Country',
                          'PIN Code',
                          'Created Date',
                          'Remarks'
                        ];
    const exportFileContent = [];
    this.getFilteredList().forEach(elem=>{
      const tmp = {};
      tmp[columnNames[0]] = elem.clientID;
      tmp[columnNames[1]] = elem.clientType;
      tmp[columnNames[2]] = elem.clientName;
      tmp[columnNames[3]] = elem.description;
      tmp[columnNames[4]] = elem.contactPerson;
      tmp[columnNames[5]] = elem.contact1;
      tmp[columnNames[6]] = elem.contact2;
      tmp[columnNames[7]] = elem.landline;
      tmp[columnNames[8]] = elem.email;
      tmp[columnNames[9]] = `${elem.addressLine1}\n${elem.addressLine2}`;
      tmp[columnNames[10]] = elem.city;
      tmp[columnNames[11]] = elem.state;
      tmp[columnNames[12]] = elem.country;
      tmp[columnNames[13]] = elem.pincode;
      tmp[columnNames[14]] = elem.createdDate;
      tmp[columnNames[15]] = elem.remarks;

      exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'client_list');
  }

  onRefresh(): void {
    this.clientDBservice.getClients();
  }

  onFilterChange(): void {
    this.dataSource = new MatTableDataSource(this.getFilteredList());

  }

  getFilteredList(): any[] {

    if (!this.selectedValue || this.selectedValue === 'cust_suppl') {
      return tmpClientList;
    }

    return tmpClientList
            .filter(data=> data.clientType === this.selectedValue);
  }

  onRowClick(e: any){
    this.router.navigate(['clients/detail', e.clientID]);
  }

  ngOnInit(): void {
    this.clientDBservice.getClients();
    this.clientService.getClientList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
      this.setClientData(data);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
