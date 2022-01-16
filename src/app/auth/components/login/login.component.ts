import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import * as authActions from 'src/app/store/actions/auth.actions';

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
    private store: Store<AppState>
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    if (history.state?.error) {
      this.error =
        history.state.error?.status + ':' + history.state.error?.message;
    }
  }

  ngOnDestroy() {
    this.loginForm.reset();
  }

  onSubmit() {
    this.store.dispatch(
      authActions.loginStart({
        email: this.email?.value,
        password: this.password?.value,
      })
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
