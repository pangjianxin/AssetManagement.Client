import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetEventsCurrentUserComponent } from './asset-events-current-user/asset-events-current-user.component';
import { AssetEventsSecondaryComponent } from './asset-events-secondary/asset-events-secondary.component';

const routes: Routes = [
  { path: 'asseteventscurrentuser', component: AssetEventsCurrentUserComponent, data: { role: 1 } },
  { path: 'asseteventssecondary', component: AssetEventsSecondaryComponent, data: { role: 2 } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetEventsRoutingModule { }
