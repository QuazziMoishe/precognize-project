import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {UserDto} from "@app/dtos/user-dto";
import {AccountService} from "@app/services/account.service";
import {DatePipe, NgIf, TitleCasePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {EditUserDialogComponent} from "@app/user-list-page/edit-user/edit-user-dialog.component";
import {Subscription} from "rxjs";
enum UserListActionsEnum {
  edit = 'edit',
  delete = 'delete',
}

enum DisplayedColumnsEnum {
  creationDate = 'creationDate',
  firstName = 'firstName',
  role = 'role',
  actions = 'actions',
}
@Component({
  selector: 'app-user-list-page',
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    DatePipe,
    MatIconModule,
    MatMenuModule,
    TitleCasePipe,
    MatDialogModule,
    NgIf,
  ]
})

export class UserListPageComponent implements OnInit, OnDestroy{
  actionsEnum = UserListActionsEnum;
  displayedColumnsEnum = DisplayedColumnsEnum;
  displayedColumns = Object.values(DisplayedColumnsEnum);
  dataSource: MatTableDataSource<UserDto>;
  currentUser: UserDto;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private userSubscription: Subscription;

  constructor(
    private readonly accountService: AccountService,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.userSubscription = this.accountService.user.subscribe(user => this.currentUser = user);
    this.fetchUsers();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }

  private fetchUsers() {
    this.accountService.getAll().subscribe(users => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cdr.detectChanges()
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditUserDialog(userData: UserDto) {
    this.dialog.open(EditUserDialogComponent, {
      data: userData,
    }).afterClosed().subscribe((dialogData: UserDto) => {
      this.accountService.update(dialogData).subscribe(() => {
        this.fetchUsers()
      })
    });
  }

  deleteUser(userData: UserDto) {
    this.accountService.delete(userData.id).subscribe(() => this.fetchUsers())
  }
}
