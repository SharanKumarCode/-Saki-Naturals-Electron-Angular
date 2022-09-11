import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { SalesDialogComponent } from '../dialogs/sales-dialog/sales-dialog.component';

import { ElectronService } from '../core/services';

import { EnumSaleType, ISalesData } from './interfaces/salesdata.interface';
import { SalesService } from '../core/services/sales/sales.service';
import { SalesdbService } from '../core/services/sales/salesdb.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
                                'serial_number',
                                'salesID',
                                'purchaser',
                                'supplier',
                                'productGroup',
                                'productName',
                                'saleType',
                                'sellingPrice',
                                'soldQuantity',
                                'totalAmount',
                                'paidAmount',
                                'balanceAmount',
                                'remarks'
                              ];
  dataSource = new MatTableDataSource([]);

  private salesData: ISalesData;

  constructor(
    private electronService: ElectronService,
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private salesService: SalesService,
    private salesdbService: SalesdbService
  ) {
    this.salesData = {
      productID: '',
      productName: '',
      currentStock: 0,
      group: '',
      saleDate: '',
      saleTime: '',
      purchaser: '',
      supplier: '',
      saleType: EnumSaleType.dealer,
      sellingPrice: 0,
      sellingQuantity: 0,
      remarks: ''
    };
  }

  ngOnInit(): void {
    this.getSalesList();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getSalesList(){
    this.salesdbService.getSalesList();
  }

  openAddDialog(): void {
    console.log('opening dialog box add sales..');
    const dialogRef = this.dialog.open(SalesDialogComponent, {
      width: '50%',
      data: this.salesData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog box is closed');
      console.log(result);
      if (result){
        // this.electronService.insertProduct(result);
        this.salesdbService.insertSales(result);
      }
    });
  }

  onRowClick(e: any){
  }

  onRefresh(){
    this.getSalesList();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

}
