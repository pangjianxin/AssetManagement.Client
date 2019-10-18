import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetApplyingEvent } from 'src/app/models/dtos/asset-applying-event';
import { AssetApplyingService } from '../../services/asset-applying.service';
import { debounceTime, filter } from 'rxjs/operators';
import { TableBaseComponent } from '../table-base/table-base.component';


@Component({
  selector: 'app-asset-apply-table',
  templateUrl: './asset-apply-table.component.html',
  styleUrls: ['./asset-apply-table.component.scss']
})
export class AssetApplyTableComponent extends TableBaseComponent<AssetApplyingEvent> implements OnInit, OnChanges {
  // 显示的列
  displayedColumns: string[] = ['select', 'dateTimeFromNow', 'status',
    'requestOrgIdentifier', 'requestOrgNam', 'org2', 'targetOrgIdentifier',
    'targetOrgNam', 'message', 'assetCategoryThirdLevel'];
  constructor(private assetApplyingService: AssetApplyingService) {
    super();
  }
  ngOnInit() {
    // 初始化当前页面的
    this.initTableParameters();
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetApplyingPagination();
    });
    this.initPage();
    this.assetApplyingService.dataSourceChangedSubject.asObservable().pipe(filter(value => value === true)).subscribe(value => {
      this.initPage();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['currentFileterData'].firstChange) {
      this.initPage();
    }
    this.apiUrl = changes['apiUrl'].currentValue;
  }

  getAssetApplyingPagination() {
    let targetUrl = `${this.apiUrl}?page=${this.currentPage.pageIndex}&pageSize=${this.currentPage.pageSize}`;
    targetUrl = this.applyFilter(targetUrl);
    targetUrl = this.applySort(targetUrl);
    this.assetApplyingService.getPagination(targetUrl).subscribe(response => {
      this.totalCount = JSON.parse(response.headers.get('X-Pagination')).TotalItemsCount;
      this.tableDataSource.data = response.body.data;
      this.selection.clear();
    });
  }
}
