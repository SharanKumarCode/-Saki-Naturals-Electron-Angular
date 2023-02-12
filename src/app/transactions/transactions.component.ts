import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Moment } from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { TransactionTypeDialogComponent } from '../dialogs/transaction-type-dialog/transaction-type-dialog.component';
import { TransactionDialogComponent } from '../dialogs/transaction-dialog/transaction-dialog.component';
import { TransactiondbService } from '../core/services/transaction/transactiondb.service';
import { TransactionService } from '../core/services/transaction/transaction.service';
import { ITransactionEntry } from '../core/interfaces/interfaces';
import { ExportService } from '../core/services/export.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;

  selectedTransactionGroupValue: string;
  selectedTransactionNameValue: string;
  selectedStartDate: Moment;
  selectedEndDate: Moment;

  transactionGroupList: string[];
  transactionNameList: string[];
  transactionEntryList = [];

  displayedColumns: string[] = [
    'serial_number',
    'transactionDate',
    'transactionGroup',
    'transactionName',
    'transactionAmount',
    'remarks'
  ];
dataSource = new MatTableDataSource([]);

private destroy$ = new Subject();
private path = 'assets/icon/';

  constructor(
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private transactionDBservice: TransactiondbService,
    private transactionService: TransactionService,
    private exportService: ExportService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {

    this.matIconRegistry
        .addSvgIcon('refresh',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'refresh_icon.svg'))
        .addSvgIcon('plus',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'plus_icon.svg'));
   }

  getTransactionEntriesList(){
      this.transactionDBservice.getAllTransactionEntries();
  }

  getFilteredList(): any[] {
    return this.transactionEntryList
                .filter(data=> this.selectedTransactionGroupValue &&
                  this.selectedTransactionGroupValue !== 'Show all'  ?
                  data.transactionGroup === this.selectedTransactionGroupValue : true)
                .filter(data=> this.selectedTransactionNameValue &&
                  this.selectedTransactionNameValue !== 'Show all'  ?
                  data.transactionName === this.selectedTransactionNameValue : true)
                .filter(data=> {

                  if (!this.selectedStartDate) {
                    return true;
                  }

                  const date = new Date(data.transactionDate);
                  const trimmedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  const startTimeSeconds = this.selectedStartDate?.toDate().getTime();
                  const endTimeSeconds = this.selectedEndDate?.toDate().getTime();

                  if (!endTimeSeconds) {
                    return trimmedDate.getTime() <= startTimeSeconds ? true : false;
                  } else {
                    return trimmedDate.getTime() >= startTimeSeconds && trimmedDate.getTime() <= endTimeSeconds? true : false;
                  }

                });

  }

  setTableData(data: ITransactionEntry[]): void {
    this.transactionEntryList = [];
    data.forEach((element, index)=>{

      const transactionEntryData = {
        serialNumber: index + 1,
        transactionEntryID: element.transactionEntryID,
        transactionDate: element.transactionDate,
        transactionGroup: element.transactionType.transactionGroup,
        transactionName: element.transactionType.transactionName,
        transactionTypeID: element.transactionType.transactionTypeID,
        transactionAmount: element.transactionAmount,
        remarks: element.remarks
      };

      this.transactionEntryList.push(transactionEntryData);
    });

    this.transactionGroupList = ['Show all', ...new Set(this.transactionEntryList.map(d=>d.transactionGroup))];
    this.transactionNameList = ['Show all', ...new Set(this.transactionEntryList.map(d=>d.transactionName))];

    this.dataSource = new MatTableDataSource(this.transactionEntryList);
  }

  onFilterChange(): void {
    this.dataSource = new MatTableDataSource(this.getFilteredList());
  }

  onClearFilters(): void {
    this.selectedTransactionGroupValue = '';
    this.selectedTransactionNameValue = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dataSource = new MatTableDataSource(this.transactionEntryList);
  }

  openTransactionTypeDialog(): void {
    console.log('INFO : Opening dialog box add transaction type');
    const dialogRef = this.dialog.open(TransactionTypeDialogComponent, {
      width: '50%', height: '80%'
    });

    dialogRef.afterClosed().subscribe(_ => {
      console.log('INFO : The dialog box is closed');
    });
  }

  onAddTransaction(): void {
    console.log('INFO : Opening dialog box add transaction');
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '50%',
      data: {
        editCreate: 'Create',
        remarks: '',
        transactionDate: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      if (result){
        console.log(result);
        this.transactionDBservice.insertTransactionEntry(result);
      }
    });
  }

  onExportAsExcel(): void {
    const columnNames = [
      'Transaction EntryID',
      'Transaction Group',
      'Transaction Name',
      'Transaction Amount',
      'Transaction Date',
      'Remarks'
    ];

    const exportFileContent = [];
    this.getFilteredList().forEach(elem=>{
      const tmp = {};
      tmp[columnNames[0]] = elem.transactionEntryID;
      tmp[columnNames[1]] = elem.transactionGroup;
      tmp[columnNames[2]] = elem.transactionName;
      tmp[columnNames[3]] = elem.transactionAmount;
      tmp[columnNames[4]] = elem.transactionDate;
      tmp[columnNames[5]] = elem.remarks;


      exportFileContent.push(tmp);
    });
    this.exportService.exportAsExcel(exportFileContent, 'transactions_list');
  }

  onRowClick(e): void {
    console.log('INFO : Opening dialog box update transaction');
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '50%',
      data: {
        editCreate: 'Edit',
        remarks: e.remarks,
        transactionDate: e.transactionDate,
        transactionEntryID: e.transactionEntryID,
        transactionAmount: e.transactionAmount,
        transactionType: {
          transactionGroup: e.transactionGroup,
          transactionName: e.transactionName,
          transactionTypeID: e.transactionTypeID
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('INFO : The dialog box is closed');
      if (result){
        if (result.editCreate === 'Edit') {
        this.transactionDBservice.updateTransactionEntry(result);
        } else {
          this.transactionDBservice.deleteTransactionEntry(result.transactionEntryID);
        }
      }
    });
  }

  onRefresh(): void {
    this.getTransactionEntriesList();
  }

  ngOnInit(): void {
    this.getTransactionEntriesList();
    this.transactionService.getTransactionEntryList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
      console.log(data);
      this.setTableData(data);
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
