import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Moment } from 'moment';
import * as _moment from 'moment';
import { ExportService } from '../../core/services/export.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';
import { EnumTransactionGroup } from '../../core/interfaces/enums';
import { TransactionService } from '../../core/services/transaction/transaction.service';
import { TransactiondbService } from '../../core/services/transaction/transactiondb.service';
import { Subject, takeUntil } from 'rxjs';
import { DashboarddbService } from '../../core/services/dashboard/dashboarddb.service';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-income-expense-chart-table',
  templateUrl: './income-expense-chart-table.component.html',
  styleUrls: ['./income-expense-chart-table.component.scss']
})
export class IncomeExpenseChartTableComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  selectedVal = 'chart';

  selectedTransactionGroupValue: string;
  selectedStartDate: Moment;
  selectedEndDate: Moment;

  transactionGroupList: string[];
  chartData: any;
  fetchedChartData = [];

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private exportService: ExportService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,

    private transactionDBservice: TransactiondbService,
    private dashboardDBservice: DashboarddbService,
    private dashboardService: DashboardService
  ) {

    this.chartData = {
      series: [
        {
          name: 'My-series',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      categories: [
        ['Jan', 'Feb',  'Mar',  'Apr',  'May',  'Jun',  'Jul',  'Aug', 'Sep']
      ]
    };

    this.matIconRegistry
        .addSvgIcon('export',this.domSanitizer.bypassSecurityTrustResourceUrl(this.path + 'export_icon.svg'));
  }

  setChartData(): void {

    this.chartOptions = {
      series: this.chartData.series,
      chart: {
        height: 300,
        type: 'line',
        zoom: {
          type: 'x',
          enabled: false,
          autoScaleYaxis: true
        },
      },
      title: {
        text: ''
      },
      xaxis: {
        categories: this.chartData.categories,
        type: 'datetime',
      }
    };
  }

  onFilterChange(): void {
    const incomeData = this.fetchedChartData.map(d=>d.incomeAmount);
    const expenseData = this.fetchedChartData.map(d=>d.expenseAmount);
    const dates = this.fetchedChartData.map(d=>d.transactionDate);
    const series = [
      {
        name: EnumTransactionGroup.expense,
        data: expenseData
      },
      {
        name: EnumTransactionGroup.income,
        data: incomeData
      }
    ];

    // Filter - Date

    const filteredSeriesByDate = [
      {
        name: EnumTransactionGroup.expense,
        data: []
      },
      {
        name: EnumTransactionGroup.income,
        data: []
      }
    ];
    const filteredDatesByDate = [];

    for (let i = 0; i < dates.length; i++) {
      const incomeDataIthValue = series.filter(e=> e.name === EnumTransactionGroup.income).map(e=>e.data[i])[0];
      const expenseDataIthValue = series.filter(e=> e.name === EnumTransactionGroup.expense).map(e=>e.data[i])[0];

      if (!this.selectedStartDate && !this.selectedEndDate) {
        filteredDatesByDate.push(dates[i]);
        filteredSeriesByDate.filter(d=> d.name === EnumTransactionGroup.income).map(d=>({
          name: d.name,
          data: d.data.push(incomeDataIthValue)
        }));
        filteredSeriesByDate.filter(d=> d.name === EnumTransactionGroup.expense).map(d=>({
          name: d.name,
          data: d.data.push(expenseDataIthValue)
        }));

        continue;
      }

      if (!this.selectedEndDate) {
        if (this.selectedStartDate.diff(_moment(dates[i]), 'days') >= 0) {
          filteredDatesByDate.push(dates[i]);
          filteredSeriesByDate.filter(d=> d.name === EnumTransactionGroup.income).map(d=>({
            name: d.name,
            data: d.data.push(incomeDataIthValue)
          }));
          filteredSeriesByDate.filter(d=> d.name === EnumTransactionGroup.expense).map(d=>({
            name: d.name,
            data: d.data.push(expenseDataIthValue)
          }));
        }

        continue;
      }

      if (this.selectedStartDate.diff(_moment(dates[i]), 'days') <= 0 &&
            this.selectedEndDate.diff(_moment(dates[i]), 'days') >= 0 ) {
              filteredDatesByDate.push(dates[i]);
              filteredSeriesByDate.filter(d=> d.name === EnumTransactionGroup.income).map(d=>({
                name: d.name,
                data: d.data.push(incomeDataIthValue)
              }));
              filteredSeriesByDate.filter(d=> d.name === EnumTransactionGroup.expense).map(d=>({
                name: d.name,
                data: d.data.push(expenseDataIthValue)
              }));
        }
    }

    // Filter - TransactionGroupValue

    const filteredDatesByGroup = [];
    let filteredSeriesByGroup = [];

    filteredSeriesByGroup = this.selectedTransactionGroupValue !== undefined ?
                            filteredSeriesByDate.filter(d=> d.name === this.selectedTransactionGroupValue).map(d=> ({
                              name: d.name,
                              data: d.data.filter(e=>e !== 0)
                            })) :
                            filteredSeriesByDate;

    for (let i=0; i < incomeData.length; i++){
      if (this.selectedTransactionGroupValue === EnumTransactionGroup.income) {
        if (incomeData[i] !== 0) {
          filteredDatesByGroup.push(filteredDatesByDate[i]);
        }
      } else if (this.selectedTransactionGroupValue === EnumTransactionGroup.expense) {
        if (expenseData[i] !== 0) {
          filteredDatesByGroup.push(filteredDatesByDate[i]);
        }
      } else {
        filteredDatesByGroup.push(filteredDatesByDate[i]);
      }
    }

    this.chartData.series = filteredSeriesByGroup;
    this.chartData.categories = filteredDatesByGroup;

    this.setChartData();
  }

  onClearFilters(): void {
    this.selectedTransactionGroupValue = undefined;
    this.selectedStartDate = undefined;
    this.selectedEndDate = undefined;
    this.onFilterChange();
  }

  generateDummyData(): void {
    let dates = [];
    const data = [];
    const secData = [];

    for (let i = 0; i < 12; i++) {
      for (let d = 1; d < 30; d++) {
        if (i === 1 && d > 28) {
          continue;
        }
        dates.push((new Date(2023, i, d)).toDateString());
      }
    }

    dates = [(new Date(2023, 1, 2)).toDateString(), (new Date(2022, 6, 15)).toDateString()];

    dates.forEach(e=>{
      data.push(Math.floor(Math.random() * (10000 - 100) + 100));
      secData.push(Math.floor(Math.random() * (10000 - 100) + 100));
    });

    this.chartData.series = [
      {
        name: EnumTransactionGroup.expense,
        data
      },
      {
        name: EnumTransactionGroup.income,
        data: secData
      }
    ];

    this.chartData.categories = dates;

    this.setChartData();
  }

  ngOnInit(): void {

    this.setChartData();
    this.transactionGroupList = [EnumTransactionGroup.income, EnumTransactionGroup.expense];

    this.transactionDBservice.getAllTransactionEntries();
    this.dashboardService.getIncomeExpenseTransactionList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
      data.sort((a,b)=>b.transactionDate.getTime() - a.transactionDate.getTime())
      .reverse()
      .forEach(d=>{
        const index = this.fetchedChartData.findIndex(e=>e.transactionDate === d.transactionDate.toDateString());
        if ( index !== -1) {
          this.fetchedChartData[index].incomeAmount = d.transactionGroup === EnumTransactionGroup.income ?
                                                      d.transactionAmount + this.fetchedChartData[index].incomeAmount :
                                                      this.fetchedChartData[index].incomeAmount;
          this.fetchedChartData[index].expenseAmount = d.transactionGroup === EnumTransactionGroup.expense ?
                                                       d.transactionAmount + this.fetchedChartData[index].expenseAmount :
                                                       this.fetchedChartData[index].expenseAmount;
        } else {
          this.fetchedChartData.push({
            incomeAmount: d.transactionGroup === EnumTransactionGroup.income ? d.transactionAmount : 0,
            expenseAmount: d.transactionGroup === EnumTransactionGroup.expense ? d.transactionAmount : 0,
            transactionDate: d.transactionDate.toDateString()
          });
        }

      });

      const incomeData = this.fetchedChartData.map(d=>d.incomeAmount);
      const expenseData = this.fetchedChartData.map(d=>d.expenseAmount);
      const dates = this.fetchedChartData.map(d=>d.transactionDate);

      this.chartData.series = [
        {
          name: EnumTransactionGroup.expense,
          data: expenseData
        },
        {
          name: EnumTransactionGroup.income,
          data: incomeData
        }
      ];
      this.chartData.categories = dates;

      this.setChartData();
    });

    this.dashboardDBservice.getAllTransactions();
}

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
