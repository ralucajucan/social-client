import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IFullUser } from '../admin/admin.model';
import {
  ConfirmPasswordStateMatcher,
  distinctPasswordValidator,
} from '../auth/components/register/validator.directive';
import { IEditSelected, INewPassword } from '../auth/models/auth.model';
import {
  editSelectedStart,
  editSelectedWithIdStart,
  newPasswordStart,
} from '../store/actions/auth.actions';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() inputUser: IFullUser | null = null;
  @Input() isFromAdmin: boolean = false;
  email$: Observable<string>;
  firstName$: Observable<string>;
  lastName$: Observable<string>;
  birthDate$: Observable<string>;
  biography$: Observable<string>;
  isEditMode: boolean = false;
  hide: boolean = true;
  minBirthDate: Date;
  maxBirthDate: Date;
  selected: string = 'firstName';

  editForm = this.formbuilder.group(
    {
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      birthDate: ['', Validators.required],
      biography: [''],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
    },
    {
      validator: distinctPasswordValidator,
    } as AbstractControlOptions
  );

  editFormKeys = Object.keys(this.editForm.controls).filter(
    (control) => !['oldPassword', 'confirmPassword'].includes(control)
  );

  confirmPasswordStateMatcher = new ConfirmPasswordStateMatcher();

  get firstName() {
    return this.editForm.get('firstName');
  }
  get lastName() {
    return this.editForm.get('lastName');
  }
  get birthDate() {
    return this.editForm.get('birthDate');
  }
  get biography() {
    return this.editForm.get('biography');
  }
  get password() {
    return this.editForm.get('password');
  }
  get oldPassword() {
    return this.editForm.get('oldPassword');
  }
  get confirmPassword() {
    return this.editForm.get('confirmPassword');
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
    const currentYear = new Date().getFullYear();
    this.minBirthDate = new Date(currentYear - 120, 1, 1);
    this.maxBirthDate = new Date(currentYear - 12, 12, 31);
  }

  ngOnInit() {}

  switchView() {
    this.editForm.reset();
    this.isEditMode = !this.isEditMode;
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
    if (this.editForm.errors?.distinctPassword) {
      return 'Confirmarea parolei nu se potriveste.';
    }
    return '';
  }

  getEmailErrorMessage() {
    const email = this.editForm.get('email');
    if (email && email?.touched) {
      if (email.errors!['email']) {
        return 'Email invalid';
      }
    }
    return 'Obligatoriu';
  }

  private dispatchEdit(newEditSelected: IEditSelected) {
    if (this.isFromAdmin) {
      if (this.inputUser?.id) {
        this.store.dispatch(
          editSelectedWithIdStart({
            request: newEditSelected,
            id: this.inputUser.id,
          })
        );
      }
    } else {
      this.store.dispatch(editSelectedStart({ request: newEditSelected }));
    }
  }

  onSubmitEdit() {
    switch (this.selected) {
      case 'firstName': {
        if (
          this.firstName?.valid &&
          this.firstName?.value &&
          this.firstName.value.trim() !== ''
        ) {
          const newEditSelected: IEditSelected = {
            selected: this.selected,
            change: this.firstName.value,
          };
          this.dispatchEdit(newEditSelected);
        }
        break;
      }
      case 'lastName': {
        if (
          this.lastName?.valid &&
          this.lastName?.value &&
          this.lastName.value.trim() !== ''
        ) {
          const newEditSelected: IEditSelected = {
            selected: this.selected,
            change: this.lastName.value,
          };
          this.dispatchEdit(newEditSelected);
        }
        break;
      }
      case 'birthDate': {
        if (this.birthDate?.valid && this.birthDate?.value) {
          const newEditSelected: IEditSelected = {
            selected: this.selected,
            change: formatDate(this.birthDate.value, 'yyyy-MM-dd', 'en-US'),
          };
          this.dispatchEdit(newEditSelected);
        }
        break;
      }
      case 'biography': {
        const newEditSelected: IEditSelected = {
          selected: this.selected,
          change: this.biography?.value,
        };
        this.dispatchEdit(newEditSelected);
        break;
      }
      case 'password': {
        if (!this.editForm.errors?.distinctPassword) {
          this.confirmPassword?.disable();
          const newPasswordData: INewPassword = {
            ...this.editForm.value,
          };
          this.store.dispatch(newPasswordStart({ request: newPasswordData }));
        }
        this.confirmPassword?.enable();
        break;
      }
    }
    this.editForm.reset();
    this.editFormKeys.forEach((key) => {
      this.editForm.get(key)?.setErrors(null);
    });
  }
}
