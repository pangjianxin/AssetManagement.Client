import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Asset } from 'src/app/models/dtos/asset';
import { OrgSpaceService } from 'src/app/core/services/org-space.service';
import { AssetService } from 'src/app/core/services/asset.service';
import { ModifyAssetLocation } from 'src/app/models/viewmodels/modify-asset-location';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/core/services/alert.service';
import { OrgSpace } from 'src/app/models/dtos/org-space';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-change-asset-location',
  templateUrl: './change-asset-location.component.html',
  styleUrls: ['./change-asset-location.component.scss']
})
export class ChangeAssetLocationComponent implements OnInit {
  candidateOrgSpaceUrl = environment.apiBaseUrls.odata.orgSpace;
  /**修改资产摆放位置的表单 */
  modifyAssetLocationForm: FormGroup;
  /**机构空间数据，用于维护资产摆放位置 */
  orgSpaces$: Observable<OrgSpace[]>;
  constructor(@Inject(MAT_DIALOG_DATA) private data: { asset: Asset }, private fb: FormBuilder,
    private orgSpaceService: OrgSpaceService,
    private assetService: AssetService,
    private alert: AlertService) { }

  ngOnInit() {
    this.modifyAssetLocationForm = this.fb.group({
      assetId: [this.data.asset.id, [Validators.required]],
      assetLocation: ['', [Validators.required]]
    });
    this.orgSpaces$ = this.orgSpaceService.getByUrl(this.candidateOrgSpaceUrl).pipe(map(it => {
      return it.value as OrgSpace[];
    }));
  }
  /**维护资产位置api */
  modifyAssetLocation() {
    const model = this.modifyAssetLocationForm.value as ModifyAssetLocation;
    this.assetService.modifyAssetLocation(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
      },
      error: (e: HttpErrorResponse) => this.alert.failure(e.error.message)
    });
  }

}
