import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { Organization } from 'src/app/models/organization';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OrgInfo } from 'src/app/models/org-info';
import { Router } from '@angular/router';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { ChangeOrgShortNamViewmodel } from 'src/app/models/viewmodels/change-org-short-nam-viewmodel';
import { ResetOrgPasswordViewmodel } from 'src/app/models/viewmodels/reset-org-password-viewmodel';
import { ChangeOrgPasswordViewmodel } from 'src/app/models/viewmodels/change-org-password-viewmodel';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  /** BehaviorSubject保存最新的值或者初始值*/
  private currentOrgSubject = new BehaviorSubject<Organization>({} as Organization);
  /**distinctUntilChanged操作符会发射和最近一次相比较不同的值。 */
  public currentOrg = this.currentOrgSubject.asObservable().pipe(distinctUntilChanged());
  /**ReplaySubject的构造函数传入一个数字表示它所能记住的发射的元素数，它本身不管subscribe调用的时机，总会发射出所有的元素 */
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router) {
  }
  // 这个函数主要用来页面刷新时重新装载用户数据，这里的用户是organization。
  populate() {
    if (this.jwtHelper.tokenGetter() && !(this.jwtHelper.isTokenExpired())) {
      this.http.get<RequestActionModel>('/api/auth/userendpoint').subscribe(
        result => this.setAuth(result.data as OrgInfo),
        error => this.pureAuth());
    } else {
      this.pureAuth();
      this.router.navigate(['/login']);
    }
  }
  setAuth(org: OrgInfo) {
    window.localStorage.setItem('access_token', org.access_token);
    this.isAuthenticatedSubject.next(true);
    this.currentOrgSubject.next(org.organization);
  }

  pureAuth() {
    window.localStorage.removeItem('access_token');
    this.currentOrgSubject.next({} as Organization);
    this.isAuthenticatedSubject.next(false);
  }
  getCurrentOrg(): Organization {
    return this.currentOrgSubject.value;
  }
  login(model: any): Observable<RequestActionModel> {
    return this.http.post<RequestActionModel>('/api/auth/login', model).pipe(map(result => {
      if (result.success) {
        this.setAuth(result.data);
      }
      return result;
    }));
  }
  logout() {
    this.pureAuth();
    this.router.navigateByUrl('/login');
  }
  getOrgPagination(urlPath: string): Observable<HttpResponse<RequestActionModel>> {
    return this.http.get<RequestActionModel>(urlPath, { observe: 'response' });
  }
  changeOrgShortName(viewModel: ChangeOrgShortNamViewmodel): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/auth/changeorgshortname', JSON.stringify(viewModel)).pipe(map(value => {
      this.populate();
      return value;
    }));
  }
  resetOrgPassword(model: ResetOrgPasswordViewmodel): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/auth/resetpassword', JSON.stringify(model))
      .pipe(map(value => {
        this.populate();
        return value;
      }));
  }
  changeOrgPassword(model: ChangeOrgPasswordViewmodel): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>('/api/auth/changeorgpassword', JSON.stringify(model))
      .pipe(map(value => {
        this.populate();
        return value;
      }));
  }
  modifyOrgRole() {

  }
}
