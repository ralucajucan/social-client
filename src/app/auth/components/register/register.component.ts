import { formatDate } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { IRegister } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import {
  ConfirmPasswordStateMatcher,
  distinctPasswordValidator,
} from './validator.directive';
import { SnackbarService } from 'src/app/snackbar.service';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { catchError, first, take, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { EMPTY, Subscription } from 'rxjs';
import { resetRegisterToken } from 'src/app/store/actions/auth.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  minBirthDate: Date;
  maxBirthDate: Date;
  @ViewChild('stepper') private myStepper: MatStepper | undefined;

  registerForm = this.formBuilder.group(
    {
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
      birthDate: ['', Validators.required],
    },
    {
      validator: distinctPasswordValidator,
    } as AbstractControlOptions
  );
  confirmPasswordStateMatcher = new ConfirmPasswordStateMatcher();
  hide: boolean = true;
  tokenSubscription: Subscription;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef
  ) {
    const currentYear = new Date().getFullYear();
    this.minBirthDate = new Date(currentYear - 120, 1, 1);
    this.maxBirthDate = new Date(currentYear - 12, 12, 31);
    this.tokenSubscription = this.store
      .pipe(select((state) => state.auth.token))
      .subscribe((token) => {
        if (token && token !== '') {
          this.authService
            .activateFromEmail(token)
            .pipe(tap())
            .subscribe(
              () => {
                this.myStepper!.next();
                this.myStepper!.next();
                this.store.dispatch(resetRegisterToken());
              },
              (error) => {
                this.snackbarService.error(error.error);
              }
            );
        }
      });
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

  get birthDate() {
    return this.registerForm.get('birthDate');
  }

  ngOnDestroy() {
    this.registerForm.reset();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.confirmPassword?.disable();
      const registerData: IRegister = {
        ...this.registerForm.value,
        birthDate: formatDate(this.birthDate?.value, 'yyyy-MM-dd', 'en-US'),
      };

      this.authService.register(registerData).subscribe(
        (data) => {
          this.myStepper?.next();
          this.snackbarService.success('Registration success!');
        },
        (error) => {
          this.snackbarService.error(error.error);
        }
      );
    }
    this.confirmPassword?.enable();
    this.registerForm.reset();
    Object.keys(this.registerForm.controls).forEach((key) => {
      this.registerForm.get(key)?.setErrors(null);
    });
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
    return '';
  }

  getEmailErrorMessage() {
    const emailErrors = this.email?.errors;
    if (emailErrors?.['email']) {
      return 'Adresa de email nu este corectă!';
    }
    return 'Obligatoriu';
  }
}
