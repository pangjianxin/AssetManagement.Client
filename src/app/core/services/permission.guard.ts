import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from './alert.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivateChild {
  constructor(private alert: AlertService, private account: AccountService) { }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const currnetRole = this.account.getCurrentOrg().role;
    const permissionRole = childRoute.data['role'];
    if (currnetRole >= permissionRole) {
      return true;
    }
    this.alert.warn('你没有权限进入该模块');
    return false;
  }

}
