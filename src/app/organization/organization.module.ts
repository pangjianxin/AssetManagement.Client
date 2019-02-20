import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { CoreModule } from '../core/core.module';
import { SpaceComponent } from './space/space.component';
import { OrganizationComponent } from './organization/organization.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { UserRole } from '../models/user-role.enum';

@NgModule({
  declarations: [
    OrganizationDetailsComponent,
    SpaceComponent,
    OrganizationComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    CoreModule,
  ]
})
export class OrganizationModule { }
