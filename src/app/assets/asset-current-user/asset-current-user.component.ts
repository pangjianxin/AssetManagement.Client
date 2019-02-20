import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { Asset } from 'src/app/models/asset';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetService } from 'src/app/core/services/asset.service';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrgSpace } from 'src/app/models/org-space';
import { OrgSpaceService } from 'src/app/core/services/org-space.service';
import { ModifyAssetLocationViewmodel } from 'src/app/models/viewmodels/modify-asset-location-viewmodel';
import { Organization } from 'src/app/models/organization';
import { ManagementLineService } from 'src/app/core/services/management-line.service';
import { ReturnAssetViewmodel } from 'src/app/models/viewmodels/return-asset-viewmodel';
import { HttpErrorResponse } from '@angular/common/http';
import { AssetExchangeComponent } from '../asset-exchange/asset-exchange.component';
import { AssetReturningService } from 'src/app/core/services/asset-returning.service';

@Component({
  selector: 'app-asset-current-user',
  templateUrl: './asset-current-user.component.html',
  styleUrls: ['./asset-current-user.component.scss']
})
export class AssetCurrentUserComponent implements OnInit {

  // 当前ApiUrl
  apiUrl = `/api/assets/current`;
  // 当前选择的记录行
  public currentGrid: { cols: number, rows: number };
  selection: SelectionModel<Asset> = new SelectionModel<Asset>(true, []);
  @ViewChild('assetSearchInput') searchInputElement: ElementRef;
  @ViewChild('changeAssetLocationRef') changeAssetLocationRef: TemplateRef<any>;
  @ViewChild('returnAssetRef') returnAssetRef: TemplateRef<any>;
  @ViewChild('exchangeAssetRef') exchangeAssetRef: TemplateRef<any>;
  // 当前过滤逻辑
  searchInput = '';
  /**资产按照三级分类的图表数据 */
  thirdLevelDataSet: Array<{ name: string, value: number }>;
  /**资产按照管理机构分类的图表数据 */
  managerOrgDataSet: Array<{ name: string, value: number }>;
  /**修改资产摆放位置的表单 */
  modifyAssetLocationForm: FormGroup;
  /**资产交回表单 */
  returnAssetForm: FormGroup;
  /**机构空间数据，用于维护资产摆放位置 */
  orgSpaces: OrgSpace[];
  /**目标管理机构，用户资产交回 */
  targetManagementOrg$: Observable<Organization[]>;
  constructor(private assetService: AssetService,
    private assetRreturnService: AssetReturningService,
    private alert: AlertService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private spaceService: OrgSpaceService,
    private managementLineService: ManagementLineService) {
  }
  ngOnInit() {
    fromEvent(this.searchInputElement.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((filter: string) => {
        this.searchInput = filter;
      });
    this.getAssetCategpries();
  }
  /**
   * 获取图表类的数据
   */
  getAssetCategpries() {
    this.assetService.getAssetsCategories(`/api/assets/current/categories/thirdLevel`).subscribe({
      next: (value: RequestActionModel) => {
        this.thirdLevelDataSet = value.data;
      },
      error: (e: RequestActionModel) => {
        this.alert.failure(e.message);
      }
    });
    this.assetService.getAssetsCategories('/api/assets/current/categories/managerOrg').subscribe({
      next: (value: RequestActionModel) => {
        this.managerOrgDataSet = value.data;
      },
      error: (e: RequestActionModel) => {
        this.alert.failure(e.message);
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
        assetInStoreLocation: ['', [Validators.required]]
      });
      this.spaceService.getAllSpace().subscribe({
        next: (value: RequestActionModel) => {
          this.orgSpaces = value.data;
          this.dialog.open(this.changeAssetLocationRef);
        },
        error: (e: RequestActionModel) => this.alert.failure(e.message),
      });
    }
  }
  /**维护资产位置api */
  modifyAssetLocation() {
    const model = this.modifyAssetLocationForm.value as ModifyAssetLocationViewmodel;
    this.assetService.modifyAsseteLocation(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
      },
      error: (e: RequestActionModel) => this.alert.failure(e.message)
    });
  }
  /**判断是否选中唯一一项 */
  get isOneSelected() {
    return this.selection.selected.length === 1;
  }
  onSelected($event: SelectionModel<Asset>) {
    this.selection = $event;
  }
  /**资产交回相关api--打开对话框 */
  openAssetReturnDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('只能选中一项进行操作');
    } else {
      this.targetManagementOrg$ = this.managementLineService.
        getTargetExaminations(this.selection.selected[0].assetCategoryDto.managementLineDto.managementLineId);
      this.returnAssetForm = this.fb.group({
        assetId: [this.selection.selected[0].assetId, [Validators.required]],
        assetName: [this.selection.selected[0].assetName, [Validators.required]],
        targetOrgId: ['', [Validators.required]],
        message: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]]
      });
      this.dialog.open(this.returnAssetRef);
    }
  }
  /**资产交回相关api */
  returnAsset() {
    const model: ReturnAssetViewmodel = {
      assetId: this.returnAssetForm.get('assetId').value,
      targetOrgId: this.returnAssetForm.get('targetOrgId').value,
      message: this.returnAssetForm.get('message').value
    };
    this.assetRreturnService.returnAsset(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => {
        console.log(value);
        this.alert.failure(value.error.message);
      }
    });
  }

  openExchangeAssetDialog() {
    if (!this.isOneSelected) {
      this.alert.warn('一次只能选中一项进行操作');
    } else {
      const exchangeAssetDialog = this.dialog.open(AssetExchangeComponent, {
        data: {
          title: '资产机构间调配',
          subtitle: '资产的机构间调换，请核对资产信息，选择审核机构和调配机构',
          asset: this.selection.selected[0]
        }
      });
      exchangeAssetDialog.afterClosed().subscribe(value => {
        this.assetService.dataSourceChangedSubject.next(true);
      });
    }
  }

}
