import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenInfo } from 'src/app/models/dtos/tokenInfo';
import { Router } from '@angular/router';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { ChangeOrgShortNam } from 'src/app/models/viewmodels/change-org-short-nam';
import { ResetOrgPassword } from 'src/app/models/viewmodels/reset-org-password';
import { ChangeOrgPassword } from 'src/app/models/viewmodels/change-org-password';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  /* ①BehaviorSubject保存最新的值或者初始值
   * ②ReplaySubject的构造函数传入一个数字表示它所能记住的发射的元素数，它本身不管subscribe调用的时机，总会发射出所有的元素
  */
  public currentOrg$ = new BehaviorSubject<TokenInfo>(null);
  /**判断用户是否登录认证 */
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);
  /**作为一种数据发生变化的通知手段，其他service或者component会订阅这个subject用来做出相应的反应 */
  public dataSourceChanged = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.populate();
  }
  // 这个函数主要用来页面刷新时重新装载用户数据，这里的用户是organization。
  // 如果localstorage中存在token信息，就直接用token的信息发布一个登录凭证，否则，清空一下，然后发送未登录指令到app component
  private populate() {
    if (this.jwtHelper.tokenGetter() && !this.jwtHelper.isTokenExpired()) {
      const tokenInfo = this.jwtHelper.decodeToken() as TokenInfo;
      this.currentOrg$.next(tokenInfo);
      this.isAuthenticated$.next(true);
    } else {
      this.pureAuth();
      this.currentOrg$.next(null);
      this.isAuthenticated$.next(false);
    }
  }
  // 登录会调用的逻辑，登录从远端拿到access_token之后存到localstorage
  public setAuth(model: RequestActionModel) {
    // 首先清除一次凭证
    this.pureAuth();
    window.localStorage.setItem('access_token', model.data.access_token);
    this.populate();
  }
  // 登出后将相应的access_token清空，然后发送相关的指令出去
  public pureAuth() {
    window.localStorage.removeItem('access_token');
    this.currentOrg$.next(null);
    this.isAuthenticated$.next(false);
  }
  getCurrentOrg(): TokenInfo {
    return this.currentOrg$.value;
  }
  login(model: any): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/auth/login', model).pipe(map(result => {
      if (result.success) {
        this.setAuth(result);
      }
      return result;
    }));
  }
  getOrgPagination(urlPath: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(urlPath, { observe: 'response' });
  }
  changeOrgShortName(viewModel: ChangeOrgShortNam): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/auth/changeOrgShortName', JSON.stringify(viewModel)).pipe(map(value => {
      if (viewModel.orgIdentifier === this.getCurrentOrg().orgIdentifier) {
        this.setAuth(value);
      }
      return value;
    }));
  }
  /**当前重置密码是由管理部门发起的。用户部门没有发起重置密码的权限 */
  resetOrgPassword(model: ResetOrgPassword): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/auth/resetPassword', JSON.stringify(model));
  }
  changeOrgPassword(model: ChangeOrgPassword): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/auth/changeOrgPassword', JSON.stringify(model))
      .pipe(map(value => {
        this.setAuth(value);
        return value;
      }));
  }
  modifyOrgRole() {

  }
}
