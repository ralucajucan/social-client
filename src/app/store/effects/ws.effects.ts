import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RxStompService } from '@stomp/ng2-stompjs';
import {
  distinctUntilChanged,
  exhaustMap,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { IContact, IMessage } from 'src/app/messages/models/messages.model';
import { loginSuccess, logout } from '../actions/auth.actions';
import { IFrame, Message } from '@stomp/stompjs';
import * as WsActions from '../actions/ws.actions';
import { of } from 'rxjs';
import { SnackbarService } from 'src/app/snackbar.service';

@Injectable()
export class WsEffects {
  requestInitUsers$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WsActions.connectionOpen),
        tap(() =>
          this.rxStompService.publish({
            destination: '/api/refresh-connected',
          })
        )
      ),
    { dispatch: false }
  );

  initErrorLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      exhaustMap(() =>
        this.rxStompService.stompErrors$.pipe(
          map((frame: IFrame) => {
            this.snackbarService.error(frame.headers['message']);
            return WsActions.receivedError({ text: frame.headers['message'] });
          })
        )
      )
    )
  );

  initStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      exhaustMap(() =>
        this.rxStompService.connected$.pipe(
          map(() => {
            return WsActions.connectionOpen();
          })
        )
      )
    )
  );

  initUsersLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      exhaustMap(() =>
        this.rxStompService.watch('/user/queue/list').pipe(
          distinctUntilChanged(),
          map((message: Message) => {
            return WsActions.receivedUsers({
              users: JSON.parse(message.body) as IContact[],
            });
          })
        )
      )
    )
  );

  initMessagesLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      exhaustMap(() =>
        this.rxStompService.watch('/user/queue/conv').pipe(
          map((message: Message) => {
            return WsActions.receivedMessage({
              message: JSON.parse(message.body) as IMessage,
            });
          })
        )
      )
    )
  );

  onLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() => of(WsActions.disconnected()))
    )
  );

  constructor(
    private actions$: Actions,
    private rxStompService: RxStompService,
    private snackbarService: SnackbarService
  ) {}
}
