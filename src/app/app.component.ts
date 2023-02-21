import {Component} from '@angular/core';
import {UserDto} from "@app/dtos/user-dto";
import {AccountService} from "@app/services/account.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: UserDto;
  constructor(
    private accountService: AccountService,
  ) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  logout() {
    this.accountService.logout();
  }
}
