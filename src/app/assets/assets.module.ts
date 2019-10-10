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
import { AssetMaintainsDialogComponent } from './asset-current-user/asset-maintains-dialog/asset-maintains-dialog.component';
import { AssetInventoryComponent } from './asset-current-user/asset-inventory/asset-inventory.component';
import { AssetsWithoutInventoryComponent } from './asset-current-user/asset-inventory/assets-without-inventory/assets-without-inventory.component';
import { AssetsInventoryDetailsComponent } from './asset-current-user/asset-inventory/assets-inventory-details/assets-inventory-details.component';
import { AssetInventorySecondaryAdminComponent } from './asset-secondary-admin/asset-inventory-secondary-admin/asset-inventory-secondary-admin.component';
import { AssetInventoryRegisterTableComponent } from './asset-secondary-admin/asset-inventory-secondary-admin/asset-inventory-register-table/asset-inventory-register-table.component';
import { AssetReturnDialogComponent } from './asset-current-user/asset-return-dialog/asset-return-dialog.component';
// tslint:disable-next-line:max-line-length
import { AssetInventoryDialogComponent } from './asset-current-user/asset-inventory/asset-inventory-dialog/asset-inventory-dialog.component';



@NgModule({
  declarations: [
    AssetTableComponent,
    AssetBarChartComponent,
    AssetPieChartComponent,
    AssetSecondaryAdminComponent,
    AssetCurrentUserComponent,
    AssetExchangeDialogComponent,
    AssetOtherInfoComponent,
    AssetMaintainsDialogComponent,
    AssetInventoryComponent,
    AssetsWithoutInventoryComponent,
    AssetsInventoryDetailsComponent,
    AssetInventorySecondaryAdminComponent,
    AssetInventoryRegisterTableComponent,
    AssetReturnDialogComponent,
    AssetInventoryDialogComponent,
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    CoreModule,
  ],
  exports: [AssetTableComponent],
  entryComponents: [AssetExchangeDialogComponent, AssetOtherInfoComponent,
    AssetMaintainsDialogComponent, AssetReturnDialogComponent, AssetInventoryDialogComponent]
})
export class AssetsModule { }
