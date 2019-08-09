import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpaceAndEmployeeComponent } from './space-and-employee/space-and-employee.component';
import { OrganizatinCurrentComponent } from './organizatin-current/organizatin-current.component';
import { OrganizationSecondaryadminComponent } from './organization-secondaryadmin/organization-secondaryadmin.component';
import { PermissionGuard } from '../core/services/permission.guard';

const routes: Routes = [
  { path: 'current', component: OrganizatinCurrentComponent, data: { role: 1 } },
  { path: 'secondaryadmin', component: OrganizationSecondaryadminComponent, data: { role: 2 } },
  { path: 'spaceandemployee', component: SpaceAndEmployeeComponent, data: { role: 2 } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
