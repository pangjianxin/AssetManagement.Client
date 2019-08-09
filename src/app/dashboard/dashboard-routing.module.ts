import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardCurrentUserComponent } from './dashboard-current-user/dashboard-current-user.component';
import { DashboardSecondaryAdminComponent } from './dashboard-secondary-admin/dashboard-secondary-admin.component';

const routes: Routes = [
  {
    path: 'user', component: DashboardCurrentUserComponent, data: { role: 1 }
  },
  { path: 'secondary', component: DashboardSecondaryAdminComponent, data: { role: 2 } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
