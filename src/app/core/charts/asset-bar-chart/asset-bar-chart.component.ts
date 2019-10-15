import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ECharts, EChartOption } from 'echarts';

@Component({
  selector: 'app-asset-bar-chart',
  templateUrl: './asset-bar-chart.component.html',
  styleUrls: ['./asset-bar-chart.component.scss']
})
export class AssetBarChartComponent implements OnInit, OnChanges {

  constructor() { }
  @Input() dataSet: any[];
  @Input() chartTitle = '机构资产按维度分类汇总';
  @Input() chartSubtitle = '';
  loading = true;
  mergeOptions: any;
  echart: ECharts;
  barChartOptions: EChartOption = {
    title: {
      text: this.chartTitle,
      subtext: this.chartSubtitle,
    },
    tooltip: {

    },
    toolbox: {
      feature: {
        saveAsImage: { type: 'jpeg' },
        magicType: { type: ['line', 'bar'] }
      },
      right: '20px'
    },
    dataZoom: [
      { type: 'slider', start: 10, end: 60 },
      { type: 'inside' }
    ],
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar'
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
            dimentions: ['name'],
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
