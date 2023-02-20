import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EnumTransactionGroup } from '../../interfaces/enums';
import { ExportService } from '../export.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private incomeExpenseTransactionListSubject$: Subject<any[]>;
  private rawData: any;

  constructor(
    private exportService: ExportService
  ) {
    this.incomeExpenseTransactionListSubject$ = new Subject<any[]>();
    this.rawData = undefined;
   }

   getIncomeExpenseTransactionList(): Subject<any[]> {
    return this.incomeExpenseTransactionListSubject$;
   }

   updateIncomExpenseTransactionList(data): void {
    this.rawData = data;
      const transactionList = [];
      data.otherTransactions.forEach(d=>{
        transactionList.push({
          transactionGroup: d.transactionType.transactionGroup,
          transactionAmount: Math.round(d.transactionAmount),
          transactionName: d.transactionType.transactionName,
          transactionDate: d.transactionDate
        });
      });

      data.purchaseTransactions.forEach(d=>{
        transactionList.push({
          transactionGroup: EnumTransactionGroup.expense,
          transactionAmount: Math.round(d.transactionAmount),
          transactionName: 'Purchase',
          transactionDate: d.transactionDate
        });
      });

      data.salaryTransactions.forEach(d=>{
        transactionList.push({
          transactionGroup: EnumTransactionGroup.expense,
          transactionAmount: Math.round(d.amount),
          transactionName: 'Salary',
          transactionDate: d.transactionDate
        });
      });

      data.salesTransactions.forEach(d=>{
        transactionList.push({
          transactionGroup: EnumTransactionGroup.income,
          transactionAmount: Math.round(d.transactionAmount),
          transactionName: 'Sales',
          transactionDate: d.transactionDate
        });
      });

      this.incomeExpenseTransactionListSubject$.next(transactionList);
   }

   exportIncomeExpenseGranularityReport() {

    const columnNames = [
      'TransactionID',
      'Transaction Group',
      'Transaction Name',
      'Transaction Amount',
      'Transaction Date',
      'Remarks'
    ];
    let exportFileContent = [];

    this.rawData.otherTransactions.forEach(d=>{
      const tmp = {};

      tmp[columnNames[0]] = d.transactionEntryID;
      tmp[columnNames[1]] = d.transactionType.transactionGroup;
      tmp[columnNames[2]] = d.transactionType.transactionName;
      tmp[columnNames[3]] = d.transactionAmount;
      tmp[columnNames[4]] = d.transactionDate;
      tmp[columnNames[5]] = d.remarks;

      exportFileContent.push(tmp);
    });

    this.rawData.purchaseTransactions.forEach(d=>{
      const tmp = {};

      tmp[columnNames[0]] = d.transactionID;
      tmp[columnNames[1]] = EnumTransactionGroup.expense;
      tmp[columnNames[2]] = 'Purchase';
      tmp[columnNames[3]] = d.transactionAmount;
      tmp[columnNames[4]] = d.transactionDate;
      tmp[columnNames[5]] = d.remarks;

      exportFileContent.push(tmp);
    });

    this.rawData.salaryTransactions.forEach(d=>{
      const tmp = {};

      tmp[columnNames[0]] = d.salaryTransactionID;
      tmp[columnNames[1]] = EnumTransactionGroup.expense;
      tmp[columnNames[2]] = 'Salary';
      tmp[columnNames[3]] = d.amount;
      tmp[columnNames[4]] = d.transactionDate;
      tmp[columnNames[5]] = d.remarks;

      exportFileContent.push(tmp);
    });

    this.rawData.salesTransactions.forEach(d=>{
      const tmp = {};

      tmp[columnNames[0]] = d.transactionID;
      tmp[columnNames[1]] = EnumTransactionGroup.income;
      tmp[columnNames[2]] = 'Sales';
      tmp[columnNames[3]] = d.transactionAmount;
      tmp[columnNames[4]] = d.transactionDate;
      tmp[columnNames[5]] = d.remarks;

      exportFileContent.push(tmp);
    });

    exportFileContent = exportFileContent
                        .sort((a, b)=> new Date(b['Transaction Date']).getTime() - new Date(a['Transaction Date']).getTime())
                        .reverse();
    this.exportService.exportAsExcel(exportFileContent, 'transactions_list');
   }
}
