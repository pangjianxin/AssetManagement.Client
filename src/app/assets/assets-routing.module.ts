import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { AssetSecondaryAdminComponent } from './asset-secondary-admin/asset-secondary-admin.component';
import { AssetCurrentUserComponent } from './asset-current-user/asset-current-user.component';

const routes: Routes = [
  {
    path: '', component: AssetsComponent, children: [
      { path: 'currentuser', component: AssetCurrentUserComponent },
      { path: 'secondaryadmin', component: AssetSecondaryAdminComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
