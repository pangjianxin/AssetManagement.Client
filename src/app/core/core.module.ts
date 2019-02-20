import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatGridListModule,
  MatCardModule,
  MatDialogModule,
  MatMenuModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSnackBarModule,
  MatChipsModule,
  MatTooltipModule,
  MatExpansionModule,
  MatSelectModule,
  MatBadgeModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  MatTabsModule,
} from '@angular/material';
import { NgxEchartsModule } from 'ngx-echarts';
import { EventsReminderComponent } from './events-reminder/events-reminder.component';
import { EventsReminderSecondaryAdminComponent } from './events-reminder-secondary-admin/events-reminder-secondary-admin.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthorizeDirective } from './directives/authorize.directive';
import { AuthorizeShowDirective } from './directives/authorize-show.directive';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
export const CN_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'YYYY MMM'
  }
};
@NgModule({
  declarations: [EventsReminderComponent,
    EventsReminderSecondaryAdminComponent,
    LoginComponent,
    PageNotFoundComponent,
    AuthorizeDirective,
    AuthorizeShowDirective],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    { provide: MAT_DATE_FORMATS, useValue: CN_FORMATS }],
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    FlexLayoutModule,
    RouterModule,
  ],
  exports: [
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgxEchartsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatTableModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatGridListModule,
    MatExpansionModule,
    MatSelectModule,
    MatBadgeModule,
    EventsReminderSecondaryAdminComponent,
    EventsReminderComponent,
    LoginComponent,
    PageNotFoundComponent,
    AuthorizeDirective,
    AuthorizeShowDirective,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTabsModule,
  ],
})
export class CoreModule { }
