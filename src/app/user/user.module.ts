import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { AssetAppComponent } from './asset-app/asset-app.component';
import { AssetReturnComponent } from './asset-app/asset-return/asset-return.component';
import { AssetExchangeComponent } from './asset-app/asset-exchange/asset-exchange.component';
import { CoreModule } from '../core/core.module';
import { AssetApplyComponent } from './asset-app/asset-apply/asset-apply.component';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { AssetComponent } from './asset/asset.component';
import { ExchangeAssetDialogComponent } from './asset/exchange-asset-dialog/exchange-asset-dialog.component';
import { ReturnAssetDialogComponent } from './asset/return-asset-dialog/return-asset-dialog.component';
import { MaintainerDetailDialogComponent } from './asset/maintainer-detail-dialog/maintainer-detail-dialog.component';
import { AssetInventoryComponent } from './asset/asset-inventory/asset-inventory.component';
import { InventoryDialogComponent } from './asset/asset-inventory/inventory-dialog/inventory-dialog.component';
import { InventoryDetailsComponent } from './asset/asset-inventory/inventory-details/inventory-details.component';
import { AssetsWithoutInventoryComponent } from './asset/asset-inventory/assets-without-inventory/assets-without-inventory.component';
import { AssetOtherInfoComponent } from '../core/tables/asset-other-info/asset-other-info.component';
import { OrganizationComponent } from './organization/organization.component';
import { SpaceAndEmployeeComponent } from './organization/space-and-employee/space-and-employee.component';
import { EmployeeComponent } from './organization/space-and-employee/employee/employee.component';
import { SpaceComponent } from './organization/space-and-employee/space/space.component';


@NgModule({
  declarations: [AssetAppComponent,
    AssetReturnComponent,
    AssetExchangeComponent,
    AssetApplyComponent,
    AssetCategoryComponent,
    AssetComponent,
    ExchangeAssetDialogComponent,
    ReturnAssetDialogComponent,
    MaintainerDetailDialogComponent,
    AssetInventoryComponent,
    InventoryDialogComponent,
    InventoryDetailsComponent,
    AssetsWithoutInventoryComponent,
    OrganizationComponent,
    SpaceAndEmployeeComponent,
    EmployeeComponent,
    SpaceComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    CoreModule,
  ],
  entryComponents: [ReturnAssetDialogComponent, ExchangeAssetDialogComponent, MaintainerDetailDialogComponent, InventoryDialogComponent,
    AssetOtherInfoComponent]
})
export class UserModule { }
