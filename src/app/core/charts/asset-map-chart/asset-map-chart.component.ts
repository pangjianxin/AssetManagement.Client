import { Component, OnInit, Input } from '@angular/core';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-asset-map-chart',
  templateUrl: './asset-map-chart.component.html',
  styleUrls: ['./asset-map-chart.component.scss']
})
export class AssetMapChartComponent implements OnInit {
  @Input() mapData: [];
  @Input() mapUrl: string;
  mergeOptions: any;
  echart: echarts.ECharts;
  mapChartOptions: {};
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(this.mapUrl).subscribe(result => {
      echarts.registerMap('mapData', result);
      this.mapChartOptions = {
        title: {
          text: '资产情况概要',
          subtext: '设备数量汇总',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>资产数量:{c}'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: [{
          min: 0,
          max: 200,
          text: ['高', '低'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        }],
        series: [
          {
            //  与注册时的名字保持统一如：echarts.registerMap('China', geoJson);
            mapType: 'mapData',
            name: '资产数量',
            type: 'map',
            roam: true,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: { label: { show: true } },
              emphasis: { label: { show: true } }
            },
            data: this.mapData
          }
        ]
      };
    });
  }
  onChartInit($event: echarts.ECharts) {
    this.echart = $event;
  }
  onChartClick($event) {
    console.log($event);
  }

}
