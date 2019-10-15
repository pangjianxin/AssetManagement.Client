import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class HttpRequsetInterceptor implements HttpInterceptor {

  constructor(private alert: AlertService, private router: Router, private jwtHelper: JwtHelperService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.jwtHelper.isTokenExpired()) {
      if (this.router.url !== '/login') {
        this.router.navigateByUrl('/login').then(() => this.alert.warn('你的登录已过期，请重新登录'));
      }
    }
    const clonedRequest: HttpRequest<any> = request.clone({
      setHeaders: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      url: `${environment.host_base_url}${request.url}`
    });
    console.log(clonedRequest.url);
    return next.handle(clonedRequest);
  }
}
