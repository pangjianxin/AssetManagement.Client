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
  loading = true;
  mergeOptions: any;
  echart: ECharts;
  pieChartOptions: EChartOption = {
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
    console.log($event);
  }

}
