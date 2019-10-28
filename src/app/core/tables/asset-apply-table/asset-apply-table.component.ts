import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetApply } from 'src/app/models/dtos/asset-apply';
import { AssetApplyingService } from '../../services/asset-applying.service';
import { debounceTime, filter } from 'rxjs/operators';
import { TableBaseComponent } from '../table-base/table-base.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-asset-apply-table',
  templateUrl: './asset-apply-table.component.html',
  styleUrls: ['./asset-apply-table.component.scss']
})
export class AssetApplyTableComponent extends TableBaseComponent<AssetApply> implements OnInit, OnChanges {
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
    this.assetApplyingService.dataSourceChangedSubject.subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.getAssetApplyingPagination();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['filter'].firstChange) {
      this.initPage();
    }
  }
  getAssetApplyingPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    this.assetApplyingService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }
}
