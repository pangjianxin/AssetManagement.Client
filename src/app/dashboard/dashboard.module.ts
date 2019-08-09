import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from '../core/core.module';
import { DashboardSecondaryAdminComponent } from './dashboard-secondary-admin/dashboard-secondary-admin.component';
import { DashboardCurrentUserComponent } from './dashboard-current-user/dashboard-current-user.component';
import { AssetBarChartComponent } from './asset-bar-chart/asset-bar-chart.component';
import { AssetPieChartComponent } from './asset-pie-chart/asset-pie-chart.component';
import { AssetTableComponent } from './asset-table/asset-table.component';
import { AssetDeployTableComponent } from './asset-deploy-table/asset-deploy-table.component';

@NgModule({
  declarations: [
    DashboardSecondaryAdminComponent,
    DashboardCurrentUserComponent,
    AssetBarChartComponent,
    AssetPieChartComponent,
    AssetTableComponent,
    AssetDeployTableComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CoreModule,
    LayoutModule
  ]
})
export class DashboardModule { }
