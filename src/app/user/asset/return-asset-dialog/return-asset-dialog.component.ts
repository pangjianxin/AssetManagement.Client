import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Asset } from 'src/app/models/dtos/asset';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetReturningService } from 'src/app/core/services/asset-returning.service';
import { AssetService } from 'src/app/core/services/asset.service';
import { ReturnAsset } from 'src/app/models/viewmodels/return-asset';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-return-asset-dialog',
  templateUrl: './return-asset-dialog.component.html',
  styleUrls: ['./return-asset-dialog.component.scss']
})
export class ReturnAssetDialogComponent implements OnInit {

  returnAssetForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { asset: Asset },
    private alert: AlertService, private fb: FormBuilder, private dialog: MatDialog,
    private assetReturnService: AssetReturningService,
    private assetService: AssetService) { }

  ngOnInit() {
    this.returnAssetForm = this.fb.group({
      assetId: [this.data.asset.id, [Validators.required]],
      assetName: [this.data.asset.assetName, [Validators.required]],
      targetOrgId: [this.data.asset.organizationInChargeId, [Validators.required]],
      message: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(15)]]
    });
  }

  /**资产交回相关api */
  returnAsset() {
    const model: ReturnAsset = {
      assetId: this.returnAssetForm.get('assetId').value,
      targetOrgId: this.returnAssetForm.get('targetOrgId').value,
      message: this.returnAssetForm.get('message').value
    };
    this.assetReturnService.returnAsset(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => {
        this.alert.failure(value.error.message);
      }
    });
  }
}
