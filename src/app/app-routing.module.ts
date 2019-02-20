import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { AuthGuard } from './core/services/auth.guard';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { ModulePreloadStrategyService } from './core/services/module-preload-strategy.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'nonauditevents', loadChildren: './non-audit-event/non-audit-event.module#NonAuditEventModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'organization', loadChildren: './organization/organization.module#OrganizationModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'assets', loadChildren: './assets/assets.module#AssetsModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'assetcategory', loadChildren: './assetCategory/asset-category.module#AssetCategoryModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'assetevents', loadChildren: './asset-events/asset-events.module#AssetEventsModule', canActivate: [AuthGuard],
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
