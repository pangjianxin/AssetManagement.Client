
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequsetInterceptor } from './core/services/http-request-interceptor';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { myPaginator } from './core/services/paginatorInit';
import { HttpResponseInterceptor } from './core/services/http-response-interceptor';
import { LeftSidenavComponent } from './home/left-sidenav/left-sidenav.component';
import { RightSidenavComponent } from './home/right-sidenav/right-sidenav.component';
import { EventMessageComponent } from './home/right-sidenav/event-message/event-message.component';
import { DocumentComponent } from './home/document/document.component';
import { LoginComponent } from './home/login/login.component';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
export function tokenGeter() {
  return window.localStorage.getItem('access_token');
}
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LeftSidenavComponent,
    RightSidenavComponent,
    EventMessageComponent,
    DocumentComponent,
    LoginComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGeter,
        whitelistedDomains: environment.jwt_whiteLists,
        blacklistedRoutes: environment.jwt_blackLists,
      }
    }),
  ],
  providers: [
  ],
  entryComponents: []
})
export class AppModule { }
