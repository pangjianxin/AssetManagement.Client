import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Asset } from 'src/app/models/dtos/asset';
import { AssetService } from 'src/app/core/services/asset.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';

@Component({
  selector: 'app-asset-secondary-admin',
  templateUrl: './asset-secondary-admin.component.html',
  styleUrls: ['./asset-secondary-admin.component.scss']
})
export class AssetSecondaryAdminComponent implements OnInit {

  // 当前ApiUrl
  apiUrl = `/api/assets/secondary/pagination`;
  selection: SelectionModel<Asset> = new SelectionModel<Asset>(true, []);
  @ViewChild('assetSearchInput', { static: true }) searchInputElement: ElementRef;
  // 当前过滤逻辑
  searchInput = '';
  // 按资产三级分类资产汇总数据
  categoriesByThirdLevelDataset: Array<{ name: string, value: number }>;
  // 按资产状态分类汇总数据
  categoriesByStatusDataset: Array<{ name: string, value: number }>;
  constructor(private assetService: AssetService,
    private alert: AlertService) {
  }
  ngOnInit() {
    fromEvent(this.searchInputElement.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((filter: string) => {
        this.searchInput = filter;
      });
    this.getAssetCategpries();
  }
  getAssetCategpries() {
    this.assetService.getAssetsCategories(`/api/assets/secondary/categories/thirdLevel`).subscribe({
      next: (value: RequestActionModel) => {
        this.categoriesByThirdLevelDataset = value.data;
      },
      error: (e: RequestActionModel) => {
        this.alert.failure(e.message);
      }
    });
    this.assetService.getAssetsCategories('/api/assets/secondary/categories/status').subscribe({
      next: (value: RequestActionModel) => {
        this.categoriesByStatusDataset = value.data;
      },
      error: (e: RequestActionModel) => {
        this.alert.failure(e.message);
      }
    });
  }
  get IsOneSelected() {
    return this.selection.selected.length === 1;
  }
  onSelected($event: SelectionModel<Asset>) {
    this.selection = $event;
  }
  openModifyAssetInfomationsDialog() {
    if (this.IsOneSelected) {
      this.alert.warn('只能选中一行进行操作');
    } else {
      // 初始化form表单
    }
  }
}
