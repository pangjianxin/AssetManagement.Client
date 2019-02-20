import { Directive, ElementRef, Input, AfterViewInit, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { UserRole } from 'src/app/models/user-role.enum';

@Directive({
  selector: '[appAuthorize]'
})
export class AuthorizeDirective implements OnInit, AfterViewInit {
  currentUserRole: UserRole;
  currentInputRole: UserRole;
  constructor(private element: ElementRef, private accountService: AccountService) {
  }
  @Input() set appAuthorize(role: UserRole) {
    this.currentInputRole = role;
  }
  ngOnInit() {
    this.accountService.currentOrg.subscribe(value => this.currentUserRole = UserRole[value.roleNam]);
  }
  ngAfterViewInit(): void {
    if (this.currentInputRole > this.currentUserRole) {
      this.element.nativeElement.disabled = true;
    }
  }
}
