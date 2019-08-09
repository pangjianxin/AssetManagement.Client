import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ECharts, EChartOption } from 'echarts';

@Component({
  selector: 'app-asset-pie-chart',
  templateUrl: './asset-pie-chart.component.html',
  styleUrls: ['./asset-pie-chart.component.scss']
})
export class AssetPieChartComponent implements OnInit, OnChanges {
  constructor() { }
  @Input() dataSet: any[];
  @Input() chartTitle = '机构资产按维度分类汇总';
  @Input() chartSubtitle = '';
  loading = true;
  mergeOptions: any;
  echart: ECharts;
  pieChartOptions: EChartOption = {
    title: {
      text: this.chartTitle,
      subtext: this.chartSubtitle
    },
    tooltip: {

    },
    toolbox: {
      feature: {
        saveAsImage: { type: 'jpeg' },
        restore: {}
      },
      right: '20px'
    },
    series: [{
      type: 'pie'
    }],
  };
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['dataSet'].firstChange) {
      this.loading = false;
      this.mergeOptions = {
        title: {
          text: this.chartTitle,
          subtext: this.chartSubtitle
        },
        dataset: [
          {
            source: this.dataSet
          }
        ]
      };
    }
  }
  onChartInit($event: ECharts) {
    this.echart = $event;
  }
  onChartClick($event) {
    console.log($event);
  }

}
