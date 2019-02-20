import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AlertService } from './alert.service';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpResponseInterceptor implements HttpInterceptor {
  constructor(private alert: AlertService,
    private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(map(response => {
      if (response instanceof HttpResponse) {
        if (response.status === 401) {
          this.router.navigate(['/login']);
        }
      }
      return response;
    }));
  }
  private handleError(error) {
    if (error instanceof HttpErrorResponse) {
      return throwError(error.error);
    } else if (error instanceof ErrorEvent) {
      this.alert.warn(error.message);
    } else {
      this.alert.warn(error);
    }
  }
}
