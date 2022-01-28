import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { UserService } from 'src/app/profile/user.service';
import { SnackbarService } from 'src/app/snackbar.service';
import { editPrincipalSuccess } from '../actions/auth.actions';
import * as UserActions from '../actions/user.actions';
import { AppState } from '../app.state';

@Injectable()
export class UserEffects {
  newPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.newPasswordStart),
      concatLatestFrom((action) =>
        this.store.pipe(select((state) => state.auth.id))
      ),
      exhaustMap(([action, id]) =>
        this.userService.changePassword(action.request, id).pipe(
          map(() => {
            this.snackbarService.success('Parola salvata cu success!');
            return UserActions.newPasswordSuccess();
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return of(UserActions.newPasswordFail({ error: error.error }));
          })
        )
      )
    )
  );

  changeSelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.editSelectedStart),
      concatLatestFrom((action) =>
        this.store.pipe(select((state) => state.auth.id))
      ),
      exhaustMap(([action, id]) =>
        this.userService.changeSelected(action.request, id).pipe(
          map((request) => {
            this.snackbarService.success('Modificare salvata cu success!');
            return editPrincipalSuccess({ request });
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return of(UserActions.editSelectedFail({ error: error.error }));
          })
        )
      )
    )
  );

  changeSelectedWithId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.editSelectedWithIdStart),
      exhaustMap((action) =>
        this.userService.changeSelected(action.request, action.id).pipe(
          map((response) => {
            this.snackbarService.success(`Modificat cu success utilizatorul!`);
            return UserActions.editSelectedWithIdSuccess({
              response,
            });
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return of(
              UserActions.editSelectedWithIdFail({ error: error.error })
            );
          })
        )
      )
    )
  );
  loadUserPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.userPageLoadStart),
      exhaustMap((action) =>
        this.userService.getUserPage(action.request).pipe(
          map((userPage) => {
            return UserActions.userPageLoadSuccess({ userPage });
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return of(UserActions.userPageLoadFail({ error: error.error }));
          })
        )
      )
    )
  );
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private store: Store<AppState>
  ) {}
}
