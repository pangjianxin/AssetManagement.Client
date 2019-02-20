import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetEventsRoutingModule } from './asset-events-routing.module';
import { AssetApplyingEventComponent } from './asset-applying-event/asset-applying-event.component';
import { AssetApplyingCurrentUserComponent } from './asset-applying-current-user/asset-applying-current-user.component';
import { AssetApplyingSeondaryAdminComponent } from './asset-applying-seondary-admin/asset-applying-seondary-admin.component';
import { AssetReturningEventComponent } from './asset-returning-event/asset-returning-event.component';
import { AssetReturningCurrentUserComponent } from './asset-returning-current-user/asset-returning-current-user.component';
import { AssetReturningSecondaryAdminComponent } from './asset-returning-secondary-admin/asset-returning-secondary-admin.component';
import { AssetApplyingTableComponent } from './asset-applying-table/asset-applying-table.component';
import { AssetReturningTableComponent } from './asset-returning-table/asset-returning-table.component';
import { CoreModule } from '../core/core.module';
import { HandleAssetApplyingComponent } from './handle-asset-applying/handle-asset-applying.component';
import { AssetExchangingCurrentUserComponent } from './asset-exchanging-current-user/asset-exchanging-current-user.component';
import { AssetExchangeSecondaryAdminComponent } from './asset-exchange-secondary-admin/asset-exchange-secondary-admin.component';
import { AssetExchangeTableComponent } from './asset-exchange-table/asset-exchange-table.component';
import { AssetExchangingEventComponent } from './asset-exchanging-event/asset-exchanging-event.component';

@NgModule({
  declarations: [AssetApplyingEventComponent,
    AssetApplyingCurrentUserComponent,
    AssetApplyingSeondaryAdminComponent,
    AssetReturningEventComponent,
    AssetReturningCurrentUserComponent,
    AssetReturningSecondaryAdminComponent,
    AssetApplyingTableComponent,
    AssetReturningTableComponent,
    HandleAssetApplyingComponent,
    AssetExchangingCurrentUserComponent,
    AssetExchangeSecondaryAdminComponent,
    AssetExchangeTableComponent,
    AssetExchangingEventComponent],
  imports: [
    CommonModule,
    AssetEventsRoutingModule,
    CoreModule,
  ],
  entryComponents: [HandleAssetApplyingComponent],
})
export class AssetEventsModule { }
