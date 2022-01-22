import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  ConfirmPasswordStateMatcher,
  distinctPasswordValidator,
} from '../auth/components/register/validator.directive';
import { INewPassword } from '../auth/models/auth.model';
import { newPasswordStart } from '../store/actions/auth.actions';
import { AppState } from '../store/app.state';

enum EView {
  'view',
  'user',
  'password',
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  email$: Observable<string>;
  firstName$: Observable<string>;
  lastName$: Observable<string>;
  birthDate$: Observable<string>;
  biography$: Observable<string>;
  eView = EView;
  profileView: EView = EView.view;
  hide: boolean = true;

  userForm = this.formbuilder.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', Validators.required],
  });

  passwordForm = this.formbuilder.group(
    {
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
    },
    {
      validator: distinctPasswordValidator,
    } as AbstractControlOptions
  );
  confirmPasswordStateMatcher = new ConfirmPasswordStateMatcher();

  get password() {
    return this.passwordForm.get('password');
  }

  get oldPassword() {
    return this.passwordForm.get('oldPassword');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  constructor(
    private store: Store<AppState>,
    private formbuilder: FormBuilder
  ) {
    this.email$ = this.store.pipe(select((state) => state.auth.email)) || '';
    this.firstName$ =
      this.store.pipe(select((state) => state.auth.firstName)) || '';
    this.lastName$ =
      this.store.pipe(select((state) => state.auth.lastName)) || '';
    this.birthDate$ =
      this.store.pipe(select((state) => state.auth.birthDate)) || '';
    this.biography$ =
      this.store.pipe(select((state) => state.auth.biography)) || '';
  }

  ngOnInit() {}

  switchView(view: EView) {
    this.userForm.reset();
    this.passwordForm.reset();
    this.profileView = view;
  }

  getPasswordErrorMessage(errors: ValidationErrors | null | undefined) {
    if (errors?.['required']) {
      return 'Obligatoriu';
    }

    if (errors?.['minlength']) {
      return 'Minim 6 caractere';
    }

    return '';
  }

  getConfirmPasswordErrorMessage() {
    if (this.passwordForm.errors?.distinctPassword) {
      return 'Confirmarea parolei nu se potriveste.';
    }
    return '';
  }

  onSubmitPassword() {
    if (this.passwordForm.valid) {
      this.confirmPassword?.disable();
      const newPasswordData: INewPassword = {
        ...this.passwordForm.value,
      };
      this.store.dispatch(newPasswordStart({ request: newPasswordData }));
    }
    this.confirmPassword?.enable();
    this.passwordForm.reset();
  }

  onSubmitUser() {}
}
