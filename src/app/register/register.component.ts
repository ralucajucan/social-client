import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NoMatch } from './matches.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  minBirthDate: Date;
  maxBirthDate: Date;

  registerForm = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(25)]],
      repeatPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      birthDate: ['', Validators.required],
    },
    { validators: NoMatch('password', 'repeatPassword') }
  );
  hide: boolean = true;

  constructor(public formBuilder: FormBuilder) {
    const currentYear = new Date().getFullYear();
    this.minBirthDate = new Date(currentYear - 120, 1, 1);
    this.maxBirthDate = new Date(currentYear - 12, 12, 31);
  }

  ngOnInit() {}

  onSubmit() {}
}
