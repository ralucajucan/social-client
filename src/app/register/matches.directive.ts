import { FormGroup } from '@angular/forms';

export function NoMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.noMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ noMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
