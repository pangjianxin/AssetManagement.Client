import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { Asset } from 'src/app/models/dtos/asset';
import { AssetService } from 'src/app/core/services/asset.service';

@Component({
  selector: 'app-selected-org-asset-table',
  templateUrl: './selected-org-asset-table.component.html',
  styleUrls: ['./selected-org-asset-table.component.scss']
})
export class SelectedOrgAssetTableComponent implements OnInit {

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
