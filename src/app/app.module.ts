import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {fakeBackendProvider} from "@app/backend/users-http-service";
import {JwtInterceptor} from "@app/backend/jwt.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {UserPageComponent} from './user-page/user-page.component';
import {UserListPageComponent} from './user-list-page/user-list-page.component';
import {EditUserComponent} from './user-list-page/edit-user/edit-user.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AccountService} from "@app/services/account.service";
import {ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "@app/app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    UserPageComponent,
  ],
    imports: [
        BrowserModule,
        RouterOutlet,
        EditUserComponent,
        RouterLink,
        RouterLinkActive,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        UserListPageComponent,
        BrowserAnimationsModule,
        MatButtonModule,
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    fakeBackendProvider,
    AccountService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
