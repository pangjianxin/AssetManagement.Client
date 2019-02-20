import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetCategory } from 'src/app/models/asset-category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetCategoryService } from 'src/app/core/services/asset-category.service';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck, map } from 'rxjs/operators';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { ChangeAssetCategoryMeterUnitViewmodel } from 'src/app/models/viewmodels/change-asset-category-meter-unit-viewmodel';
import { AssetCategoryTableComponent } from '../asset-category-table/asset-category-table.component';

@Component({
  selector: 'app-asset-category-admin',
  templateUrl: './asset-category-admin.component.html',
  styleUrls: ['./asset-category-admin.component.scss']
})
export class AssetCategoryAdminComponent implements OnInit {

  @ViewChild('assetCategorySearchInput') assetCategorySearchInput: ElementRef;
  @ViewChild('changeAssetCategoryMeteringUnit') changeAssetCategoryMeteringUnitRef: TemplateRef<any>;
  @ViewChild('appAssetCategoryTable') assetCategoryTable: AssetCategoryTableComponent;
  @ViewChild('assetStorageRef') assetStorageRef: TemplateRef<any>;
  selection: SelectionModel<AssetCategory> = new SelectionModel<AssetCategory>(true, []);
  currentSelectedCategory: AssetCategory;
  assetCategoryApiUrl = '/api/assetcategory/secondaryadmin/pagination';
  assetCategoryFileterData: string;
  changeMeteringUnitForm: FormGroup;
  assetStorageForm: FormGroup;
  initMeteringUnits$: Observable<any[]>;
  constructor(private dialog: MatDialog,
    private alert: AlertService,
    private fb: FormBuilder,
    private assetCategoryService: AssetCategoryService) { }
  ngOnInit() {
    fromEvent(this.assetCategorySearchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.assetCategoryFileterData = value);
    this.initMeteringUnits$ = this.assetCategoryService.getMeteringUnits().pipe(map(value => value.data));
  }
  /**判断是否直选中了一行 */
  isOneSelected() {
    return this.selection.selected.length === 1;
  }
  openChangeAssetCategoryMeteringUnitDialog() {
    if (this.isOneSelected()) {
      this.dialog.open(this.changeAssetCategoryMeteringUnitRef);
    } else {
      this.alert.warn('只能选中一个进行操作', '重新选择');
      return;
    }
    this.changeMeteringUnitForm = this.fb.group({
      assetMeteringUnit: ['', [Validators.required]],
      assetCategoryId: [this.selection.selected[0].assetCategoryId, [Validators.required]]
    });
  }
  onSelected($event: SelectionModel<AssetCategory>) {
    this.selection = $event;
    console.log(this.selection);
  }
  changeMeteringUnit() {
    const model = this.changeMeteringUnitForm.value as ChangeAssetCategoryMeterUnitViewmodel;
    this.assetCategoryService.changeMeteringUnit(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.assetCategoryTable.getAssetCategoryPagination();
      },
      error: ((e: RequestActionModel) => {
        this.alert.failure(e.message);
      })
    });
  }
  openAssetStorageDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('只能选中一个进行操作', '重新选择');
      return;
    } else {
      this.currentSelectedCategory = this.selection.selected[0];
      this.assetStorageForm = this.fb.group({
        assetName: ['', [Validators.required]],
        brand: ['', [Validators.required]],
        assetDescription: ['', [Validators.required]],
        assetType: ['', [Validators.required]],
        assetInStoreLocation: ['', [Validators.required]],
        count: [0, [Validators.required]]
      });
      this.dialog.open(this.assetStorageRef);
    }

  }
  storeAssets() {
    this.alert.warn('not implement');
  }

}
