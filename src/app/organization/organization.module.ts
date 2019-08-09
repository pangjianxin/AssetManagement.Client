import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationRoutingModule } from './organization-routing.module';
import { CoreModule } from '../core/core.module';
import { OrganizationTableComponent } from './organization-table/organization-table.component';
import { OrganizatinCurrentComponent } from './organizatin-current/organizatin-current.component';
import { OrganizationSecondaryadminComponent } from './organization-secondaryadmin/organization-secondaryadmin.component';
import { CurrentAssetTableComponent } from './organization-secondaryadmin/current-asset-table/current-asset-table.component';
import { SpaceAndEmployeeComponent } from './space-and-employee/space-and-employee.component';
import { SpaceComponent } from './space-and-employee/space/space.component';
import { EmployeeComponent } from './space-and-employee/employee/employee.component';
import { PermissionComponent } from './organization-secondaryadmin/permission/permission.component';

@NgModule({
  declarations: [
    SpaceAndEmployeeComponent,
    OrganizationTableComponent,
    OrganizatinCurrentComponent,
    OrganizationSecondaryadminComponent,
    CurrentAssetTableComponent,
    SpaceComponent,
    EmployeeComponent,
    PermissionComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    CoreModule,
  ],
})
export class OrganizationModule { }
