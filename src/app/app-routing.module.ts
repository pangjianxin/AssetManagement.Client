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
    path: 'nonauditevents',
    loadChildren: () => import('./non-audit-event/non-audit-event.module').then(m => m.NonAuditEventModule), canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    data: { preload: true }
  },
  {
    path: 'organization',
    loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule), canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard], data: { preload: true }
  },
  {
    path: 'assets',
    loadChildren: () => import('./assets/assets.module').then(m => m.AssetsModule), canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    data: { preload: true }
  },
  {
    path: 'assetcategory',
    loadChildren: () => import('./assetCategory/asset-category.module').then(m => m.AssetCategoryModule), canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    data: { preload: true }
  },
  {
    path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard],
    data: { preload: true }
  },
  {
    path: 'assetevents',
    loadChildren: () => import('./asset-events/asset-events.module').then(m => m.AssetEventsModule), canActivate: [AuthGuard],
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
