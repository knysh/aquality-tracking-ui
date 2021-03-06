import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/general/authorization/Login.component';
import { NotFoundComponent } from './pages/general/not-found/not-found.component';
import { LoginGuard, AuthGuard } from './shared/guards/login-guard.service';
import { UserSettingsComponent } from './pages/general/user-settings/user-settings.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'settings', component: UserSettingsComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
