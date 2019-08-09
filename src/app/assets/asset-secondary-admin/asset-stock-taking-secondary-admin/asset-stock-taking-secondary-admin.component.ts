import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { Organization } from 'src/app/models/organization';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { AccountService } from 'src/app/core/services/account.service';
import { AssetStockTakingService } from 'src/app/core/services/asset-stock-taking.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { debounceTime, distinctUntilChanged, pluck, map } from 'rxjs/operators';
import { CreateAssetStockTaking } from 'src/app/models/viewmodels/create-asset-stock-taking';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { AssetStockTaking } from 'src/app/models/asset-stock-taking';

@Component({
  selector: 'app-asset-stock-taking-secondary-admin',
  templateUrl: './asset-stock-taking-secondary-admin.component.html',
  styleUrls: ['./asset-stock-taking-secondary-admin.component.scss']
})
export class AssetStockTakingSecondaryAdminComponent implements OnInit {

  // 资产盘点任务表单
  assetStockTakingForm: FormGroup;
  // 资产盘点任务参与机构表单
  assetStockTakingOrganizationForm: FormGroup;
  // 机构查询结果$
  organizationSearchResult$: Observable<Organization[]>;
  @ViewChild('organizationSearchInput') organizationSearchInput: ElementRef;
  @ViewChild('stockTakingYear') stockTakingYearInput: ElementRef;
  currentOrg$: Observable<Organization>;
  stockTakingHistories$: Observable<AssetStockTaking[]>;
  any$: Observable<boolean>;
  currentSelectedYear: number;
  constructor(private organizationService: OrganizationService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private assetStockTakingService: AssetStockTakingService,
    private alert: AlertService) { }

  ngOnInit() {
    // 为当前年份赋予一个初始值
    this.currentSelectedYear = new Date().getFullYear();
    // 例外机构input的事件绑定
    fromEvent(this.organizationSearchInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => this.organizationSearchResult$ =
        this.organizationService.getOrgsBySearchInput(value).pipe(map(result => result.data)));
    // 资产盘点年份input的事件绑定
    fromEvent(this.stockTakingYearInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: number) => {
        this.currentSelectedYear = value;
        this.any$ = this.assetStockTakingService.anyStockTaking(value).pipe(map(result => result.data));
      });
    // 对象当前机构与服务绑定
    this.currentOrg$ = this.accountService.currentOrg;
    // 初始化创建资产盘点的表单
    this.assetStockTakingForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      taskComment: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      expiryDateTime: ['', [Validators.required]]
    });
    // 初始化例外机构表单
    this.assetStockTakingOrganizationForm = this.fb.group({
      excludedOrgs: [[]]
    });
    // 从服务端获取是否在相应年份有过任务的状态值
    this.any$ = this.assetStockTakingService.anyStockTaking(this.currentSelectedYear).pipe(map(it => it.data));
    // (如果有)从服务端获取相应年份的资产盘点任务清单
    this.stockTakingHistories$ = this.assetStockTakingService.secondaryList(this.currentSelectedYear).pipe(map(it => it.data));

  }
  submitAssetStockTaking() {
    let publisherIdTemp: string;
    this.currentOrg$.subscribe(value => {
      publisherIdTemp = value.orgId;
      const model: CreateAssetStockTaking = {
        publisherId: publisherIdTemp,
        taskName: this.assetStockTakingForm.get('taskName').value,
        taskComment: this.assetStockTakingForm.get('taskComment').value,
        expiryDateTime: this.assetStockTakingForm.get('expiryDateTime').value,
        excludedOrganizations: this.assetStockTakingOrganizationForm.get('excludedOrgs').value.map(item => item.orgId)
      };
      this.assetStockTakingService.createAssetStockTaking(model).subscribe({
        next: (result: RequestActionModel) => this.alert.success(result.message),
        error: (error: HttpErrorResponse) => this.alert.failure(error.error.message)
      });
    });
  }
  onOrgSelected($event: MatAutocompleteSelectedEvent) {
    this.assetStockTakingOrganizationForm.get('excludedOrgs').value.push($event.option.value);
  }
  removeOrg(org: Organization) {
    const index = this.assetStockTakingOrganizationForm.get('excludedOrgs').value.indexOf(org);
    if (index >= 0) {
      this.assetStockTakingOrganizationForm.get('excludedOrgs').value.splice(index, 1);
    }
  }
}
