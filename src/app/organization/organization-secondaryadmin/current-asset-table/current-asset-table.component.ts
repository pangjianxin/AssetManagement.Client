import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Asset } from 'src/app/models/dtos/asset';
import { AssetService } from 'src/app/core/services/asset.service';

@Component({
  selector: 'app-current-asset-table',
  templateUrl: './current-asset-table.component.html',
  styleUrls: ['./current-asset-table.component.scss']
})
/**
 * 该类主要用来展示机构撤并时相应机构下面的资产
 */
export class CurrentAssetTableComponent implements OnInit, OnChanges {
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @Input() orgInUseId: string;
  assetDataSource: MatTableDataSource<Asset> = new MatTableDataSource<Asset>();
  // 总数
  totalCount: number;
  // 当前页模型
  currentPage: PageEvent;
  // 显示的列
  displayedColumns: string[] = ['assetName', 'brand', 'assetNo', 'orgInUseIdentifier',
    'assetThirdLevelCategory', 'assetLocation'];
  constructor(
    private assetService: AssetService) {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['orgInUseId'].firstChange) {
      this.getAssetPagination();
    }
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetPagination();
    });
    this.getAssetPagination();
  }
  // 初始化表格
  private initTableParameters() {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 5,
      length: null
    };
  }
  private getAssetPagination() {
    let targetUrl = `/api/assets/secondary/orgInUse?page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
    if (this.orgInUseId) {
      targetUrl = `${targetUrl}&orgInUseId=${this.orgInUseId}`;
    }
    this.assetService.getAssetsPagination(targetUrl).subscribe(response => {
      this.totalCount = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.assetDataSource.data = response.body.data;
    });
  }


}
