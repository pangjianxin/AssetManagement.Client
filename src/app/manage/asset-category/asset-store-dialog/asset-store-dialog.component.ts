import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { StoreAsset } from 'src/app/models/viewmodels/store-asset';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AssetCategory } from 'src/app/models/dtos/asset-category';
import { AssetService } from 'src/app/core/services/asset.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';
import { OrgSpace } from 'src/app/models/dtos/org-space';
import { Observable } from 'rxjs';
import { OrgSpaceService } from 'src/app/core/services/org-space.service';
import { map } from 'rxjs/operators';
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
  selector: 'app-asset-store-dialog',
  templateUrl: './asset-store-dialog.component.html',
  styleUrls: ['./asset-store-dialog.component.scss']
})
export class AssetStoreDialogComponent implements OnInit {
  // 机构空间url
  orgSpaceUrl: string;
  currentDate: Date;
  candidateOrgSpaces$: Observable<OrgSpace[]>;
  hasSubmitAssetStored: boolean;
  @ViewChild('assetStoreConfirmRef', { static: true }) assetStoreConfirmRef: TemplateRef<any>;
  // 资产入库表单
  assetStorageForm: FormGroup;
  // 当前构建好的资产入库模型
  currentBuiltAssetStorageViewmodel: StoreAsset;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { currentSelectedCategory: AssetCategory },
    private dialog: MatDialog,
    private assetService: AssetService,
    private alert: AlertService,
    private fb: FormBuilder,
    private orgSpaceService: OrgSpaceService) { }

  ngOnInit() {
    this.currentDate = new Date();
    this.hasSubmitAssetStored = false;
    this.orgSpaceUrl = environment.apiBaseUrls.odata.orgSpace;
    this.candidateOrgSpaces$ = this.orgSpaceService.getByUrl(this.orgSpaceUrl).pipe(map(result => result.value));
    this.assetStorageForm = this.fb.group({
      assetName: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      assetDescription: [null, [Validators.required]],
      assetType: [null, [Validators.required]],
      assetLocation: [null, [Validators.required]],
      assetCategoryId: [this.data.currentSelectedCategory.id, [Validators.required]],
      createDateTime: [null, [Validators.required]],
      tagNumbers: this.fb.group({
        startTagNumber: ['', [Validators.required, tagNumberVliadator]],
        endTagNumber: ['', [Validators.required, tagNumberVliadator]],
      }, { validator: tagNumberFormatValidator }),
    });
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
    this.dialog.open(this.assetStoreConfirmRef);
    this.hasSubmitAssetStored = false;
  }
  /**
   * 资产入库
   */
  assetsStore() {
    this.assetService.assetStore(this.currentBuiltAssetStorageViewmodel).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.hasSubmitAssetStored = true;
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
}
