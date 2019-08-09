import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetCategoryRoutingModule } from './asset-category-routing.module';
import { AssetCategoryTableComponent } from './asset-category-table/asset-category-table.component';
import { CoreModule } from '../core/core.module';
import { AssetCategoryAdminComponent } from './asset-category-admin/asset-category-admin.component';
import { AssetCategoryCurrentUserComponent } from './asset-category-current-user/asset-category-current-user.component';
import { AssetMaterialTableComponent } from './asset-material-table/asset-material-table.component';
import { MaintainersComponent } from './maintainers/maintainers.component';

@NgModule({
  declarations: [AssetCategoryTableComponent,
    AssetCategoryAdminComponent, AssetCategoryCurrentUserComponent, AssetMaterialTableComponent, MaintainersComponent],
  imports: [
    CommonModule,
    AssetCategoryRoutingModule,
    CoreModule
  ]
})
export class AssetCategoryModule {

}
