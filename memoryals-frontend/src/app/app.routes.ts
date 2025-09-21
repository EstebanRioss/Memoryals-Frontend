import { Routes } from '@angular/router';
import { Home } from './features/user/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: Home },
    { path: 'planes', loadComponent: () => import('./features/planes/planes.component').then(m => m.PlanesComponent) },
    { path: 'sobre-nosotros', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
];
