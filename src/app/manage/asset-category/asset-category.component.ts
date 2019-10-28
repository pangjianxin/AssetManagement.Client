import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetCategory } from 'src/app/models/dtos/asset-category';
import { MatDialog } from '@angular/material';
import { AlertService } from 'src/app/core/services/alert.service';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ChangeMeteringUnitDialogComponent } from './change-metering-unit-dialog/change-metering-unit-dialog.component';
import { AssetStoreDialogComponent } from './asset-store-dialog/asset-store-dialog.component';
import { AddMaintainerDialogComponent } from './add-maintainer-dialog/add-maintainer-dialog.component';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-asset-category',
  templateUrl: './asset-category.component.html',
  styleUrls: ['./asset-category.component.scss']
})
export class AssetCategoryComponent implements OnInit {

  @ViewChild('assetCategorySearchInput', { static: true }) assetCategorySearchInput: ElementRef;
  @ViewChild('addMaintainersRef', { static: true }) addMaintainersRef: TemplateRef<any>;
  // 当前日期
  currentDate = new Date();
  // 当前资产分类selection
  assetCategorySelection: SelectionModel<AssetCategory> = new SelectionModel<AssetCategory>(true, []);
  // 显示的资产分类的URL
  assetCategoryUrl: string;
  // 资产分类查询字符串
  assetCategoryFileterData: string;
  constructor(private dialog: MatDialog,
    private alert: AlertService, ) {
    this.assetCategoryUrl = environment.apiBaseUrls.odata.assetCategory_manage;

  }
  ngOnInit() {
    fromEvent(this.assetCategorySearchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.assetCategoryFileterData = this.manipulateOdataFilter(value));
  }
  /**判断是否资产分类只选中了一行 */
  isOneSelected() {
    return this.assetCategorySelection.selected.length === 1;
  }
  /** 接受资产分类表的选择事件
  * @param $event 传入的资产分类列表*/
  onSelected($event: SelectionModel<AssetCategory>) {
    this.assetCategorySelection = $event;
  }
  /**打开修改计量单位的对话框 */
  openChangeAssetCategoryMeteringUnitDialog() {
    if (this.isOneSelected()) {
      this.dialog.open(ChangeMeteringUnitDialogComponent,
        { data: { currentCategory: this.assetCategorySelection.selected[0] } });
    } else {
      this.alert.warn('只能选中一个进行操作', '重新选择');
    }
  }
  /**打开资产入库对话框*/
  openAssetStorageConfirmDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('只能选中一个进行操作', '重新选择');
      return;
    } else {
      this.dialog.open(AssetStoreDialogComponent,
        { data: { currentSelectedCategory: this.assetCategorySelection.selected[0] } });
    }
  }

  /**打开增加服务商的对话框*/
  openAddMaintainersDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('一次只能选中一个资产分类进行操作');
      return;
    }
    this.dialog.open(AddMaintainerDialogComponent, { data: { currentCategory: this.assetCategorySelection.selected[0] } });
  }
  manipulateOdataFilter(input: string): string {
    if (input) {
      return `$filter=contains(assetThirdLevelCategory,'${input}')`;
    }
  }
}
