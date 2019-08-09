import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonAuditEventRoutingModule } from './non-audit-event-routing.module';
import { NonauditeventTableComponent } from './nonauditevent-table/nonauditevent-table.component';
import { NonauditeventsSecondaryAdminComponent } from './nonauditevents-secondary-admin/nonauditevents-secondary-admin.component';
import { CoreModule } from '../core/core.module';
import { NonauditeventCurrentUserComponent } from './nonauditevent-current-user/nonauditevent-current-user.component';

@NgModule({
  declarations: [NonauditeventTableComponent, NonauditeventsSecondaryAdminComponent, NonauditeventCurrentUserComponent],
  imports: [
    CommonModule,
    NonAuditEventRoutingModule,
    CoreModule,
  ]
})
export class NonAuditEventModule { }
