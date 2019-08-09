import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetCategoryAdminComponent } from './asset-category-admin/asset-category-admin.component';
import { AssetCategoryCurrentUserComponent } from './asset-category-current-user/asset-category-current-user.component';

const routes: Routes = [
  { path: 'user', component: AssetCategoryCurrentUserComponent, data: { role: 1 } },
  { path: 'secondaryadmin', component: AssetCategoryAdminComponent, data: { role: 2 } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetCategoryRoutingModule { }
