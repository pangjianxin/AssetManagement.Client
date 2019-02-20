import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartOption, ECharts } from 'echarts';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-asset-bar-chart',
  templateUrl: './asset-bar-chart.component.html',
  styleUrls: ['./asset-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetBarChartComponent implements OnInit, OnChanges {
  constructor() { }
  @Input() dataSet: any[];
  @Input() chartTitle = '机构资产按维度分类汇总';
  loading = true;
  mergeOptions: any;
  echart: ECharts;
  barChartOptions: EChartOption = {
    title: { text: this.chartTitle },
    tooltip: {

    },
    toolbox: {
      feature: {
        saveAsImage: { type: 'jpeg' },
        restore: {},
        dataView: {},
        magicType: { type: ['line', 'bar'] }
      }
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
        title: { text: this.chartTitle },
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
