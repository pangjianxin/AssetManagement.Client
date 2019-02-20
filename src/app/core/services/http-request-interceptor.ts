import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpRequsetInterceptor implements HttpInterceptor {

  constructor(private alert: AlertService, private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest: HttpRequest<any> = request.clone({
      setHeaders: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      url: `${environment.api_url}${request.url}`
    });
    return next.handle(clonedRequest);
  }
}
