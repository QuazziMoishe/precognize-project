import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AccountService} from "@app/services/account.service";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgIf
  ]
})

export class RegisterComponent implements OnInit {
  form: FormGroup;
  minPasswordLength = 6
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
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(this.minPasswordLength)]]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.register(this.form.value)
      .pipe(first())
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

  redirectToLoginForm(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['../login'], {relativeTo: this.route})
  }
}
