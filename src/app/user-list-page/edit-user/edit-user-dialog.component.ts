import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserDto} from "@app/dtos/user-dto";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {AccountService} from "@app/services/account.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    MatSelectModule,
    NgForOf
  ],
})
export class EditUserDialogComponent implements OnInit {

  form: FormGroup<{
    username: FormControl<string | null>;
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    role: FormControl<'user' | 'admin' | null>;
  }>;
  private userSubscription: Subscription;
  currentUser: UserDto;
  constructor(
    @Inject(MAT_DIALOG_DATA) public user: UserDto,
    private readonly accountService: AccountService,
    private readonly dialogRef: MatDialogRef<EditUserDialogComponent>,
    private formBuilder: FormBuilder,
  ) {}


  ngOnInit() {
    this.userSubscription = this.accountService.user.subscribe(user => this.currentUser = user);
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      username: [this.user?.username, Validators.required],
      firstName: [this.user?.firstName, Validators.required],
      lastName: [this.user?.lastName, Validators.required],
      role: [this.user?.role, Validators.required],
    });
  }

  onSubmit() {

    if (this.form.invalid) {
      return;
    }

    const userData = {...this.user, ...this.form.value}

    this.dialogRef.close(userData)
  }

  onCancel() {
    this.dialogRef.close()
  }
}
