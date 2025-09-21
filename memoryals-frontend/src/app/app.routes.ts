import { Routes } from '@angular/router';
import { Home } from './features/user/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Micuenta } from './features/user/micuenta/micuenta';
import { PlanesComponent } from './features/planes/planes.component';
import { AboutComponent } from './features/about/about.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: Home },
    { path: 'planes', component: PlanesComponent },
    { path: 'sobre-nosotros', component: AboutComponent },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'mi-cuenta/:id', component: Micuenta },
];
