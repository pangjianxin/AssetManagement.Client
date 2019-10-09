import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { Asset } from 'src/app/models/dtos/asset';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetService } from 'src/app/core/services/asset.service';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrgSpace } from 'src/app/models/dtos/org-space';
import { OrgSpaceService } from 'src/app/core/services/org-space.service';
import { ModifyAssetLocation } from 'src/app/models/viewmodels/modify-asset-location';
import { Organization } from 'src/app/models/dtos/organization';
import { ReturnAsset } from 'src/app/models/viewmodels/return-asset';
import { HttpErrorResponse } from '@angular/common/http';
import { AssetExchangeDialogComponent } from './asset-exchange-dialog/asset-exchange-dialog.component';
import { AssetReturningService } from 'src/app/core/services/asset-returning.service';
import { AssetMaintainsDialogComponent } from './asset-maintains-dialog/asset-maintains-dialog.component';
import { AssetReturnDialogComponent } from './asset-return-dialog/asset-return-dialog.component';

@Component({
  selector: 'app-asset-current-user',
  templateUrl: './asset-current-user.component.html',
  styleUrls: ['./asset-current-user.component.scss']
})
export class AssetCurrentUserComponent implements OnInit {
  // 当前ApiUrl
  apiUrl: string;
  selection: SelectionModel<Asset> = new SelectionModel<Asset>(true, []);
  @ViewChild('assetSearchInput', { static: true }) searchInputElement: ElementRef;
  @ViewChild('changeAssetLocationRef', { static: true }) changeAssetLocationRef: TemplateRef<any>;
  // 当前过滤逻辑
  searchInput = '';
  /**资产按照三级分类的图表数据 */
  thirdLevelDataSet: Array<{ name: string, value: number }>;
  /**资产按照管理机构分类的图表数据 */
  managerOrgDataSet: Array<{ name: string, value: number }>;
  /**修改资产摆放位置的表单 */
  modifyAssetLocationForm: FormGroup;
  /**机构空间数据，用于维护资产摆放位置 */
  orgSpaces: OrgSpace[];
  constructor(private assetService: AssetService,
    private alert: AlertService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private spaceService: OrgSpaceService) {
  }
  ngOnInit() {
    this.apiUrl = `/api/assets/current`;
    fromEvent(this.searchInputElement.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((filter: string) => {
        console.log(filter);
        this.searchInput = filter;
      });
    this.getAssetCategpries();
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
  getAssetCategpries() {
    this.assetService.getAssetsCategories(`/api/assets/current/categories/thirdLevel`).subscribe({
      next: (value: RequestActionModel) => {
        this.thirdLevelDataSet = value.data;
      },
      error: (e: HttpErrorResponse) => {
        this.alert.failure(`${e.statusText}`);
      }
    });
    this.assetService.getAssetsCategories('/api/assets/current/categories/managerOrg').subscribe({
      next: (value: RequestActionModel) => {
        this.managerOrgDataSet = value.data;
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
      this.modifyAssetLocationForm = this.fb.group({
        assetId: [this.selection.selected[0].assetId, [Validators.required]],
        assetLocation: ['', [Validators.required]]
      });
      this.spaceService.getAllSpace().subscribe({
        next: (value: RequestActionModel) => {
          this.orgSpaces = value.data;
          this.dialog.open(this.changeAssetLocationRef, { minWidth: '50%' });
        },
        error: (e: RequestActionModel) => this.alert.failure(e.message),
      });
    }
  }
  /**维护资产位置api */
  modifyAssetLocation() {
    const model = this.modifyAssetLocationForm.value as ModifyAssetLocation;
    this.assetService.modifyAssetLocation(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
      },
      error: (e: HttpErrorResponse) => this.alert.failure(e.error.message)
    });
  }

  /**资产交回相关api--打开对话框 */
  openAssetReturnDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一项进行操作');
    } else if (this.selection.selected[0].assetStatus === '在途') {
      this.alert.warn('资产状态为在途，无法交回，请核对后重新提交');
    }
    this.dialog.open(AssetReturnDialogComponent, {
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
      this.dialog.open(AssetExchangeDialogComponent, {
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
      this.dialog.open(AssetMaintainsDialogComponent, {
        data: {
          asset: this.selection.selected[0]
        },
        minWidth: '50%'
      });
    }
  }
}
