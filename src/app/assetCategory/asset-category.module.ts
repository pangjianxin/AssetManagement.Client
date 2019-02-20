import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetCategoryRoutingModule } from './asset-category-routing.module';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { AssetCategoryTableComponent } from './asset-category-table/asset-category-table.component';
import { CoreModule } from '../core/core.module';
import { AssetCategoryAdminComponent } from './asset-category-admin/asset-category-admin.component';
import { AssetCategoryCurrentUserComponent } from './asset-category-current-user/asset-category-current-user.component';
import { AssetMaterialTableComponent } from './asset-material-table/asset-material-table.component';

@NgModule({
  declarations: [AssetCategoryComponent, AssetCategoryTableComponent, AssetCategoryAdminComponent, AssetCategoryCurrentUserComponent, AssetMaterialTableComponent],
  imports: [
    CommonModule,
    AssetCategoryRoutingModule,
    CoreModule
  ]
})
export class AssetCategoryModule {

}
