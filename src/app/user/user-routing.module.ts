import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetAppComponent } from './asset-app/asset-app.component';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { AssetComponent } from './asset/asset.component';
import { OrganizationComponent } from './organization/organization.component';
import { SpaceAndEmployeeComponent } from './space-and-employee/space-and-employee.component';




const routes: Routes = [
  { path: 'assetApp', component: AssetAppComponent, data: { role: 1 } },
  { path: 'assetCategory', component: AssetCategoryComponent, data: { role: 1 } },
  { path: 'assets', component: AssetComponent, data: { role: 1 } },
  { path: 'organization', component: OrganizationComponent, data: { role: 1 }, },
  { path: 'spaceAndEmployee', component: SpaceAndEmployeeComponent, data: { role: 1 } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
