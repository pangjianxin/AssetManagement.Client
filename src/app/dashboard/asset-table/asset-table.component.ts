import { Component, OnInit, OnChanges, ViewChild, Input, SimpleChanges } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Asset } from 'src/app/models/asset';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-asset-table',
  templateUrl: './asset-table.component.html',
  styleUrls: ['./asset-table.component.scss']
})
export class AssetTableComponent implements OnInit, OnChanges {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() apiUrl: string;
  @Input() currentSelectedThirdLevel = '';
  @Input() currentSelectedStatus = '';
  assetDataSource: MatTableDataSource<Asset> = new MatTableDataSource<Asset>();
  // 总数
  totalCount: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['assetName', 'brand', 'assetType', 'assetDescription',
    'assetNo', 'assetStatus', 'lastModifyComment', 'storedOrgIdentifier', 'storedOrgName',
    'assetThirdLevelCategory', 'assetInStoreLocation'];
  constructor(private dashboardService: DashboardService) {
  }
  ngOnInit() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetPagination();
    });
    this.initTableParameters();
    this.initPage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentSelectedStatus && !changes.currentSelectedStatus.firstChange) {
      this.initPage();
    }
    if (changes.currentSelectedThirdLevel && !changes.currentSelectedThirdLevel.firstChange) {
      this.initPage();
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
    let targetUrl: string;
    if (this.apiUrl.indexOf('?') > -1) {
      targetUrl = `${this.apiUrl}&page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
    } else {
      targetUrl = `${this.apiUrl}?page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
    }
    if (this.currentSelectedThirdLevel) {
      targetUrl = `${targetUrl}&categoryId=${this.currentSelectedThirdLevel}`;
    }
    if (this.currentSelectedStatus) {
      targetUrl = `${targetUrl}&status=${this.currentSelectedStatus}`;
    }
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
    this.dashboardService.getAssetPagination(targetUrl).subscribe(response => {
      this.totalCount = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.assetDataSource.data = response.body.data;
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }

}
