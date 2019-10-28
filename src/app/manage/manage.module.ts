import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import { CoreModule } from '../core/core.module';
import { AssetAppComponent } from './asset-app/asset-app.component';
import { AssetApplyComponent } from './asset-app/asset-apply/asset-apply.component';
import { HandleAssetApplyDialogComponent } from './asset-app/asset-apply/handle-asset-apply-dialog/handle-asset-apply-dialog.component';
import { AssetExchangeComponent } from './asset-app/asset-exchange/asset-exchange.component';
import { AssetReturnComponent } from './asset-app/asset-return/asset-return.component';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { OrganizationComponent } from './organization/organization.component';
import { RevokeOrganizationDialogComponent } from './organization/revoke-organization-dialog/revoke-organization-dialog.component';
import { SelectedOrgAssetTableComponent } from './organization/revoke-organization-dialog/selected-org-asset-table/selected-org-asset-table.component';
import { AssetComponent } from './asset/asset.component';
import { AssetInventoryComponent } from './asset/asset-inventory/asset-inventory.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaintainersComponent } from './asset-category/maintainers/maintainers.component';
import { MetarialsComponent } from './asset-category/metarials/metarials.component';
import { ChangeMeteringUnitDialogComponent } from './asset-category/change-metering-unit-dialog/change-metering-unit-dialog.component';
import { AssetStoreDialogComponent } from './asset-category/asset-store-dialog/asset-store-dialog.component';
import { AddMaintainerDialogComponent } from './asset-category/add-maintainer-dialog/add-maintainer-dialog.component';
import { AssetOtherInfoComponent } from '../core/tables/asset-other-info/asset-other-info.component';
import { RevokeApplyDialogComponent } from './asset-app/asset-apply/revoke-apply-dialog/revoke-apply-dialog.component';


@NgModule({
  declarations: [AssetApplyComponent, HandleAssetApplyDialogComponent,
    AssetAppComponent, AssetExchangeComponent, AssetReturnComponent, AssetCategoryComponent, OrganizationComponent,
    RevokeOrganizationDialogComponent, SelectedOrgAssetTableComponent,
    AssetComponent, AssetInventoryComponent, DashboardComponent, MaintainersComponent,
    MetarialsComponent, ChangeMeteringUnitDialogComponent, AssetStoreDialogComponent, AddMaintainerDialogComponent,
    RevokeApplyDialogComponent],
  imports: [
    CommonModule,
    CoreModule,
    ManageRoutingModule,
  ],
  entryComponents: [HandleAssetApplyDialogComponent, RevokeOrganizationDialogComponent,
    ChangeMeteringUnitDialogComponent,
    AddMaintainerDialogComponent,
    AssetStoreDialogComponent,
    AssetOtherInfoComponent,
    RevokeApplyDialogComponent]
})
export class ManageModule { }
