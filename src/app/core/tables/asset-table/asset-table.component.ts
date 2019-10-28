import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Asset } from 'src/app/models/dtos/asset';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetService } from 'src/app/core/services/asset.service';
import { debounceTime } from 'rxjs/operators';
import { AssetOtherInfoComponent } from '../asset-other-info/asset-other-info.component';
import { TableBaseComponent } from '../table-base/table-base.component';
@Component({
  selector: 'app-asset-table',
  templateUrl: './asset-table.component.html',
  styleUrls: ['./asset-table.component.scss']
})
export class AssetTableComponent extends TableBaseComponent<Asset> implements OnInit, OnChanges {
  // 显示的列
  displayedColumns: string[] = ['select', 'assetTagNumber', 'assetName', 'assetThirdLevelCategory', 'assetStatus',
    'orgInUseName', 'orgInUseIdentifier', 'assetLocation', 'assetOperations'];
  constructor(private assetService: AssetService,
    private dialog: MatDialog) {
    super();
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(change => {
      this.selected.emit(this.selection);
    });
    this.assetService.dataSourceChangedSubject.asObservable().subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.getAssetPagination();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['filter'].firstChange) {
      this.initPage();
    }
  }
  private getAssetPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    // 最终的URL执行分页功能
    this.assetService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }
  openAssetOthterInfoDialog(row: Asset) {
    this.dialog.open(AssetOtherInfoComponent, { data: row });
    this.selection.clear();
    this.selection.select(row);
  }
}
