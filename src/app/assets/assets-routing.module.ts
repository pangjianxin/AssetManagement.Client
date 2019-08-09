import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetSecondaryAdminComponent } from './asset-secondary-admin/asset-secondary-admin.component';
import { AssetCurrentUserComponent } from './asset-current-user/asset-current-user.component';

const routes: Routes = [
  { path: 'currentuser', component: AssetCurrentUserComponent, data: { role: 1 } },
  { path: 'secondaryadmin', component: AssetSecondaryAdminComponent, data: { role: 2 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
