import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetAppComponent } from './asset-app/asset-app.component';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { OrganizationComponent } from './organization/organization.component';
import { AssetComponent } from './asset/asset.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  { path: 'assetApp', component: AssetAppComponent, data: { role: 2 } },
  { path: 'assetCategory', component: AssetCategoryComponent, data: { role: 2 } },
  { path: 'organization', component: OrganizationComponent, data: { role: 2 } },
  { path: 'asset', component: AssetComponent, data: { role: 2 } },
  { path: 'dashboard', component: DashboardComponent, data: { role: 2 } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
