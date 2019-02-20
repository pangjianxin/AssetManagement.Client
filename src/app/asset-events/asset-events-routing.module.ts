import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetApplyingEventComponent } from './asset-applying-event/asset-applying-event.component';
import { AssetApplyingCurrentUserComponent } from './asset-applying-current-user/asset-applying-current-user.component';
import { AssetApplyingSeondaryAdminComponent } from './asset-applying-seondary-admin/asset-applying-seondary-admin.component';
import { AssetReturningEventComponent } from './asset-returning-event/asset-returning-event.component';
import { AssetReturningCurrentUserComponent } from './asset-returning-current-user/asset-returning-current-user.component';
import { AssetReturningSecondaryAdminComponent } from './asset-returning-secondary-admin/asset-returning-secondary-admin.component';
import { AssetExchangingEventComponent } from './asset-exchanging-event/asset-exchanging-event.component';
import { AssetExchangingCurrentUserComponent } from './asset-exchanging-current-user/asset-exchanging-current-user.component';
import { AssetExchangeSecondaryAdminComponent } from './asset-exchange-secondary-admin/asset-exchange-secondary-admin.component';

const routes: Routes = [
  {
    path: 'assetapplying', component: AssetApplyingEventComponent, children: [
      { path: 'currentuser', component: AssetApplyingCurrentUserComponent },
      { path: 'secondaryadmin', component: AssetApplyingSeondaryAdminComponent }
    ]
  },
  {
    path: 'assetreturning', component: AssetReturningEventComponent, children: [
      { path: 'currentuser', component: AssetReturningCurrentUserComponent },
      { path: 'secondaryadmin', component: AssetReturningSecondaryAdminComponent }
    ]
  },
  {
    path: 'assetexchanging', component: AssetExchangingEventComponent, children: [
      { path: 'currentuser', component: AssetExchangingCurrentUserComponent },
      { path: 'secondaryadmin', component: AssetExchangeSecondaryAdminComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetEventsRoutingModule { }
