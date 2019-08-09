import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { CoreModule } from '../core/core.module';
import { AssetTableComponent } from './asset-table/asset-table.component';
import { AssetBarChartComponent } from './asset-bar-chart/asset-bar-chart.component';
import { AssetPieChartComponent } from './asset-pie-chart/asset-pie-chart.component';
import { AssetSecondaryAdminComponent } from './asset-secondary-admin/asset-secondary-admin.component';
import { AssetCurrentUserComponent } from './asset-current-user/asset-current-user.component';
import { AssetExchangeDialogComponent } from './asset-current-user/asset-exchange-dialog/asset-exchange-dialog.component';
import { AssetOtherInfoComponent } from './asset-other-info/asset-other-info.component';
// tslint:disable-next-line:max-line-length
import { AssetStockTakingSecondaryAdminComponent } from './asset-secondary-admin/asset-stock-taking-secondary-admin/asset-stock-taking-secondary-admin.component';
// tslint:disable-next-line:max-line-length
import { AssetStockTakingCurrentUserComponent } from './asset-current-user/asset-stock-taking-current-user/asset-stock-taking-current-user.component';
// tslint:disable-next-line:max-line-length
import { AssetStockTakingOrgTableComponent } from './asset-secondary-admin/asset-stock-taking-secondary-admin/asset-stock-taking-org-table/asset-stock-taking-org-table.component';
// tslint:disable-next-line:max-line-length
import { StockTakingDetailComponent } from './asset-current-user/asset-stock-taking-current-user/stock-taking-detail/stock-taking-detail.component';
// tslint:disable-next-line:max-line-length
import { AssetsWithOutStockTakingComponent } from './asset-current-user/asset-stock-taking-current-user/assets-with-out-stock-taking/assets-with-out-stock-taking.component';
// tslint:disable-next-line:max-line-length
import { AssetStockTakingDialogComponent } from './asset-current-user/asset-stock-taking-current-user/asset-stock-taking-dialog/asset-stock-taking-dialog.component';
import { AssetMaintainsDialogComponent } from './asset-current-user/asset-maintains-dialog/asset-maintains-dialog.component';



@NgModule({
  declarations: [
    AssetTableComponent,
    AssetBarChartComponent,
    AssetPieChartComponent,
    AssetSecondaryAdminComponent,
    AssetCurrentUserComponent,
    AssetExchangeDialogComponent,
    AssetOtherInfoComponent,
    AssetStockTakingSecondaryAdminComponent,
    AssetStockTakingCurrentUserComponent,
    AssetStockTakingOrgTableComponent,
    StockTakingDetailComponent,
    AssetsWithOutStockTakingComponent,
    AssetStockTakingDialogComponent,
    AssetMaintainsDialogComponent,
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    CoreModule,
  ],
  exports: [AssetTableComponent],
  entryComponents: [AssetExchangeDialogComponent, AssetOtherInfoComponent, AssetStockTakingDialogComponent, AssetMaintainsDialogComponent]
})
export class AssetsModule { }
