import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { Organization } from 'src/app/models/dtos/organization';
import { MAT_DIALOG_DATA } from '@angular/material';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { AssetExchangingService } from 'src/app/core/services/asset-exchanging-service';
import { AlertService } from 'src/app/core/services/alert.service';
import { debounceTime, map } from 'rxjs/operators';
import { ExchangeAsset } from 'src/app/models/viewmodels/exchange-asset';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AssetService } from 'src/app/core/services/asset.service';
export function forbiddenString(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (typeof control.value === 'string') {
      return { 'forbiddenString': 'value not allowed string' };
    }
    return null;
  };
}
@Component({
  selector: 'app-exchange-asset-dialog',
  templateUrl: './exchange-asset-dialog.component.html',
  styleUrls: ['./exchange-asset-dialog.component.scss']
})
export class ExchangeAssetDialogComponent implements OnInit {
  orgUrl: string;
  assetExchangeForm: FormGroup;
  exchangeOrgs$: Observable<Organization[]>;
  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orgService: OrganizationService,
    private assetExchangeService: AssetExchangingService,
    private alert: AlertService,
    private assetService: AssetService) {
    this.orgUrl = environment.apiBaseUrls.odata.organization;
  }

  ngOnInit() {
    this.assetExchangeForm = this.fb.group({
      exchangeOrg: [null, [Validators.required, forbiddenString()]],
      targetOrgId: [this.data.asset.organizationInChargeId, [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      assetId: [this.data.asset.id, Validators.required],
      assetName: [this.data.asset.assetName, [Validators.required]]
    });
    this.assetExchangeForm.get('exchangeOrg').valueChanges.pipe(debounceTime(300)).subscribe((input: string) => {
      if (input && input.length < 2) {
        return;
      }
      this.exchangeOrgs$ = this.orgService.getByUrl(`${this.orgUrl}?$filter=contains(orgIdentifier,'${input}') or contains(orgNam,'${input}')`)
        .pipe(map(it => it.value));
    });
  }
  displayExchangeOrg(org: Organization) {
    if (org) {
      return `${org.orgNam}`;
    } else {
      return ``;
    }
  }
  exchangeAsset() {
    const model: ExchangeAsset = {
      exchangeOrgId: this.assetExchangeForm.get('exchangeOrg').value.id,
      targetOrgId: this.assetExchangeForm.get('targetOrgId').value,
      assetId: this.data.asset.id,
      message: this.assetExchangeForm.get('message').value
    };
    this.assetExchangeService.exchangeAsset(model).subscribe({
      next: (value: ActionResult) => {
        this.alert.success(value.message);
        this.assetService.dataSourceChangedSubject.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }

}
