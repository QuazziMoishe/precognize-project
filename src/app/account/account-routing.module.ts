import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LayoutComponent} from './layout.component';
import {LoginComponent} from './login-page/login.component';
import {RegisterComponent} from './register-page/register.component';

const routes: Routes = [
  // {
  //   path: '', redirectTo: 'login', pathMatch: 'full',
  // },
  // {
  //   path: 'register', component: RegisterComponent,
  // },
  // {
  //   path: 'login', component: LoginComponent,
  // }

  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
