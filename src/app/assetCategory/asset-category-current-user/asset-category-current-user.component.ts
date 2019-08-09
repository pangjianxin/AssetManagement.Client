import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetCategory } from 'src/app/models/asset-category';
import { Observable, fromEvent } from 'rxjs';
import { Organization } from 'src/app/models/organization';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AlertService } from 'src/app/core/services/alert.service';
import { ManagementLineService } from 'src/app/core/services/management-line.service';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { ApplyAsset } from 'src/app/models/viewmodels/apply-asset';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { AssetApplyingService } from 'src/app/core/services/asset-applying.service';

@Component({
  selector: 'app-asset-category-current-user',
  templateUrl: './asset-category-current-user.component.html',
  styleUrls: ['./asset-category-current-user.component.scss']
})
export class AssetCategoryCurrentUserComponent implements OnInit {

  @ViewChild('assetCategorySearchInput') assetCategorySearchInput: ElementRef;
  @ViewChild('applyAssetRef') applyAssetRef: TemplateRef<any>;
  selection: SelectionModel<AssetCategory> = new SelectionModel<AssetCategory>(true, []);
  assetCategoryApiUrl: string;
  assetCategoryFileterData: string;
  assetApplyExaminations$: Observable<Organization[]>;
  applyAssetForm: FormGroup;
  constructor(private dialog: MatDialog,
    private alert: AlertService,
    private fb: FormBuilder,
    private managementLineService: ManagementLineService,
    private assetApplyService: AssetApplyingService) { }
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
      this.assetApplyExaminations$ =
        this.managementLineService.getTargetExaminations(this.selection.selected[0].managementLineDto.managementLineId);
      this.applyAssetForm = this.fb.group({
        assetCategoryId: [this.selection.selected[0].assetCategoryId, [Validators.required]],
        thirdLevelCategory: [this.selection.selected[0].assetThirdLevelCategory],
        targetOrgId: [undefined, [Validators.required]],
        message: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]]
      });
      this.dialog.open(this.applyAssetRef);
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
