import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetCategory } from 'src/app/models/asset-category';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetCategoryService } from 'src/app/core/services/asset-category.service';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck, map } from 'rxjs/operators';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { ChangeAssetCategoryMeterUnit } from 'src/app/models/viewmodels/change-asset-category-meter-unit';
import { AssetCategoryTableComponent } from '../asset-category-table/asset-category-table.component';
import { OrgSpaceService } from 'src/app/core/services/org-space.service';
import { OrgSpace } from 'src/app/models/org-space';
import { AssetService } from 'src/app/core/services/asset.service';
import { StoreAsset } from 'src/app/models/viewmodels/store-asset';
import { HttpErrorResponse } from '@angular/common/http';
import { MaintainerService } from 'src/app/core/services/maintainer.service';
import { AddMaintainer } from 'src/app/models/viewmodels/add-maintainer';
import { DeleteMaintainer } from 'src/app/models/viewmodels/delete-maintainer';
import { Maintainer } from 'src/app/models/maintainer';
export function tagNumberVliadator(control: AbstractControl): ValidationErrors {
  const value = control.value as string;
  if (value.length !== 15) {
    return { tagNumber: '标签号的长度必须为15位' };
  }
  return null;
}
export function tagNumberFormatValidator(control: FormGroup): ValidationErrors {
  const start = control.get('startTagNumber') as FormControl;
  const end = control.get('endTagNumber') as FormControl;
  const equal = (start.value as string).substr(0, 10) === (end.value as string).substr(0, 10);
  return equal ? null : { tagNumberFormat: '起始号与结束号的格式不符' };
}
@Component({
  selector: 'app-asset-category-admin',
  templateUrl: './asset-category-admin.component.html',
  styleUrls: ['./asset-category-admin.component.scss']
})
export class AssetCategoryAdminComponent implements OnInit {

  @ViewChild('assetCategorySearchInput', { static: true }) assetCategorySearchInput: ElementRef;
  @ViewChild('changeAssetCategoryMeteringUnit', { static: true }) changeAssetCategoryMeteringUnitRef: TemplateRef<any>;
  @ViewChild('appAssetCategoryTable', { static: true }) assetCategoryTable: AssetCategoryTableComponent;
  @ViewChild('assetStorageConfirmRef', { static: true }) assetStorageConfirmRef: TemplateRef<any>;
  @ViewChild('assetStorageRef', { static: true }) assetStorageRef: TemplateRef<any>;
  @ViewChild('addMaintainersRef', { static: true }) addMaintainersRef: TemplateRef<any>;
  @ViewChild('deleteMaintainerRef', { static: true }) deleteMaintainerRef: TemplateRef<any>;
  // 当前构建好的资产入库模型
  currentBuiltAssetStorageViewmodel: StoreAsset;
  // 当前日期
  currentDate = new Date();
  // 当前资产分类selection
  assetCategorySelection: SelectionModel<AssetCategory> = new SelectionModel<AssetCategory>(true, []);
  // 当前服务商selection
  maintainerSelection: SelectionModel<Maintainer> = new SelectionModel<Maintainer>(true, []);
  // 当前选中的资产分类
  currentSelectedCategory: AssetCategory;
  // 显示的资产分类的URL
  assetCategoryApiUrl: string;
  // 服务提供商url
  maintainersUrl: string;
  // 资产分类查询字符串
  assetCategoryFileterData: string;
  // 修改资产分类单位表单
  changeMeteringUnitForm: FormGroup;
  // 添加资产维修服务表单
  addMaintainerForm: FormGroup;
  // 资产入库表单
  assetStorageForm: FormGroup;
  // 从远程获取的所有资产分类的单位
  initMeteringUnits$: Observable<any[]>;
  // 从远程获取的相关机构的空间
  orgSpaces$: Observable<OrgSpace[]>;
  constructor(private dialog: MatDialog,
    private alert: AlertService,
    private fb: FormBuilder,
    private assetCategoryService: AssetCategoryService,
    private orgSpaceService: OrgSpaceService,
    private assetService: AssetService,
    private maintainerService: MaintainerService) { }
  ngOnInit() {
    fromEvent(this.assetCategorySearchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.assetCategoryFileterData = value);
    this.initMeteringUnits$ = this.assetCategoryService.getMeteringUnits().pipe(map(value => value.data));
    this.orgSpaces$ = this.orgSpaceService.getAllSpace().pipe(map(value => value.data));
    this.assetCategoryApiUrl = '/api/assetcategory/secondary/pagination';
    this.maintainersUrl = '/api/maintainer/secondary/pagination';
  }
  /* 判断是否资产分类只选中了一行 */
  isAssetCategoryOneSelected() {
    return this.assetCategorySelection.selected.length === 1;
  }
  /**判断是否服务商列表只选中了一行 */
  isMaintainerOneSelected() {
    return this.maintainerSelection.selected.length === 1;
  }
  openChangeAssetCategoryMeteringUnitDialog() {
    if (this.isAssetCategoryOneSelected()) {
      this.dialog.open(this.changeAssetCategoryMeteringUnitRef);
    } else {
      this.alert.warn('只能选中一个进行操作', '重新选择');
      return;
    }
    this.changeMeteringUnitForm = this.fb.group({
      assetMeteringUnit: ['', [Validators.required]],
      assetCategoryId: [this.assetCategorySelection.selected[0].assetCategoryId, [Validators.required]]
    });
  }
  /**
   * 接受资产分类表的选择事件
   * @param $event 传入的资产分类列表
   */
  onAssetCategorySelected($event: SelectionModel<AssetCategory>) {
    this.assetCategorySelection = $event;
  }
  /**
   * 处理服务商表的选择事件
   * @param $event  传入的服务商列表
   */
  onMaintainerSelected($event: SelectionModel<Maintainer>) {
    this.maintainerSelection = $event;
  }
  /**
   * 修改标量单位
   */
  changeMeteringUnit() {
    const model = this.changeMeteringUnitForm.value as ChangeAssetCategoryMeterUnit;
    console.log(model);
    this.assetCategoryService.changeMeteringUnit(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetCategoryTable.getAssetCategoryPagination();
      },
      error: ((e: HttpErrorResponse) => {
        this.alert.failure(e.error.message);
      })
    });
  }
  /**
   * 打开资产入库对话框
   */
  openAssetStorageConfirmDialog() {
    if (!this.isAssetCategoryOneSelected()) {
      this.alert.warn('只能选中一个进行操作', '重新选择');
      return;
    } else {
      this.currentSelectedCategory = this.assetCategorySelection.selected[0];
      this.assetStorageForm = this.fb.group({
        assetName: [null, [Validators.required]],
        brand: [null, [Validators.required]],
        assetDescription: [null, [Validators.required]],
        assetType: [null, [Validators.required]],
        assetLocation: [null, [Validators.required]],
        assetCategoryId: [this.currentSelectedCategory.assetCategoryId, [Validators.required]],
        createDateTime: [null, [Validators.required]],
        tagNumbers: this.fb.group({
          startTagNumber: ['', [Validators.required, tagNumberVliadator]],
          endTagNumber: ['', [Validators.required, tagNumberVliadator]],
        }, { validator: tagNumberFormatValidator }),
      });
      this.dialog.open(this.assetStorageConfirmRef);
    }

  }
  /**
   * 资产入库确认
   */
  storeAssetsConfirm() {
    const model: StoreAsset = {
      assetName: this.assetStorageForm.get('assetName').value,
      brand: this.assetStorageForm.get('brand').value,
      assetDescription: this.assetStorageForm.get('assetDescription').value,
      assetType: this.assetStorageForm.get('assetType').value,
      assetLocation: this.assetStorageForm.get('assetLocation').value,
      assetCategoryId: this.assetStorageForm.get('assetCategoryId').value,
      createDateTime: this.assetStorageForm.get('createDateTime').value,
      startTagNumber: this.assetStorageForm.get('tagNumbers').get('startTagNumber').value,
      endTagNumber: this.assetStorageForm.get('tagNumbers').get('endTagNumber').value,
      count() {
        return +this.endTagNumber.substr(10, 6) + 1 - (+this.startTagNumber.substr(10, 6));
      }
    };
    this.currentBuiltAssetStorageViewmodel = model;
    this.dialog.open(this.assetStorageRef);
  }
  /**
   * 资产入库
   */
  assetsStore() {
    this.assetService.assetStore(this.currentBuiltAssetStorageViewmodel).subscribe({
      next: (value: RequestActionModel) => this.alert.success(value.message),
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
  /**
   * 打开增加服务商的对话框
   */
  openAddMaintainersDialog() {
    if (!this.isAssetCategoryOneSelected()) {
      this.alert.warn('一次只能选中一个资产分类进行操作');
      return;
    }
    this.addMaintainerForm = this.fb.group({
      assetCategoryId: [this.assetCategorySelection.selected[0].assetCategoryId],
      companyName: ['', [Validators.required]],
      maintainerName: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      officePhone: ['']
    });
    this.dialog.open(this.addMaintainersRef);
  }
  /**
   * 添加服务商
   */
  addMaintainer() {
    const model: AddMaintainer = this.addMaintainerForm.value as AddMaintainer;
    this.maintainerService.addMaintainer(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alert.failure(error.error.message);
      }
    });
  }
  /**
   * 打开删除服务商的对话框
   */
  openDeleteMaintainerDialog() {
    if (!this.isMaintainerOneSelected()) {
      this.alert.warn('一次只能选中一项进行操作');
      return;
    }
    this.dialog.open(this.deleteMaintainerRef);
  }
  /**
   * 删除服务商
   */
  deleteMaintainer() {
    const model: DeleteMaintainer = {
      maintainerId: this.maintainerSelection.selected[0].id
    };
    this.maintainerService.deleteMaintainer(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.maintainerService.dataSourceChangeSubject.next(true);
      },
      error: (error: HttpErrorResponse) => this.alert.failure(error.error.message)
    });
  }
}
