import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetCategory } from 'src/app/models/dtos/asset-category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { Organization } from 'src/app/models/dtos/organization';
import { MatDialog } from '@angular/material';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';
import { CategoryOrgRegistrationService } from 'src/app/core/services/category-org-registration.service';
import { debounceTime, distinctUntilChanged, pluck, map } from 'rxjs/operators';
import { ApplyAsset } from 'src/app/models/viewmodels/apply-asset';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';

@Component({
  selector: 'app-asset-category',
  templateUrl: './asset-category.component.html',
  styleUrls: ['./asset-category.component.scss']
})
export class AssetCategoryComponent implements OnInit {

  @ViewChild('assetCategorySearchInput', { static: true }) assetCategorySearchInput: ElementRef;
  @ViewChild('applyAssetRef', { static: true }) applyAssetRef: TemplateRef<any>;
  selection: SelectionModel<AssetCategory> = new SelectionModel<AssetCategory>(true, []);
  assetCategoryApiUrl: string;
  assetCategoryFileterData: string;
  applyAssetForm: FormGroup;
  examinationOrgs$: Observable<Organization[]>;
  constructor(private dialog: MatDialog,
    private alert: AlertService,
    private fb: FormBuilder,
    private assetApplyService: AssetApplyingService,
    private categoryOrgRegistrationService: CategoryOrgRegistrationService) { }
  ngOnInit() {
    fromEvent(this.assetCategorySearchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.assetCategoryFileterData = value);
    this.assetCategoryApiUrl = '/api/assetcategory/current/pagination';
  }
  /**判断是否直选中了一行 */
  get IsOneSelected() {
    return this.selection.selected.length === 1;
  }
  onSelected($event: SelectionModel<AssetCategory>) {
    this.selection = $event;
  }
  openApplyAssetsDialog() {
    if (!this.IsOneSelected) {
      this.alert.warn('只能选中一个进行操作');
    } else {
      this.examinationOrgs$ = this.categoryOrgRegistrationService.getExaminationOrgs(this.selection.selected[0].assetCategoryId)
        .pipe(map(it => it.data as Organization[]));
      this.applyAssetForm = this.fb.group({
        assetCategoryId: [this.selection.selected[0].assetCategoryId, [Validators.required]],
        thirdLevelCategory: [this.selection.selected[0].assetThirdLevelCategory],
        targetOrgId: [undefined, [Validators.required]],
        message: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]]
      });
      this.dialog.open(this.applyAssetRef, { minWidth: '50%' });
    }
  }
  applyAsset() {
    const viewModel: ApplyAsset = {
      assetCategoryId: this.applyAssetForm.get('assetCategoryId').value,
      targetOrgId: this.applyAssetForm.get('targetOrgId').value,
      message: this.applyAssetForm.get('message').value
    };
    this.assetApplyService.applyAsset(viewModel).subscribe({
      next: (value: RequestActionModel) => this.alert.success(value.message),
      error: (value: RequestActionModel) => this.alert.failure(value.message)
    });
  }

}
