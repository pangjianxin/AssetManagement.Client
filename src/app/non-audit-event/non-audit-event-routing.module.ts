import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonauditeventsSecondaryAdminComponent } from './nonauditevents-secondary-admin/nonauditevents-secondary-admin.component';
import { NonauditeventCurrentUserComponent } from './nonauditevent-current-user/nonauditevent-current-user.component';

const routes: Routes = [
  { path: 'user', component: NonauditeventCurrentUserComponent, data: { role: 1 } },
  { path: 'secondaryadmin', component: NonauditeventsSecondaryAdminComponent, data: { role: 2 } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonAuditEventRoutingModule { }
