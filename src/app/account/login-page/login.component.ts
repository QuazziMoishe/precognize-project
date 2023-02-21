import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AccountService} from "@app/services/account.service";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgIf
  ]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.form.controls.username.value, this.form.controls.password.value).pipe(first())
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: ({error}: any) => {
          alert(error.message);
          this.loading = false;
        }
      });
  }

    redirectToRegisterForm(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['../register'], {relativeTo: this.route})
  }
}
