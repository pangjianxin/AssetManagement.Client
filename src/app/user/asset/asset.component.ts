import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Asset } from 'src/app/models/dtos/asset';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrgSpace } from 'src/app/models/dtos/org-space';
import { AssetService } from 'src/app/core/services/asset.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material';
import { OrgSpaceService } from 'src/app/core/services/org-space.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { ExchangeAssetDialogComponent } from './exchange-asset-dialog/exchange-asset-dialog.component';
import { ReturnAssetDialogComponent } from './return-asset-dialog/return-asset-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { ModifyAssetLocation } from 'src/app/models/viewmodels/modify-asset-location';
import { MaintainerDetailDialogComponent } from './maintainer-detail-dialog/maintainer-detail-dialog.component';
import { environment } from 'src/environments/environment';
import { ChartData } from 'src/app/models/dtos/chart-data';
import { ChangeAssetLocationComponent } from './change-asset-location/change-asset-location.component';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
  // 当前ApiUrl
  assetTableUrl: string;
  assetSumarryByCategoryUrl: string;
  selection: SelectionModel<Asset> = new SelectionModel<Asset>(true, []);
  @ViewChild('assetSearchInput', { static: true }) searchInputElement: ElementRef;
  // 当前过滤逻辑
  filter = '';
  /**资产按照三级分类的图表数据 */
  thirdLevelDataSet: Array<ChartData>;
  constructor(private assetService: AssetService,
    private alert: AlertService,
    private dialog: MatDialog) {
    this.assetTableUrl = `${environment.apiBaseUrls.odata.asset_current}?$expand=assetCategoryDto`;
    this.assetSumarryByCategoryUrl = environment.apiBaseUrls.odata.asset_sumarry_current_byCategory;
  }
  ngOnInit() {
    fromEvent(this.searchInputElement.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((filter: string) => {
        this.filter = this.manipulateOdataFilter(filter);
        this.assetService.dataSourceChangedSubject.next(true);
      });
    this.getAssetSumarry();
  }
  /**判断是否选中唯一一项 */
  get isOneSelected() {
    return this.selection.selected.length === 1;
  }
  /**响应资产表选择事件 */
  onSelected($event: SelectionModel<Asset>) {
    this.selection = $event;
  }
  /**
   * 获取图表类的数据
   */
  getAssetSumarry() {
    this.assetService.getByUrl(this.assetSumarryByCategoryUrl).subscribe({
      next: (result: any) => {
        this.thirdLevelDataSet = result as ChartData[];
      },
      error: (e: HttpErrorResponse) => {
        this.alert.failure(`${e.statusText}`);
      }
    });
  }
  /**维护资产位置api--打开对话框 */
  openModifyAssetLocationDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('必须只能选中一项', '重新选择');
    } else {
      this.dialog.open(ChangeAssetLocationComponent, { data: { asset: this.selection.selected[0] } });
    }
  }
  /**资产交回相关api--打开对话框 */
  openAssetReturnDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一项进行操作');
    } else if (this.selection.selected[0].assetStatus === '在途') {
      this.alert.warn('资产状态为在途，无法交回，请核对后重新提交');
    }
    this.dialog.open(ReturnAssetDialogComponent, {
      data: {
        asset: this.selection.selected[0]
      },
      minWidth: '50%'
    });
  }

  /**资产机构间调配--打开对话框 */
  openExchangeAssetDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一项进行操作');
    } else {
      this.dialog.open(ExchangeAssetDialogComponent, {
        data: {
          asset: this.selection.selected[0]
        },
        minWidth: '50%'
      });
    }
  }
  openApplyMaintainingDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一项进行操作');
    } else {
      this.dialog.open(MaintainerDetailDialogComponent, {
        data: {
          asset: this.selection.selected[0]
        },
        minWidth: '50%'
      });
    }
  }
  manipulateOdataFilter(input: string): string {
    if (input) {
      return `$filter=contains(assetName,'${input}')`;
    } return '';
  }
}
