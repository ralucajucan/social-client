import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/snackbar.service';
import { ILogin } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  hide: boolean = true;
  color: string = 'success';
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    if (history.state?.error) {
      console.log(history.state?.error);
      this.error =
        history.state.error?.status + ':' + history.state.error?.message;
    }
  }

  ngOnDestroy() {
    this.loginForm.reset();
  }

  onSubmit() {
    console.log(this.loginForm);
    this.authService
      .login({
        email: this.email?.value,
        password: this.password?.value,
      } as ILogin)
      .subscribe(
        (data) => {
          console.log(data);
          this.snackbarService.success(`Bine ati venit, ${data.userId}!`);
          this.router.navigate(['/home']);
        },
        (error) => {
          this.snackbarService.error(error.error);
          this.error = error.status + ':' + error.error;
        }
      );
  }

  getEmailErrorMessage() {
    const email = this.loginForm.get('email');
    if (email && email?.touched) {
      if (email.errors!['email']) {
        return 'Email invalid';
      }
    }
    return 'Obligatoriu';
  }
}
