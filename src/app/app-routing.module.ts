import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { ModulePreloadStrategyService } from './core/services/module-preload-strategy.service';
import { DocumentComponent } from './home/document/document.component';
import { PermissionGuard } from './core/services/permission.guard';
import { LoginComponent } from './home/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'document', component: DocumentComponent },
  {
    path: 'nonauditevents', loadChildren: './non-audit-event/non-audit-event.module#NonAuditEventModule', canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    data: { preload: true }
  },
  {
    path: 'organization', loadChildren: './organization/organization.module#OrganizationModule', canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard], data: { preload: true }
  },
  {
    path: 'assets', loadChildren: './assets/assets.module#AssetsModule', canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    data: { preload: true }
  },
  {
    path: 'assetcategory', loadChildren: './assetCategory/asset-category.module#AssetCategoryModule', canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    data: { preload: true }
  },
  {
    path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    data: { preload: true }
  },
  {
    path: 'assetevents', loadChildren: './asset-events/asset-events.module#AssetEventsModule', canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    data: { preload: true }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: ModulePreloadStrategyService })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
