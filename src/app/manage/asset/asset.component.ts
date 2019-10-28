import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Asset } from 'src/app/models/dtos/asset';
import { AssetService } from 'src/app/core/services/asset.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { environment } from 'src/environments/environment';
import { ChartData } from 'src/app/models/dtos/chart-data';
@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {

  // 当前ApiUrl
  assetUrl: string;
  assetSumarryByCategoryUrl: string;
  assetSumarryByCountUrl: string;
  selection: SelectionModel<Asset> = new SelectionModel<Asset>(true, []);
  @ViewChild('assetSearchInput', { static: true, read: ElementRef }) searchInputElement: ElementRef;
  // 当前过滤逻辑
  searchInput: string;
  // 按资产状态分类汇总数据
  sumarryByCountDataset: Array<ChartData>;
  constructor(private assetService: AssetService,
    private alert: AlertService) {
  }
  ngOnInit() {
    this.searchInput = '';
    this.assetUrl = `${environment.apiBaseUrls.odata.asset_manage}?$expand=assetCategoryDto`;
    this.assetSumarryByCategoryUrl = environment.apiBaseUrls.odata.asset_sumarry_manage_byCategory;
    this.assetSumarryByCountUrl = environment.apiBaseUrls.odata.asset_sumarry_manage_byCount;
    fromEvent(this.searchInputElement.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((filter: string) => {
        this.searchInput = this.manipulateOdataFilter(filter);
      });
    this.getAssetCategpries();
  }
  getAssetCategpries() {
    this.assetService.getByUrl(this.assetSumarryByCountUrl).subscribe({
      next: (result: any) => {
        this.sumarryByCountDataset = result as Array<ChartData>;
      },
      error: (e: ActionResult) => {
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
  manipulateOdataFilter(input: string): string {
    if (input) {
      return `$filter=contains(assetName,'${input}') or contains(assetTagNumber,'${input}')`;
    } return '';
  }
}
