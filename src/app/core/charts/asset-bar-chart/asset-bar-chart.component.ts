import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ECharts, EChartOption } from 'echarts';
import { ChartData } from 'src/app/models/dtos/chart-data';

@Component({
  selector: 'app-asset-bar-chart',
  templateUrl: './asset-bar-chart.component.html',
  styleUrls: ['./asset-bar-chart.component.scss']
})
export class AssetBarChartComponent implements OnInit, OnChanges {

  constructor() { }
  @Input() dataSet: ChartData[];
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
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    toolbox: {
      feature: {
        saveAsImage: { type: 'jpeg' },
        magicType: { type: ['line', 'bar'] }
      },
      right: '20px'
    },
    dataZoom: [
      { type: 'slider', start: 0, end: 100 },
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
