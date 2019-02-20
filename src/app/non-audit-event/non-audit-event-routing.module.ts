import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonauditeventsComponent } from './nonauditevents/nonauditevents.component';
import { NonauditeventsSecondaryAdminComponent } from './nonauditevents-secondary-admin/nonauditevents-secondary-admin.component';
import { NonauditeventCurrentUserComponent } from './nonauditevent-current-user/nonauditevent-current-user.component';

const routes: Routes = [
  {
    path: '', component: NonauditeventsComponent, children: [
      { path: 'user', component: NonauditeventCurrentUserComponent },
      { path: 'secondaryadmin', component: NonauditeventsSecondaryAdminComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonAuditEventRoutingModule { }
