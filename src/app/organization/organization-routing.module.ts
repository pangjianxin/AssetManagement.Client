import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpaceComponent } from './space/space.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { OrganizationComponent } from './organization/organization.component';

const routes: Routes = [
  {
    path: '', component: OrganizationComponent, children: [
      { path: 'detail', component: OrganizationDetailsComponent },
      { path: 'space', component: SpaceComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
