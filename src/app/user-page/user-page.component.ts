import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "@app/services/account.service";
import {MatDialog} from "@angular/material/dialog";
import {UserDto} from "@app/dtos/user-dto";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {DatePipe, NgForOf} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {EditUserDialogComponent} from "@app/user-list-page/edit-user/edit-user-dialog.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    NgForOf,
    MatListModule,
    DatePipe,
  ]
})
export class UserPageComponent implements OnInit, OnDestroy {

  currentUser: UserDto;
  private userSubscription: Subscription;

  constructor(
    private readonly accountService: AccountService,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.userSubscription = this.accountService.user.subscribe(x => this.currentUser = x);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }

  openEditUserDialog() {
    this.dialog.open(EditUserDialogComponent, {
      data: this.currentUser,
    }).afterClosed().subscribe((dialogData: UserDto) => {
      this.accountService.update(dialogData).subscribe(() => {
        this.cdr.detectChanges()
      })
    });
  }
}
