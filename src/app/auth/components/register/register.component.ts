import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  ConfirmPasswordStateMatcher,
  distinctPasswordValidator,
} from './validator.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  minBirthDate: Date;
  maxBirthDate: Date;

  registerForm = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      birthDate: ['', Validators.required],
    },
    {
      validator: distinctPasswordValidator,
    } as AbstractControlOptions
  );
  confirmPasswordStateMatcher = new ConfirmPasswordStateMatcher();
  hide: boolean = true;

  constructor(public formBuilder: FormBuilder) {
    const currentYear = new Date().getFullYear();
    this.minBirthDate = new Date(currentYear - 120, 1, 1);
    this.maxBirthDate = new Date(currentYear - 12, 12, 31);
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  ngOnDestroy() {
    this.registerForm.reset();
  }

  onSubmit() {
    console.log(this.registerForm);
  }

  getPasswordErrorMessage() {
    const passwordErrors = this.password?.errors;

    if (passwordErrors?.['required']) {
      return 'Obligatoriu';
    }

    if (passwordErrors?.['minlength']) {
      return 'Minim 6 caractere';
    }

    return '';
  }

  getConfirmPasswordErrorMessage() {
    if (this.registerForm.errors?.distinctPassword) {
      return 'Confirmarea parolei nu se potriveste.';
    }
    return '???';
  }
}
