import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'ativos',
        loadComponent: () => import('./features/ativos/ativos.component').then(m => m.AtivosComponent),
      },
      {
        path: 'financas',
        loadComponent: () => import('./features/financas/financas.component').then(m => m.FinancasComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
