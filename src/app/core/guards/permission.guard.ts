import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivateChild {
  constructor(private alert: AlertService, private account: AccountService) { }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const currnetRole = this.account.getCurrentOrg().orgRole;
    const permissionRole = childRoute.data['role'];
    if (currnetRole >= permissionRole) {
      return true;
    }
    this.alert.warn('你没有权限进入该模块');
    return false;
  }

}
