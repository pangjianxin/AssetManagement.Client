import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/core/services/account.service';
import { UserRole } from 'src/app/models/user-role.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUserRole: UserRole;
  constructor(private router: Router, private accountService: AccountService) { }
  ngOnInit() {
    this.accountService.currentOrg.pipe(filter(value => value.roleNam !== undefined))
      .subscribe(value => {
        this.currentUserRole = UserRole[value.roleNam];
      });
  }
}
