import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
  MatStepperModule,
  MatTreeModule,
  MatProgressBar,
  MatProgressBarModule,
  MatRadioModule,
  MatHorizontalStepper,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatPaginatorIntl,
} from '@angular/material';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { HttpRequsetInterceptor } from './services/http-request-interceptor';
import { HttpResponseInterceptor } from './services/http-response-interceptor';
import { myPaginator } from './services/paginatorInit';
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
  declarations: [],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    { provide: MAT_DATE_FORMATS, useValue: CN_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequsetInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { minLength: '20%', minWidth: '20%', hasBackdrop: true } },
    { provide: MatPaginatorIntl, useValue: myPaginator() }],
  imports: [],
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
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTabsModule,
    MatStepperModule,
    MatProgressBarModule,
    MatRadioModule,
    MatTreeModule,
    FormsModule,
  ],
})
export class CoreModule { }
