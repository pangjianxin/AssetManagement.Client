import { Component, OnInit, SimpleChanges, Input, OnChanges, Output, EventEmitter } from '@angular/core';
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
  @Output() thirdLevelEmitter: EventEmitter<string> = new EventEmitter<string>();
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
      },
      right: '50%',
    },
    dataZoom: [
      { type: 'slider', start: 10, end: 60 },
      { type: 'inside' }
    ],
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    series: [{
      name: '三级分类',
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
    this.thirdLevelEmitter.emit($event.value.description);
  }
}
