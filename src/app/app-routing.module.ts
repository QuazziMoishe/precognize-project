import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthGuard} from "@app/backend/auth.guard";


const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () => import('./user-list-page/user-list-page.component').then(c => c.UserListPageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadComponent: () => import('./user-page/user-page.component').then(c => c.UserPageComponent),
    canActivate: [AuthGuard]
  },
  {path: 'account', loadChildren: () => import('./account/account.module').then(x => x.AccountModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
