import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RxStompService } from '@stomp/ng2-stompjs';
import { exhaustMap, map, takeUntil } from 'rxjs/operators';
import { IContact } from 'src/app/messages/models/messages.model';
import { loginSuccess, logout } from '../actions/auth.actions';
import { Message } from '@stomp/stompjs';
import * as WsActions from '../actions/ws.actions';
import { of } from 'rxjs';

@Injectable()
export class WsEffects {
  initUsersLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      takeUntil(this.actions$.pipe(ofType(logout))),
      exhaustMap(() =>
        this.rxStompService.watch('/user/queue/list').pipe(
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
      takeUntil(this.actions$.pipe(ofType(logout))),
      exhaustMap(() => {
        this.rxStompService.publish({
          destination: '/api/refresh-connected',
        });
        return this.rxStompService.watch('/user/queue/conv').pipe(
          map((message: Message) => {
            return WsActions.receivedUsers({
              users: JSON.parse(message.body) as IContact[],
            });
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private rxStompService: RxStompService
  ) {}
}
