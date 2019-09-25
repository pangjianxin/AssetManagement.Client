import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Organization } from 'src/app/models/dtos/organization';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'src/app/core/services/account.service';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';
import { ResetOrgPassword } from 'src/app/models/viewmodels/reset-org-password';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeOrgShortNam } from 'src/app/models/viewmodels/change-org-short-nam';

@Component({
  selector: 'app-organization-secondaryadmin',
  templateUrl: './organization-secondaryadmin.component.html',
  styleUrls: ['./organization-secondaryadmin.component.scss']
})
export class OrganizationSecondaryadminComponent implements OnInit {
  tableUrl = `/api/auth/accounts/org2`;
  assetUrl = `/api/assets/current`;
  currentSelection = new SelectionModel<Organization>(true, []);
  searchInput: string;
  currentSelectedOrg: Organization;
  changeOrgShortNameForm: FormGroup;
  revokeOrgForm: FormGroup;
  recycleOrgAssetsForm: FormGroup;
  @ViewChild('changeOrgShortNameTemplate', { static: true }) changeOrgShortNameTemplate: TemplateRef<any>;
  @ViewChild('resetPasswordTemplate', { static: true }) resetPasswordTemplate: TemplateRef<any>;
  @ViewChild('orgTableFilterInput', { static: true }) orgTableFilterInput: ElementRef;
  @ViewChild('orgRevocationRef', { static: true }) orgRevocationRef: TemplateRef<any>;
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
  modifyOrgRole() { }
  openResetPasswordDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('一次只能选中一项进行操作');
    } else {
      this.currentSelectedOrg = this.currentSelection.selected[0];
      this.dialog.open(this.resetPasswordTemplate);
    }
  }
  openorgRevocationDialog() {
    if (!this.isOneSelected()) {
      this.alert.warn('一次只能选中一项进行操作');
    } else {
      this.currentSelectedOrg = this.currentSelection.selected[0];
      this.revokeOrgForm = this.fb.group({
        status: [false, [Validators.requiredTrue]]
      });
      this.recycleOrgAssetsForm = this.fb.group({
        orgIdentifier: [this.currentSelectedOrg.orgIdentifier, [Validators.required]]
      });
      this.dialog.open(this.orgRevocationRef);
    }
  }
  resetOrgPassword() {
    const model: ResetOrgPassword = { orgIdentifier: this.currentSelectedOrg.orgIdentifier };
    this.accountService.resetOrgPassword(model).subscribe({
      next: (value: RequestActionModel) => this.alert.success(value.message),
      error: (value: HttpErrorResponse) => this.alert.failure(value.error.message)
    });
  }
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
  orgRevoke() {
    this.alert.warn('not implement');
  }
}
