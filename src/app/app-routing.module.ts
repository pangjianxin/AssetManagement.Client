import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PageNotFoundComponent } from './home/page-not-found/page-not-found.component';
import { ModulePreloadStrategyService } from './core/services/module-preload-strategy.service';
import { DocumentComponent } from './home/document/document.component';
import { PermissionGuard } from './core/guards/permission.guard';
import { LoginComponent } from './home/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'document', component: DocumentComponent },
  {
    path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard], data: { preload: true }
  },
  {
    path: 'manage', loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule), canActivate: [AuthGuard],
    canActivateChild: [PermissionGuard], data: { preload: true }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: ModulePreloadStrategyService })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
