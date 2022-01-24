import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Actions,
  concatLatestFrom,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { RxStompService } from '@stomp/ng2-stompjs';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap, switchMap } from 'rxjs/operators';
import { ILogin } from 'src/app/auth/models/auth.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnackbarService } from 'src/app/snackbar.service';
import * as AuthActions from '../actions/auth.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { AppState } from '../app.state';

@Injectable()
export class AuthEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => AuthActions.refreshAuth())
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
      switchMap(() =>
        this.authService.refreshToken().pipe(
          map(({ jwtToken, ...user }) => {
            this.authService.saveJWT(jwtToken);
            return AuthActions.loginSuccess({ user });
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return of(AuthActions.logout());
          })
        )
      )
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

  newPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.newPasswordStart),
      concatLatestFrom((action) =>
        this.store.pipe(select((state) => state.auth.id))
      ),
      exhaustMap(([action, id]) =>
        this.authService.changePassword(action.request, id).pipe(
          map(() => {
            this.snackbarService.success('Parola salvata cu success!');
            return AuthActions.newPasswordSuccess();
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return of(AuthActions.newPasswordFail({ error: error.error }));
          })
        )
      )
    )
  );

  changeSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.editSelectedStart),
      concatLatestFrom((action) =>
        this.store.pipe(select((state) => state.auth.id))
      ),
      exhaustMap(([action, id]) =>
        this.authService.changeSelected(action.request, id).pipe(
          map((request) => {
            this.snackbarService.success('Modificare salvata cu success!');
            return AuthActions.editSelectedSuccess({ request });
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return of(AuthActions.editSelectedFail({ error: error.error }));
          })
        )
      )
    )
  );

  changeSelectedWithId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.editSelectedWithIdStart),
      exhaustMap((action) =>
        this.authService.changeSelected(action.request, action.id).pipe(
          map((request) => {
            this.snackbarService.success(`Modificat cu success utilizatorul!`);
            return AuthActions.editSelectedWithIdSuccess({ request });
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return of(
              AuthActions.editSelectedWithIdFail({ error: error.error })
            );
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private rxStompService: RxStompService,
    private router: Router,
    private store: Store<AppState>
  ) {}
}
