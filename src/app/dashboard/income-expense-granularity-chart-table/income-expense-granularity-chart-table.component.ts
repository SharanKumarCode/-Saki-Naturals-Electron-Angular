import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _moment from 'moment';
import { ExportService } from '../../core/services/export.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';

import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { EnumTransactionGroup } from '../../core/interfaces/enums';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-income-expense-granularity-chart-table',
  templateUrl: './income-expense-granularity-chart-table.component.html',
  styleUrls: ['./income-expense-granularity-chart-table.component.scss']
})
export class IncomeExpenseGranularityChartTableComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  selectedValIncomeExpense = 'income';

  selectedStartDate: _moment.Moment;
  selectedEndDate: _moment.Moment;

  selectedTransactionNameValues: string[];
  transactionNamesList = [];

  chartData: any;

  fetchedChartDataMod = [];
  chartSeriesExpense = [];
  chartDatesExpense = [];
  chartSeriesIncome = [];
  chartDatesIncome = [];
  transactionAmountTemplateExpense = {};
  transactionAmountTemplateIncome = {};

  private destroy$ = new Subject();
  private path = 'assets/icon/';

  constructor(
    private exportService: ExportService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,

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
        height: 320,
        type: 'line',
        zoom: {
          type: 'x',
          enabled: true,
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

  setChartDataValue() {

    this.chartSeriesExpense = [];
    this.chartSeriesIncome = [];
    this.chartDatesExpense = [];
    this.chartDatesIncome = [];

    Object.keys(this.transactionAmountTemplateExpense).forEach(f=>{
      if (!['transactionDate', 'transactionGroup'].includes(f)) {
        this.chartSeriesExpense.push({
          name: f,
          data: []
        });
      }
    });

    Object.keys(this.transactionAmountTemplateIncome).forEach(f=>{
      if (!['transactionDate', 'transactionGroup'].includes(f)) {
        this.chartSeriesIncome.push({
          name: f,
          data: []
        });
      }
    });

    this.fetchedChartDataMod.forEach(e=>{
      if (e.transactionGroup === EnumTransactionGroup.expense) {
        Object.keys(e).forEach(f=>{
          this.chartSeriesExpense.filter(i=> i.name === f)[0]?.data.push(e[f]);
        });
        this.chartDatesExpense.push(e.transactionDate.toDateString());
      } else {
        Object.keys(e).forEach(f=>{
          this.chartSeriesIncome.filter(i=> i.name === f)[0]?.data.push(e[f]);
        });
        this.chartDatesIncome.push(e.transactionDate.toDateString());
      }
    });

    if (this.selectedTransactionNameValues && this.selectedTransactionNameValues.length !== 0) {
      this.chartSeriesExpense = this.chartSeriesExpense.filter(d=> this.selectedTransactionNameValues?.includes(d.name));
      this.chartSeriesIncome = this.chartSeriesIncome.filter(d=> this.selectedTransactionNameValues?.includes(d.name));
    }

    if (this.selectedValIncomeExpense.toLowerCase() === EnumTransactionGroup.income.toLowerCase()) {

      this.chartData.series = this.chartSeriesIncome;
      this.chartData.categories = this.chartDatesIncome;
    } else {

      this.chartData.series = this.chartSeriesExpense;
      this.chartData.categories = this.chartDatesExpense;
    }

    this.setChartData();
  }

  onToggleIncomeExpenseChange(): void {

    if (this.selectedValIncomeExpense.toLowerCase() === EnumTransactionGroup.income.toLowerCase()) {
      this.transactionNamesList = this.chartSeriesIncome.map(e=> e.name);

      this.chartData.series = this.chartSeriesIncome;
      this.chartData.categories = this.chartDatesIncome;
    } else {
      this.transactionNamesList = this.chartSeriesExpense.map(e=> e.name);

      this.chartData.series = this.chartSeriesExpense;
      this.chartData.categories = this.chartDatesExpense;
    }

    this.setChartData();
  }

  onFilterChange(): void {
    console.log(this.selectedTransactionNameValues);

    this.setChartDataValue();
  }

  onClearFilters(): void {
    this.selectedTransactionNameValues = undefined;
    this.selectedStartDate = undefined;
    this.selectedEndDate = undefined;
    this.onFilterChange();
  }

  onExportAsExcel(): void {
    this.dashboardService.exportIncomeExpenseGranularityReport();
  }

  ngOnInit(): void {

    console.log(this.selectedValIncomeExpense);

    this.setChartData();
    const transactionNames = [];
    this.transactionAmountTemplateExpense = {
      transactionGroup: EnumTransactionGroup.expense,
      transactionDate: new Date()
    };
    this.transactionAmountTemplateIncome = {
      transactionGroup: EnumTransactionGroup.income,
      transactionDate: new Date()
    };

    this.dashboardService.getIncomeExpenseTransactionList().pipe(takeUntil(this.destroy$)).subscribe(data=>{
      data.forEach(d=>{
        if (transactionNames
          .filter(e=> e.transactionName === d.transactionName && e.transactionGroup === d.transactionGroup).length === 0) {
          transactionNames.push({
            transactionName: d.transactionName,
            transactionGroup: d.transactionGroup
          });
        }
      });

      transactionNames.forEach(e=>{
        if (!Object.keys(this.transactionAmountTemplateExpense).includes(e.transactionName)
            && e.transactionGroup === EnumTransactionGroup.expense) {
              this.transactionAmountTemplateExpense[e.transactionName] = 0;
        } else if (!Object.keys(this.transactionAmountTemplateIncome).includes(e.transactionName)
        && e.transactionGroup === EnumTransactionGroup.income) {
          this.transactionAmountTemplateIncome[e.transactionName] = 0;
        }
      });

      data.sort((a,b)=>b.transactionDate.getTime() - a.transactionDate.getTime())
      .reverse()
      .forEach(d=>{
        const tmpData = {
          transactionGroup: EnumTransactionGroup.income,
          transactionDate: new Date()
        };
        Object.keys(this.transactionAmountTemplateIncome).forEach(e=>{
          if (d.transactionGroup === EnumTransactionGroup.income) {
            tmpData.transactionGroup = EnumTransactionGroup.income;
            tmpData.transactionDate = d.transactionDate;
            if (e === d.transactionName) {
              tmpData[e] = d.transactionAmount;
            } else {
              tmpData[e] = 0;
            }
          }
        });
        Object.keys(this.transactionAmountTemplateExpense).forEach(e=>{
          if (d.transactionGroup === EnumTransactionGroup.expense) {
            tmpData.transactionGroup = EnumTransactionGroup.expense;
            tmpData.transactionDate = d.transactionDate;
            if (e === d.transactionName) {
              tmpData[e] = d.transactionAmount;
            } else {
              tmpData[e] = 0;
            }
          }
        });

        const index = this.fetchedChartDataMod.findIndex(e=>e.transactionDate.toDateString() === d.transactionDate.toDateString());
        if (index !== -1) {
          Object.keys(this.fetchedChartDataMod[index]).forEach(e=>{
            if (!['transactionDate', 'transactionGroup'].includes(e) &&
                this.fetchedChartDataMod[index].transactionGroup === tmpData.transactionGroup) {
              this.fetchedChartDataMod[index][e] = this.fetchedChartDataMod[index][e] + tmpData[e];
            }
          });

        } else {
          this.fetchedChartDataMod.push(tmpData);
        }

      });

      this.setChartDataValue();

      this.transactionNamesList = Object.keys(this.transactionAmountTemplateIncome)
                                  .filter(e=> !['transactionDate', 'transactionGroup'].includes(e));

    });

}

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
