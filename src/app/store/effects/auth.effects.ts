import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap, switchMap } from 'rxjs/operators';
import { ILogin } from 'src/app/auth/models/auth.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnackbarService } from 'src/app/snackbar.service';
import * as AuthActions from '../actions/auth.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        return AuthActions.refreshAuth();
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      exhaustMap((action) =>
        this.authService.login({ ...action } as ILogin).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          tap(() => this.router.navigate(['/messages'])),
          catchError((error: HttpErrorResponse) => {
            return of(AuthActions.loginFail({ error: error.error }));
          })
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshAuth),
      switchMap(() => {
        return this.authService.refreshToken().pipe(
          map(({ jwtToken, ...user }) => {
            this.authService.saveJWT(jwtToken);
            return AuthActions.loginSuccess({ user });
          }),
          catchError((error) => {
            const currentUrl = this.router.routerState.snapshot.url;
            if (currentUrl.includes('/register?token=')) {
              this.router.navigate(['/register']);
              return of(
                AuthActions.saveRegisterToken({
                  token: currentUrl.replace('/register?token=', ''),
                })
              );
            }
            this.snackbarService.error(error.error);
            return of(AuthActions.logout());
          })
        );
      })
    )
  );

  emailRegisterToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.emailRegisterStart),
      exhaustMap((action) =>
        this.authService.requestEmail(action.email).pipe(
          map(() => AuthActions.emailRegisterSuccess()),
          catchError((error) =>
            of(AuthActions.emailRegisterFail({ error: error.error }))
          )
        )
      )
    )
  );

  emailPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.emailPasswordStart),
      exhaustMap((action) =>
        this.authService.requestPassword(action.email).pipe(
          map(() => AuthActions.emailPasswordSuccess()),
          catchError((error) =>
            of(AuthActions.emailPasswordFail({ error: error.error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}
}
