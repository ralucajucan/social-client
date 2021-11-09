import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.loginForm.reset();
  }

  onSubmit() {
    console.log(this.loginForm);
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
