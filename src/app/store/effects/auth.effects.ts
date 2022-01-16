import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { Message } from '@stomp/stompjs';
import { RxStompService } from '@stomp/ng2-stompjs';
import { EMPTY, of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { ILogin, IUser } from 'src/app/auth/models/auth.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SnackbarService } from 'src/app/snackbar.service';
import * as AuthActions from '../actions/auth.actions';
import * as WsActions from '../actions/ws.actions';
import { IContact } from 'src/app/messages/models/messages.model';

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
          catchError((error) => {
            this.snackbarService.error(error.error);
            AuthActions.loginFail({ ...error.error });
            return EMPTY;
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
      exhaustMap(() =>
        this.authService.refreshToken().pipe(
          map(({ jwtToken, ...user }) => {
            this.authService.saveJWT(jwtToken);
            return AuthActions.loginSuccess({ user });
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            // this.authService.logout();
            // this.router.navigate(['/login']);
            return of(AuthActions.logout());
          })
        )
      )
    )
  );

  // loginSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.loginSuccess),
  //     exhaustMap(() =>
  //       this.rxStompService.watch('/user/queue/list').pipe(
  //         map((message: Message) => {
  //           return WsActions.receivedUsers({
  //             users: JSON.parse(message.body) as IContact[],
  //           });
  //         })
  //       )
  //     )
  //   )
  // );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private rxStompService: RxStompService,
    private router: Router
  ) {}
}
