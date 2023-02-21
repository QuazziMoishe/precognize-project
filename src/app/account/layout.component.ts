import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AccountService} from "@app/services/account.service";


@Component({
    templateUrl: 'layout.component.html',
    styleUrls: ['layout.component.css']
  }
)
export class LayoutComponent {
  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    // if (this.accountService.userValue) {
    //   this.router.navigate(['/']);
    // }
  }
}
