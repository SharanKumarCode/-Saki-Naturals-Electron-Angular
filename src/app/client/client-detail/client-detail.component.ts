import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EnumClientType, IClientData } from '../../core/interfaces/interfaces';
import { ClientService } from '../../core/services/client/client.service';
import { ClientdbService } from '../../core/services/client/clientdb.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { AddClientDialogComponent } from '../../dialogs/add-client-dialog/add-client-dialog/add-client-dialog.component';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  panelOpenState = false;

  panelTitle: string;
  clientAddress: string;

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
    private clientService: ClientService,
    private clientDBService: ClientdbService,
    private notificationService: NotificationService
  ) {
    this.matIconRegistry
    .addSvgIcon('back',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'back_icon.svg'))
    .addSvgIcon('delete',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'delete_icon.svg'))
    .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'));

    this.selectedClientData = {
      clientID: '',
      clientType: EnumClientType.supplier,
      clientName: '',
      contactPerson: '',
      description: '',
      contact1: '',
      contact2: '',
      landline: '',
      addressLine1: '',
      addressLine2: '',
      createdDate: new Date(),
      city: '',
      state: '',
      country: '',
      pincode: '',
      remarks: ''
    };
   }


  getClientData(): void{
    this.clientDBService.getClientByID(this.selectedClientID)
    .then(data=>{
      this.selectedClientData = data[0];
      this.panelTitle = `CLIENT DATA - [ ${this.selectedClientData.clientType} ]`;
      this.clientAddress = this.selectedClientData.addressLine1 + ', ' + this.selectedClientData.addressLine2;
    });
  }

  openEditDialog(editClientData: IClientData): void {
    console.log('INFO : Opening dialog box edit product');
    const dialogRef = this.dialog.open(AddClientDialogComponent, {
      width: '50%',
      data: editClientData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      if (result){
        console.log(result);
        this.clientDBService.updateClient(result);
      }
    });
  }

  ngOnInit(): void {
    this.selectedClientID = this.clientService.getSelectedClientID();
    this.getClientData();
  }

  onUpdateClient(): void {
    const editClientData: IClientData = {
      ...this.selectedClientData,
      editCreate: 'Edit'
    };
    this.openEditDialog(editClientData);
  }

  onDeleteClient(): void {
    this.clientDBService.deleteClient(this.selectedClientID)
    .then(_=>{
      console.log('INFO : deleted client');
      this.notificationService.updateSnackBarMessageSubject('Deleted client from DB');
      this.onBack();

    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to delete client from DB');

    });
  }

  onRowClick(row: any): void {

  }

  onRefresh(): void {
    this.getClientData();
  }

  onBack(): void {
    this.router.navigate(['clients']);

  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
