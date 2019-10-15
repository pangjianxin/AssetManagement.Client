import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Organization } from 'src/app/models/dtos/organization';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material';
import { AccountService } from 'src/app/core/services/account.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { ChangeOrgShortNam } from 'src/app/models/viewmodels/change-org-short-nam';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { ResetOrgPassword } from 'src/app/models/viewmodels/reset-org-password';
import { RevokeOrganizationDialogComponent } from './revoke-organization-dialog/revoke-organization-dialog.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  tableUrl = `/api/auth/accounts/org2`;
  assetUrl = `/api/assets/current`;
  currentSelection = new SelectionModel<Organization>(true, []);
  searchInput: string;
  currentSelectedOrg: Organization;
  changeOrgShortNameForm: FormGroup;
  @ViewChild('changeOrgShortNameTemplate', { static: true }) changeOrgShortNameTemplate: TemplateRef<any>;
  @ViewChild('resetPasswordTemplate', { static: true }) resetPasswordTemplate: TemplateRef<any>;
  @ViewChild('orgTableFilterInput', { static: true }) orgTableFilterInput: ElementRef;
  constructor(private alert: AlertService,
    private dialog: MatDialog,
    private accountService: AccountService,
    private fb: FormBuilder) { }

  ngOnInit() {
    fromEvent(this.orgTableFilterInput.nativeElement, 'keyup').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((filter: string) => {
        this.searchInput = filter;
      });
  }
  isOneSelected() {
    return this.currentSelection.selected.length === 1;
  }
  onSelected($event: SelectionModel<Organization>) {
    this.currentSelection = $event;
  }
  /**打开修改机构简称对话框 */
  openChangeOrgShortNameDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('一次只能选中一项进行操作');
    } else {
      this.currentSelectedOrg = this.currentSelection.selected[0];
      this.changeOrgShortNameForm = this.fb.group({
        orgShortNam: [this.currentSelectedOrg.orgShortNam, [Validators.required]],
        orgIdentifier: [this.currentSelectedOrg.orgIdentifier, [Validators.required]]
      });
      this.dialog.open(this.changeOrgShortNameTemplate);
    }
  }
  /**修改机构简称 */
  changeOrgShortName() {
    const model: ChangeOrgShortNam = this.changeOrgShortNameForm.value as ChangeOrgShortNam;
    this.accountService.changeOrgShortName(model).subscribe({
      next: (value: RequestActionModel) => {
        this.alert.success(value.message);
        this.accountService.dataSourceChanged.next(true);
      },
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }

  /**打开机构撤销对话框 */
  openorgRevocationDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('一次只能选中一项进行操作');
    } else {
      this.currentSelectedOrg = this.currentSelection.selected[0];
      this.dialog.open(RevokeOrganizationDialogComponent, { width: '50%', data: { currentOrg: this.currentSelectedOrg } });
    }
  }
  /**打开重置密码对话框 */
  openResetPasswordDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('一次只能选中一项进行操作');
    } else {
      this.currentSelectedOrg = this.currentSelection.selected[0];
      this.dialog.open(this.resetPasswordTemplate);
    }
  }
  /**重置密码 */
  resetOrgPassword() {
    const model: ResetOrgPassword = { orgIdentifier: this.currentSelectedOrg.orgIdentifier };
    this.accountService.resetOrgPassword(model).subscribe({
      next: (value: RequestActionModel) => this.alert.success(value.message),
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
  /**修改机构角色 */
  modifyOrgRole() { }

}
