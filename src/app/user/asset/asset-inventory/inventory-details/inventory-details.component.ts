import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort, MatDialog } from '@angular/material';
import { AssetInventoryDetail } from 'src/app/models/dtos/asset-inventory-detail';
import { AssetService } from 'src/app/core/services/asset.service';
import { AssetInventoryService } from 'src/app/core/services/asset-inventory-service';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit, OnChanges {

  urlPath = '/api/assetStockTaking/current/assetstocktakingdetails?assetStockTakingOrgId=';
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() urlParameters: string;
  dataSource: MatTableDataSource<AssetInventoryDetail> = new MatTableDataSource<AssetInventoryDetail>();
  // 总数
  totalCounts: number;
  // 当前页模型
  currentPage: PageEvent;
  // 当前排序逻辑
  currentSort: Sort;
  // 显示的列
  displayedColumns: string[] = ['responsibilityIdentity', 'responsibilityName', 'responsibilityOrg2', 'assetInventoryLocation',
    'assetName', 'assetDescription', 'assetTagNumber', 'inventoryStatus'];
  constructor(private assetService: AssetService,
    private assetStockTakingService: AssetInventoryService,
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
