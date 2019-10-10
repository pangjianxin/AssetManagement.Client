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
    const currnetRole = this.account.getCurrentOrg().orgRole;
    console.log(`currentrole:${currnetRole}`);
    const permissionRole = childRoute.data['role'];
    console.log(`permissionRole:${permissionRole}`);
    if (currnetRole >= permissionRole) {
      return true;
    }
    this.alert.warn('你没有权限进入该模块');
    return false;
  }

}
