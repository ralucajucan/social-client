import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackbarClass } from 'src/snackbar.models';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  private openSnackBar(message: string, action: string, panelClass: string) {
    this._snackBar.open(message, action, {
      duration: 10000,
      panelClass: panelClass,
    });
  }

  public error(error: string) {
    this.openSnackBar(error, 'FAIL', snackbarClass.errorSnackbar);
  }

  public success(message: string) {
    this.openSnackBar(message, 'SUCCESS', snackbarClass.successSnackbar);
  }

  public info(message: string) {
    this.openSnackBar(message, 'INFO', snackbarClass.infoSnackbar);
  }

  public warn(message: string) {
    this.openSnackBar(message, 'WARN', snackbarClass.warnSnackbar);
  }
}
