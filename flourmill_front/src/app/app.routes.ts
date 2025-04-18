import { Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/dashboard.guard';

export const routes: Routes = [
    { path: 'login', component: AdminLoginComponent , canActivate: [LoginGuard] },
    { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
