import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountRoutingModule} from './account-routing.module';
import {AccountComponent} from './account.component';
import {LoginComponent} from './login-page/login.component';
import {RegisterComponent} from './register-page/register.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
  ],
})
export class AccountModule {
}
