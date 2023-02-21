import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {fakeBackendProvider} from "@app/backend/users-http-service";
import {JwtInterceptor} from "@app/backend/jwt.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {UserPageComponent} from './user-page/user-page.component';
import {UserListPageComponent} from './user-list-page/user-list-page.component';
import {EditUserDialogComponent} from './user-list-page/edit-user/edit-user-dialog.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AccountService} from "@app/services/account.service";
import {ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "@app/app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    EditUserDialogComponent,
    RouterLink,
    RouterLinkActive,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    UserListPageComponent,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTabsModule,
    UserPageComponent,
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
