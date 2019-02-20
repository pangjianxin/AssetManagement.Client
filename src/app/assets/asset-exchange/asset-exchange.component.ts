import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Organization } from 'src/app/models/organization';
import { Observable } from 'rxjs';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { debounceTime, map } from 'rxjs/operators';
import { ManagementLineService } from 'src/app/core/services/management-line.service';
import { AssetExchangeViewmodel } from 'src/app/models/viewmodels/asset-exchange-viewmodel';
import { AssetService } from 'src/app/core/services/asset.service';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { AlertService } from 'src/app/core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AssetExchangingService } from 'src/app/core/services/asset-exchanging-service';
export function forbiddenString(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (typeof control.value === 'string') {
      return { 'forbiddenString': 'value not allowed string' };
    }
    return null;
  };
}
@Component({
  selector: 'app-asset-exchange',
  templateUrl: './asset-exchange.component.html',
  styleUrls: ['./asset-exchange.component.scss']
})
export class AssetExchangeComponent implements OnInit {
  assetExchangeForm: FormGroup;
  exchangeOrgs$: Observable<Organization[]>;
  targetOrgs$: Observable<Organization[]>;
  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orgService: OrganizationService,
    private managementLineService: ManagementLineService,
    private assetService: AssetService,
    private assetExchangeService: AssetExchangingService,
    private alert: AlertService) { }

  ngOnInit() {
    this.assetExchangeForm = this.fb.group({
      exchangeOrg: [null, [Validators.required, forbiddenString()]],
      targetOrgId: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      assetId: [this.data.asset.assetId, Validators.required],
      assetName: [this.data.asset.assetName, [Validators.required]]
    });
    this.assetExchangeForm.get('exchangeOrg').valueChanges.pipe(debounceTime(300)).subscribe(input => {
      this.exchangeOrgs$ = this.orgService.getOrgsBySeachInput(input).pipe(map(value => value.data));
    });
    this.targetOrgs$ =
      this.managementLineService.getTargetExaminations(this.data.asset.assetCategoryDto.managementLineDto.managementLineId);
  }
  displayExchangeOrg(org: Organization) {
    if (org) {
      return `${org.orgNam}`;
    } else {
      return ``;
    }
  }
  exchangeAsset() {
    const model: AssetExchangeViewmodel = {
      exchangeOrgId: this.assetExchangeForm.get('exchangeOrg').value.orgId,
      targetOrgId: this.assetExchangeForm.get('targetOrgId').value,
      assetId: this.data.asset.assetId,
      message: this.assetExchangeForm.get('message').value
    };
    this.assetExchangeService.exchangeAsset(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
}
