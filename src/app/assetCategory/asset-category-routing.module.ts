import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { AssetCategoryAdminComponent } from './asset-category-admin/asset-category-admin.component';
import { AssetCategoryCurrentUserComponent } from './asset-category-current-user/asset-category-current-user.component';

const routes: Routes = [
  {
    path: '', component: AssetCategoryComponent, children: [
      { path: 'user', component: AssetCategoryCurrentUserComponent },
      { path: 'secondaryadmin', component: AssetCategoryAdminComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetCategoryRoutingModule { }
