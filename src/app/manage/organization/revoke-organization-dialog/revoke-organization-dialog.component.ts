import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Organization } from 'src/app/models/dtos/organization';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-revoke-organization-dialog',
  templateUrl: './revoke-organization-dialog.component.html',
  styleUrls: ['./revoke-organization-dialog.component.scss']
})
export class RevokeOrganizationDialogComponent implements OnInit {
  revokeOrgForm: FormGroup;
  recycleOrgAssetsForm: FormGroup;
  assetUrl: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { currentOrg: Organization },
    private fb: FormBuilder,
    private alert: AlertService) { }

  ngOnInit() {
    this.assetUrl = `${environment.apiBaseUrls.odata.asset_manage}?$filter=organizationInUseId eq ${this.data.currentOrg.id}&$expand=assetCategoryDto`;
    this.revokeOrgForm = this.fb.group({
      // 确认机构撤销的复选框
      status: [false, [Validators.requiredTrue]]
    });
    this.recycleOrgAssetsForm = this.fb.group({
      // 确认机构名下资产的复选框
      status: [false, [Validators.requiredTrue]]
    });
  }
  /**机构撤销 */
  orgRevoke() {
    this.alert.warn('not implement');
  }
}
