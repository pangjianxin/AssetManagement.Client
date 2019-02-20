
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequsetInterceptor } from './core/services/http-request-interceptor';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatPaginatorIntl } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { myPaginator } from './core/services/paginatorInit';
import { HttpResponseInterceptor } from './core/services/http-response-interceptor';
import { AuthorizeDirective } from './core/directives/authorize.directive';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function () {
          return window.localStorage.getItem('access_token');
        },
        whitelistedDomains: environment.jwt_whiteLists,
        blacklistedRoutes: environment.jwt_blackLists,
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequsetInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { minLength: '20%', minWidth: '20%', hasBackdrop: true } },
    { provide: MatPaginatorIntl, useValue: myPaginator() }
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
