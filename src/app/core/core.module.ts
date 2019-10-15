import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule, MatHorizontalStepper } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule, DatePipe } from '@angular/common';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { HttpRequsetInterceptor } from './services/http-request-interceptor';
import { HttpResponseInterceptor } from './services/http-response-interceptor';
import { myPaginator } from './services/paginatorInit';
import { AssetApplyTableComponent } from './tables/asset-apply-table/asset-apply-table.component';
import { AssetExchangeTableComponent } from './tables/asset-exchange-table/asset-exchange-table.component';
import { AssetReturnTableComponent } from './tables/asset-return-table/asset-return-table.component';
import { AssetTableComponent } from './tables/asset-table/asset-table.component';
import { AssetOtherInfoComponent } from './tables/asset-other-info/asset-other-info.component';
import { AssetTableWithConditionComponent } from './tables/asset-table-with-condition/asset-table-with-condition.component';
import { AssetCategoryTableComponent } from './tables/asset-category-table/asset-category-table.component';
import { MaintainerTableComponent } from './tables/maintainer-table/maintainer-table.component';
import { MaterialTableComponent } from './tables/material-table/material-table.component';
import { OrganizationTableComponent } from './tables/organization-table/organization-table.component';
import { AssetBarChartComponent } from './charts/asset-bar-chart/asset-bar-chart.component';
import { AssetPieChartComponent } from './charts/asset-pie-chart/asset-pie-chart.component';
import { AssetInventoryRegisterTableComponent } from './tables/asset-inventory-register-table/asset-inventory-register-table.component';
import { AssetDeployTableComponent } from './tables/asset-deploy-table/asset-deploy-table.component';
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
  declarations: [AssetApplyTableComponent,
    AssetExchangeTableComponent,
    AssetReturnTableComponent,
    AssetTableComponent,
    AssetOtherInfoComponent,
    AssetTableWithConditionComponent,
    AssetCategoryTableComponent,
    MaintainerTableComponent,
    MaterialTableComponent,
    OrganizationTableComponent,
    AssetBarChartComponent,
    AssetPieChartComponent,
    AssetInventoryRegisterTableComponent,
    AssetDeployTableComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    { provide: MAT_DATE_FORMATS, useValue: CN_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequsetInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { minLength: '20%', minWidth: '20%', hasBackdrop: true } },
    { provide: MatPaginatorIntl, useValue: myPaginator() }],
  imports: [
    ReactiveFormsModule,
    FormsModule,
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
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTabsModule,
    MatStepperModule,
    MatProgressBarModule,
    MatRadioModule,
    MatTreeModule,
    FormsModule,
    // 导出自定义的组件
    AssetApplyTableComponent,
    AssetExchangeTableComponent,
    AssetReturnTableComponent,
    AssetTableComponent,
    AssetOtherInfoComponent,
    AssetTableWithConditionComponent,
    AssetCategoryTableComponent,
    MaintainerTableComponent,
    MaterialTableComponent,
    OrganizationTableComponent,
    AssetBarChartComponent,
    AssetPieChartComponent,
    AssetInventoryRegisterTableComponent,
    AssetDeployTableComponent,
  ],
})
export class CoreModule { }
