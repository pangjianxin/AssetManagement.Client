import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import { map } from 'rxjs/operators';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private accountService: AccountService, private alert: AlertService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.accountService.isAuthenticated.pipe(map(value => {
      if (!value) {
        this.alert.warn('你还没有登录，请先登录');
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      }
      return value;
    }));

  }
}

