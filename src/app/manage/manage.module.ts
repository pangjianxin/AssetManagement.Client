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
import { PermissionComponent } from './organization/permission/permission.component';
import { AssetComponent } from './asset/asset.component';
import { AssetInventoryComponent } from './asset/asset-inventory/asset-inventory.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [AssetApplyComponent, HandleAssetApplyDialogComponent,
    AssetAppComponent, AssetExchangeComponent, AssetReturnComponent, AssetCategoryComponent, OrganizationComponent,
    RevokeOrganizationDialogComponent, SelectedOrgAssetTableComponent, PermissionComponent, AssetComponent, AssetInventoryComponent, DashboardComponent],
  imports: [
    CommonModule,
    ManageRoutingModule,
    CoreModule,
  ],
  entryComponents: [HandleAssetApplyDialogComponent, RevokeOrganizationDialogComponent]
})
export class ManageModule { }
