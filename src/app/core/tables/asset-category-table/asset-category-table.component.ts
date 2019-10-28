import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetCategory } from 'src/app/models/dtos/asset-category';
import { AssetCategoryService } from '../../services/asset-category.service';
import { debounceTime } from 'rxjs/operators';
import { TableBaseComponent } from '../table-base/table-base.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-category-table',
  templateUrl: './asset-category-table.component.html',
  styleUrls: ['./asset-category-table.component.scss']
})
export class AssetCategoryTableComponent extends TableBaseComponent<AssetCategory> implements OnInit, OnChanges {
  // 显示的列
  displayedColumns: string[] = ['select', 'assetThirdLevelCategory', 'assetSecondLevelCategory', 'assetFirstLevelCategory', 'assetMeteringUnit'];
  constructor(private assetCategoryService: AssetCategoryService) {
    super();
  }
  ngOnInit() {
    this.initTableParameters();
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getAssetCategoryPagination();
    });
    this.selection.changed.asObservable().pipe(debounceTime(10)).subscribe(value => {
      this.selected.emit(this.selection);
    });
    this.assetCategoryService.dataSourceChanged.subscribe(value => {
      if (value) {
        this.initPage();
      }
    });
    this.getAssetCategoryPagination();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['filter'].firstChange) {
      this.initPage();
    }
  }
  getAssetCategoryPagination() {
    const targetUrl = this.manipulateFinalUrl(this.url);
    this.assetCategoryService.getByUrl(targetUrl).subscribe(response => {
      this.totalCount = response['@odata.count'];
      this.dataSource.data = response.value;
      this.selection.clear();
    });
  }
}
