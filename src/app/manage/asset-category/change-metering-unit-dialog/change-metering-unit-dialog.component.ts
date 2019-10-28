import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AssetCategory } from 'src/app/models/dtos/asset-category';
import { AssetCategoryService } from 'src/app/core/services/asset-category.service';
import { ChangeAssetCategoryMeterUnit } from 'src/app/models/viewmodels/change-asset-category-meter-unit';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-change-metering-unit-dialog',
  templateUrl: './change-metering-unit-dialog.component.html',
  styleUrls: ['./change-metering-unit-dialog.component.scss']
})
export class ChangeMeteringUnitDialogComponent implements OnInit {
  meteringUnits: { name: string, value: number }[];
  // 修改资产分类单位表单
  changeMeteringUnitForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    currentCategory: AssetCategory
  },
    private fb: FormBuilder,
    private assetCategoryService: AssetCategoryService,
    private alert: AlertService) {
  }

  ngOnInit() {
    this.meteringUnits = [
      { name: '个', value: 1 },
      { name: '件', value: 2 },
      { name: '块', value: 3 },
      { name: '台', value: 4 },
      { name: '套', value: 5 },
      { name: '项', value: 6 },
    ];
    this.changeMeteringUnitForm = this.fb.group({
      assetMeteringUnit: ['', [Validators.required]],
      assetCategoryId: [this.data.currentCategory.id, [Validators.required]]
    });
  }
  /**
   * 修改标量单位
   */
  changeMeteringUnit() {
    const model = this.changeMeteringUnitForm.value as ChangeAssetCategoryMeterUnit;
    this.assetCategoryService.changeMeteringUnit(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.assetCategoryService.dataSourceChanged.next(true);
      },
      error: ((e: HttpErrorResponse) => {
        this.alert.failure(e.error.message);
      })
    });
  }
}
