import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Asset } from 'src/app/models/asset';
import { AssetService } from 'src/app/core/services/asset.service';
import { debounceTime } from 'rxjs/operators';
import { AssetStockTakingDialogComponent } from '../asset-stock-taking-dialog/asset-stock-taking-dialog.component';
import { AssetStockTaking } from 'src/app/models/asset-stock-taking';
import { AssetStockTakingOrg } from 'src/app/models/asset-stock-taking-org';

@Component({
  selector: 'app-assets-with-out-stock-taking',
  templateUrl: './assets-with-out-stock-taking.component.html',
  styleUrls: ['./assets-with-out-stock-taking.component.scss']
})
export class AssetsWithOutStockTakingComponent implements OnInit, OnChanges {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() currentAssetStockTakingOrg: AssetStockTakingOrg;
  // 当前过滤值,由父组件传入的值确定
  @Input() currentFileterData: string;
  @Input() urlParameters: string;
  @Output() selected = new EventEmitter<SelectionModel<Asset>>();
  apiUrl: string;
  baseUrl = '/api/assetStockTaking/current/assetswithoutstocktaking?assetStockTakingOrgId=';
  assetDataSource: MatTableDataSource<Asset> = new MatTableDataSource<Asset>();
  // 总数
  totalAssetsCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['assetTagNumber', 'assetName', 'assetThirdLevelCategory', 'assetStatus',
    'orgIdentifier', 'orgNam', 'assetLocation', 'assetOperations'];
  /** Based on the screen size, switch from standard to one column per row */
  constructor(private assetService: AssetService,
    private dialog: MatDialog) {
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetPagination();
    });
    this.initPage();
    this.assetService.dataSourceChangedSubject.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    console.log(`asset-with-out-stock-taking:${this.currentAssetStockTakingOrg.taskName}-${this.currentAssetStockTakingOrg.id}`);

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urlParameters'] && changes['urlParameters'].firstChange) {
      this.apiUrl = `${this.baseUrl}${this.urlParameters}`;
    }
    if (!(changes['currentFileterData'] && changes['currentFileterData'].firstChange)) {
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
    // 基础URL
    let targetUrl = `${this.apiUrl}&page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
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
    // 过滤功能
    if (this.currentFileterData) {
      targetUrl = `${targetUrl}&filters=StockTakingOrgFilter==${this.currentFileterData}`;
    }
    // 最终的URL执行分页功能
    this.assetService.getAssetsPagination(targetUrl).subscribe(response => {
      this.totalAssetsCounts = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.assetDataSource.data = response.body.data;
    });
  }
  initPage() {
    this.paginator.pageIndex = 0;
    this.paginator.page.emit({ pageIndex: 0, pageSize: 10, length: null });
  }
  openAssetStockTakingDialog(item: Asset) {
    this.dialog.open(AssetStockTakingDialogComponent, { data: { asset: item, assetStockTakingOrg: this.currentAssetStockTakingOrg } });
  }
}
