import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { Organization } from 'src/app/models/dtos/organization';
import { TokenInfo } from 'src/app/models/dtos/tokenInfo';
import { AssetInventory } from 'src/app/models/dtos/asset-inventory';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { AccountService } from 'src/app/core/services/account.service';
import { AssetInventoryService } from 'src/app/core/services/asset-inventory-service';
import { AlertService } from 'src/app/core/services/alert.service';
import { debounceTime, pluck, map, switchMap } from 'rxjs/operators';
import { CteateAssetInventory } from 'src/app/models/viewmodels/create-asset-inventory';
import { ActionResult } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-asset-inventory',
  templateUrl: './asset-inventory.component.html',
  styleUrls: ['./asset-inventory.component.scss']
})
export class AssetInventoryComponent implements OnInit {
  orgSearchUrl: string;
  inventoryUrl: string;
  inventoryRegisterUrl: string;
  // 资产盘点任务表单
  assetInventoryForm: FormGroup;
  // 资产盘点任务参与机构表单
  inventoryRegisterForm: FormGroup;
  // 这是一个使用read参数的例子，很好用这个
  // @ViewChild('button1', { read: MatButton, static: true }) buttons: MatButton;
  @ViewChild('organizationSearchInput', { static: true }) organizationSearchInput: ElementRef;
  @ViewChild('inventoryYear', { static: true }) inventoryYearInput: ElementRef;
  currentOrg: TokenInfo;
  inventoryHistories: AssetInventory[];
  // 机构查询结果$
  organizationSearchResult$: Observable<Organization[]>;
  any$: Observable<boolean>;
  currentSelectedYear: number;
  constructor(private organizationService: OrganizationService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private assetInventoryService: AssetInventoryService,
    private alert: AlertService) { }
  ngOnInit() {
    // 为当前年份赋予一个初始值
    this.currentSelectedYear = new Date().getFullYear();
    this.orgSearchUrl = environment.apiBaseUrls.odata.organization;
    this.inventoryUrl = environment.apiBaseUrls.odata.assetInventory_manage;
    this.inventoryRegisterUrl = environment.apiBaseUrls.odata.assetInventoryRegister_manage;
    // 例外机构input的事件绑定
    this.organizationSearchResult$ = fromEvent(this.organizationSearchInput.nativeElement, 'keyup')
      .pipe(debounceTime(300), pluck('target', 'value'), switchMap((filter: string) => {
        return this.organizationService.getByUrl(`${this.orgSearchUrl}?$filter=contains(orgName,'${filter}') or contains(orgIdentifier,'${filter}')`)
          .pipe(map(result => result.value));
      }));
    // 资产盘点年份input的事件绑定
    this.any$ = fromEvent(this.inventoryYearInput.nativeElement, 'keyup')
      .pipe(debounceTime(500), pluck('target', 'value'), switchMap((filter: number) => {
        this.currentSelectedYear = filter;
        return this.assetInventoryService.getByUrl(`${this.inventoryUrl}?$count=true&year=${this.currentSelectedYear}`)
          .pipe(map(result => {
            this.inventoryHistories = result.value;
            return + result['@odata.count'] > 0;
          }));
      }));
    // 对象当前机构与服务绑定
    this.currentOrg = this.accountService.currentOrg$.value;
    // 初始化创建资产盘点的表单
    this.assetInventoryForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      taskComment: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      expiryDateTime: ['', [Validators.required]]
    });
    // 初始化例外机构表单
    this.inventoryRegisterForm = this.fb.group({
      excludedOrgs: [[]]
    });
  }
  submitAssetInventory() {
    const model: CteateAssetInventory = {
      publisherId: this.currentOrg.orgId,
      taskName: this.assetInventoryForm.get('taskName').value,
      taskComment: this.assetInventoryForm.get('taskComment').value,
      expiryDateTime: this.assetInventoryForm.get('expiryDateTime').value,
      excludedOrganizations: this.inventoryRegisterForm.get('excludedOrgs').value.map(item => item.orgId)
    };
    this.assetInventoryService.createAssetInventory(model).subscribe({
      next: (result: ActionResult) => this.alert.success(result.message),
      error: (error: HttpErrorResponse) => this.alert.failure(error.error.message)
    });
  }
  onOrgSelected($event: MatAutocompleteSelectedEvent) {
    this.inventoryRegisterForm.get('excludedOrgs').value.push($event.option.value);
  }
  removeOrg(org: Organization) {
    const index = this.inventoryRegisterForm.get('excludedOrgs').value.indexOf(org);
    if (index >= 0) {
      this.inventoryRegisterForm.get('excludedOrgs').value.splice(index, 1);
    }
  }
  manipulateOdataFilter(input: string): string {
    if (input) {
      return `$filter=contains(assetName,'${input}') or contains(assetTagNumber,'${input}')`;
    }
  }
}
