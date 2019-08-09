import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AccountService } from './core/services/account.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AlertService } from './core/services/alert.service';
import { Organization } from './models/organization';
import { map, filter } from 'rxjs/operators';
import { RequestActionModel } from './models/request-action-model';
import { ChangeOrgPassword } from './models/viewmodels/change-org-password';
import { ChangeOrgShortNam } from './models/viewmodels/change-org-short-nam';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { SignalREventMessageService } from './core/services/signal-revent-message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  currentOrg: Organization;
  @ViewChild('currentOrgTemplate') currentOrgTemplate: TemplateRef<any>;
  @ViewChild('changeOrgShortNameTemplate') changeOrgShortNameTemplate: TemplateRef<any>;
  @ViewChild('changeOrgPasswordTemplate') changeOrgPasswordTemplate: TemplateRef<any>;
  changeOrgShortNamForm: FormGroup;
  changePasswordForm: FormGroup;
  isLg: boolean;
  constructor(private orgService: AccountService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private observableMedia: ObservableMedia,
    private alert: AlertService,
    public messageService: SignalREventMessageService) { }
  ngOnInit() {
    this.orgService.populate();
    this.isAuthenticated$ = this.orgService.isAuthenticated;
    this.orgService.currentOrg.pipe(filter(item => item.role !== undefined)).subscribe(value => {
      this.currentOrg = value;
    });
    this.observableMedia.asObservable().pipe(map(change => change.mqAlias === 'lg')).subscribe(value => this.isLg = value);
  }
  logout() {
    this.orgService.logout();
  }
  openCurrentOrgInfoDialog() {
    this.dialog.open(this.currentOrgTemplate);
  }
  /**修改机构简称 */
  openChangeOrgShortNamDialog() {
    this.changeOrgShortNamForm = this.fb.group({
      orgIdentifier: [this.currentOrg.orgIdentifier, [Validators.required]],
      orgNam: [this.currentOrg.orgNam, [Validators.required]],
      orgShortNam: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(2)]]
    });
    this.dialog.closeAll();
    this.dialog.open(this.changeOrgShortNameTemplate);
  }
  /**修改机构简称 */
  changeOrgShortName() {
    const model: ChangeOrgShortNam = this.changeOrgShortNamForm.value as ChangeOrgShortNam;
    this.accountService.changeOrgShortName(model).subscribe(value => {
      this.alert.success(value.message);
    }, (error: RequestActionModel) => {
      this.alert.failure(error.message);
    });
  }
  /**修改机构密码 */
  openChangeOrgPasswordDialog() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      orgIdentifier: [this.currentOrg.orgIdentifier, [Validators.required]],
      orgNam: [this.currentOrg.orgNam, [Validators.required]]
    });
    this.dialog.open(this.changeOrgPasswordTemplate);
  }
  /**修改机构段名称 */
  changeOrgPassword() {
    const model: ChangeOrgPassword = this.changePasswordForm.value as ChangeOrgPassword;
    this.accountService.changeOrgPassword(model).subscribe({
      next: (value: RequestActionModel) => this.alert.success(value.message),
      error: (e: RequestActionModel) => this.alert.failure(e.message)
    });
  }
}
