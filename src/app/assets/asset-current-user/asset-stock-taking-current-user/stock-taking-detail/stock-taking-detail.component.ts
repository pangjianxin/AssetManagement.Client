import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AssetService } from 'src/app/core/services/asset.service';
import { AssetStockTakingDetail } from 'src/app/models/dtos/asset-stock-taking-detail';
import { AssetStockTakingService } from 'src/app/core/services/asset-stock-taking.service';

@Component({
  selector: 'app-stock-taking-detail',
  templateUrl: './stock-taking-detail.component.html',
  styleUrls: ['./stock-taking-detail.component.scss']
})
export class StockTakingDetailComponent implements OnInit, OnChanges {
  urlPath = '/api/assetStockTaking/current/assetstocktakingdetails?assetStockTakingOrgId=';
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() urlParameters: string;
  dataSource: MatTableDataSource<AssetStockTakingDetail> = new MatTableDataSource<AssetStockTakingDetail>();
  // 总数
  totalCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['responsibilityIdentity', 'responsibilityName', 'responsibilityOrg2', 'assetStockTakingLocation',
    'assetName', 'assetDescription', 'assetTagNumber'];
  constructor(private assetService: AssetService,
    private assetStockTakingService: AssetStockTakingService,
    private dialog: MatDialog) {
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetPagination();
    });
    this.assetStockTakingService.dataSourceChangedSubject.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.initPage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urlParameters'] && changes['urlParameters'].firstChange) {
      this.urlPath = `${this.urlPath}${this.urlParameters}`;
    }
  }
  // 初始化表格
  private initTableParameters() {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 10,
      length: null
    },
      this.currentSort = {
        active: '',
        direction: ''
      };
  }
  // 排序事件处理handler
  changeSort(sortEvent: Sort) {
    this.currentSort = sortEvent;
    this.initPage();
  }
  private getAssetPagination() {
    // 基础URL
    let targetUrl = `${this.urlPath}&page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
    // 排序功能
    if (this.currentSort.direction) {
      switch (this.currentSort.direction) {
        case 'asc': targetUrl = `${targetUrl}&sorts=${this.currentSort.active}`;
          break;
        case 'desc': targetUrl = `${targetUrl}&sorts=-${this.currentSort.active}`;
          break;
        default:
          break;
      }
    }
    // 最终的URL执行分页功能
    this.assetService.getAssetsPagination(targetUrl).subscribe(response => {
      this.totalCounts = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.dataSource.data = response.body.data;
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }

}
