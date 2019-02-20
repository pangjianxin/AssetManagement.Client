import { Directive, TemplateRef, ViewContainerRef, OnInit, Input, AfterViewInit } from '@angular/core';
import { UserRole } from 'src/app/models/user-role.enum';
import { AccountService } from '../services/account.service';
import { filter, map } from 'rxjs/operators';
import { Organization } from 'src/app/models/organization';
import { Observable } from 'rxjs';

@Directive({
  selector: '[appAuthorizeShow]'
})
export class AuthorizeShowDirective implements OnInit {
  currentUserRole: Observable<UserRole>;
  currentInputRoleCondition: UserRole;
  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private accountService: AccountService) {
  }
  ngOnInit(): void {
    this.currentUserRole = this.accountService.currentOrg.pipe(map(value => UserRole[value.roleNam]));
    this.currentUserRole.subscribe(value => {
      if (value && value >= this.currentInputRoleCondition) {
        if (this.viewContainer.length === 0) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      } else {
        this.viewContainer.clear();
      }
    });
  }
  @Input() set appAuthorizeShow(roleCondition: UserRole) {
    this.currentInputRoleCondition = roleCondition;
  }
}
