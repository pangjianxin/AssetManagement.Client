import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { AssetsComponent } from './assets/assets.component';
import { CoreModule } from '../core/core.module';
import { AssetTableComponent } from './asset-table/asset-table.component';
import { AssetBarChartComponent } from './asset-bar-chart/asset-bar-chart.component';
import { AssetPieChartComponent } from './asset-pie-chart/asset-pie-chart.component';
import { AssetSecondaryAdminComponent } from './asset-secondary-admin/asset-secondary-admin.component';
import { AssetCurrentUserComponent } from './asset-current-user/asset-current-user.component';
import { AssetExchangeComponent } from './asset-exchange/asset-exchange.component';

@NgModule({
  declarations: [AssetsComponent,
    AssetTableComponent,
    AssetBarChartComponent,
    AssetPieChartComponent,
    AssetSecondaryAdminComponent,
    AssetCurrentUserComponent,
    AssetExchangeComponent],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    CoreModule,
  ],
  entryComponents: [AssetExchangeComponent]
})
export class AssetsModule { }
