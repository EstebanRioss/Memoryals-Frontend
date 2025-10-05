import { Routes } from '@angular/router';
import { Home } from './features/user/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Micuenta } from './features/user/micuenta/micuenta';
import { PlanesComponent } from './features/planes/planes.component';
import { AboutComponent } from './features/about/about.component';
import { Micuota } from './features/user/micuota/micuota';
import { Admin } from './features/admin/admin';
import { PanelU } from './features/admin/panel-u/panel-u';
import { PanelP } from './features/admin/panel-p/panel-p';
import { General } from './features/admin/general/general';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Home },
  { path: 'planes', component: PlanesComponent },
  { path: 'sobre-nosotros', component: AboutComponent },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'mi-cuenta/:id', component: Micuenta },
  { path: 'mis-cuotas/:id', component: Micuota },
  {
    path: 'admin',
    component: Admin,   // layout que contiene el aside
    children: [
      { path: 'usuarios', component: PanelU },
      { path: 'general', component: General },
      { path: 'pagos', component: PanelP },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' } // default
    ]
  }
];
