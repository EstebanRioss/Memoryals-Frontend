import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/user/home/home';
import { Login } from './features/auth/login/login';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}