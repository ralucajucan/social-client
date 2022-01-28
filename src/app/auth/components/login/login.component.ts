import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import * as authActions from 'src/app/store/actions/auth.actions';
import { Observable } from 'rxjs';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  hide: boolean = true;
  color: string = 'success';
  error$: Observable<string>;
  emailError$: Observable<boolean>;
  credentialsError$: Observable<boolean>;
  emailSent$: Observable<boolean>;
  lastEmailUsed: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.error$ = this.store.pipe(select((state) => state.auth.error));
    this.emailError$ = this.store.pipe(
      select((state) => state.auth.error?.includes('email'))
    );
    this.credentialsError$ = this.store.pipe(
      select((state) => state.auth.error?.includes('credentials'))
    );
    this.emailSent$ = this.store.pipe(select((state) => state.auth.emailSent));
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnDestroy() {
    this.loginForm.reset();
    this.lastEmailUsed = '';
  }

  onSubmit() {
    this.lastEmailUsed = this.email?.value;
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
        return 'Adresa de email nu este corectă!';
      }
    }
    return 'Obligatoriu';
  }
  resendEmail() {
    if (this.lastEmailUsed === '') return;
    this.store.dispatch(
      authActions.emailRegisterStart({ email: this.lastEmailUsed })
    );
  }

  resetPassword() {
    if (this.lastEmailUsed === '') return;
    this.store.dispatch(
      authActions.emailPasswordStart({ email: this.lastEmailUsed })
    );
  }
}
