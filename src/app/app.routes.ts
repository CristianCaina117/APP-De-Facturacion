import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu', component: App },
  {
    path: 'luz',
    loadComponent: () => import('./luz/luz/luz').then(m => m.Luz)
  },
  {
    path: 'agua',
    loadComponent: () => import('./agua/agua/agua').then(m => m.AguaComponent)
  },
  {
    path: 'gas1y2',
    loadComponent: () => import('./gas1y2/gas1y2/gas1y2').then(m => m.Gas1y2)
  },
  {
    path: 'gas3y4',
    loadComponent: () => import('./gas3y4/gas3y4/gas3y4').then(m => m.Gas3y4)
  },
  { path: '**', redirectTo: 'menu' }
];
