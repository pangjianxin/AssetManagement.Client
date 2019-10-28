import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { AccountService } from './core/services/account.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from './core/services/alert.service';
import { Organization } from './models/dtos/organization';
import { map, filter, debounceTime } from 'rxjs/operators';
import { ActionResult } from './models/dtos/request-action-model';
import { ChangeOrgPassword } from './models/viewmodels/change-org-password';
import { ChangeOrgShortNam } from './models/viewmodels/change-org-short-nam';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { SignalRMessageService } from './core/services/signalR-message.service';
import { ChatComponent } from './home/chat/chat.component';
import { OrganizationService } from './core/services/organization.service';
import { TokenInfo } from './models/dtos/tokenInfo';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  orgUrl: string;
  currentOrg: TokenInfo;
  isAuthenticated: boolean;
  @ViewChild('currentOrgTemplate', { static: true }) currentOrgTemplate: TemplateRef<any>;
  @ViewChild('changeOrgShortNameTemplate', { static: true }) changeOrgShortNameTemplate: TemplateRef<any>;
  @ViewChild('changeOrgPasswordTemplate', { static: true }) changeOrgPasswordTemplate: TemplateRef<any>;
  @ViewChild('selectOrgToChatWithTemplate', { static: true }) selectOrgToChatWithTemplate: TemplateRef<any>;
  changeOrgShortNamForm: FormGroup;
  changePasswordForm: FormGroup;
  selectOrgToChatForm: FormGroup;
  targetOrgs$: Observable<Organization[]>;
  isLg: boolean;
  constructor(public accountService: AccountService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private observableMedia: MediaObserver,
    private alert: AlertService,
    public messageService: SignalRMessageService,
    private orgService: OrganizationService,
    private router: Router) { }
  ngOnInit() {
    this.orgUrl = environment.apiBaseUrls.odata.organization;
    this.observableMedia.media$.
      pipe(map(change => change.mqAlias === 'lg')).subscribe(value => this.isLg = value);
    this.selectOrgToChatForm = this.fb.group({
      targetOrg: ['', [Validators.required]]
    });
    this.selectOrgToChatForm.get('targetOrg').valueChanges.pipe(debounceTime(300)).subscribe(input => {
      this.targetOrgs$ = this.orgService
        .getByUrl(`${this.orgUrl}?$filter=contains(orgIdentifier,'${input}') or contains(orgNam,'${input}')`)
        .pipe(map(result => result.value));
    });
    this.accountService.isAuthenticated$.subscribe(value => {
      if (value) {
        this.isAuthenticated = value;
        this.currentOrg = this.accountService.currentOrg$.value;
      } else {
        this.isAuthenticated = !value;
        this.router.navigateByUrl('/login');
      }
    });
  }
  logout() {
    this.accountService.pureAuth();
    this.router.navigateByUrl('/login');
  }
  openCurrentOrgInfoDialog() {
    this.dialog.open(this.currentOrgTemplate);
  }
  /**打开修改机构简称对话框 */
  openChangeOrgShortNamDialog() {
    this.changeOrgShortNamForm = this.fb.group({
      orgIdentifier: [this.currentOrg.orgIdentifier, [Validators.required]],
      orgNam: [this.currentOrg.orgName, [Validators.required]],
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
    },
      (error: HttpErrorResponse) => {
        this.alert.failure(error.error.message);
      });
  }
  /**打开修改机构密码对话框 */
  openChangeOrgPasswordDialog() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      orgIdentifier: [this.currentOrg.orgIdentifier, [Validators.required]],
      orgNam: [this.currentOrg.orgName, [Validators.required]]
    });
    this.dialog.open(this.changeOrgPasswordTemplate);
  }
  /**修改机构密码 */
  changeOrgPassword() {
    const model: ChangeOrgPassword = this.changePasswordForm.value as ChangeOrgPassword;
    this.accountService.changeOrgPassword(model).subscribe({
      next: (value: ActionResult) => this.alert.success(value.message),
      error: (e: HttpErrorResponse) => { this.alert.failure(e.error.message); }
    });
  }
}
