import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';


@Component({
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      RouterOutlet
    ]
  }
)
export class AccountComponent {
}
