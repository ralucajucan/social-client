import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { RxStompService } from '@stomp/ng2-stompjs';
import {
  catchError,
  distinctUntilChanged,
  exhaustMap,
  map,
  tap,
} from 'rxjs/operators';
import {
  IContact,
  IMessage,
  INotification,
} from 'src/app/messages/models/messages.model';
import * as AuthActions from '../actions/auth.actions';
import { IFrame, Message } from '@stomp/stompjs';
import * as WsActions from '../actions/ws.actions';
import { EMPTY, of } from 'rxjs';
import { SnackbarService } from 'src/app/snackbar.service';
import { AppState } from '../app.state';
import { select, Store } from '@ngrx/store';
import { MessagesService } from 'src/app/messages/services/messages.service';

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

  sendMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WsActions.sendMessage),
        tap(({ message }) => {
          this.rxStompService.publish({
            destination: '/api/message',
            body: JSON.stringify(message),
          });
        })
      ),
    { dispatch: false }
  );

  initErrorLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      exhaustMap(() =>
        this.rxStompService.stompErrors$.pipe(
          map((frame: IFrame) => {
            const errorMessage = frame.headers['message'];
            if (errorMessage.includes('jsonwebtoken.ExpiredJwtException')) {
              return AuthActions.refreshAuth();
            } else {
              return WsActions.receivedError({
                text: frame.headers['message'],
              });
            }
          })
        )
      )
    )
  );

  initStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
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
      ofType(AuthActions.loginSuccess),
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
      ofType(AuthActions.loginSuccess),
      exhaustMap(() =>
        this.rxStompService.watch('/user/queue/conv').pipe(
          concatLatestFrom((action) =>
            this.store.pipe(select((state) => state.auth.email))
          ),
          map(([message, authEmail]) => {
            const msg = JSON.parse(message.body) as IMessage;
            let notif: INotification | null = null;
            if (authEmail !== msg.sender) {
              notif = {
                sender: msg.sender,
                text: msg.text,
                attachments: JSON.stringify(msg.attachments),
              };
            }
            return WsActions.receivedMessage({
              message: msg,
              notification: notif,
            });
          })
        )
      )
    )
  );

  updateAsReceived$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WsActions.receivedMessage),
        tap((message) =>
          this.rxStompService.publish({
            destination: '/api/update-message',
            body: JSON.stringify(message),
          })
        )
      ),
    { dispatch: false }
  );

  onLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() => of(WsActions.disconnected()))
    )
  );

  onChangeSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WsActions.select),
      concatLatestFrom((action) =>
        this.store.pipe(select((state) => state.ws.page))
      ),
      exhaustMap(([action, page]) =>
        this.messagesService.getConversation(action.selection.email, page).pipe(
          map((msgs: IMessage[]) => {
            return WsActions.loadPageSuccess({
              messages: msgs,
              page: page + 1,
            });
          }),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return EMPTY;
          })
        )
      )
    )
  );

  onPageRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WsActions.loadNextPageStart),
      concatLatestFrom((action) => [
        this.store.pipe(select((state) => state.ws.selected.email)),
        this.store.pipe(select((state) => state.ws.page)),
      ]),
      exhaustMap(([action, email, page]) =>
        this.messagesService.getConversation(email, page).pipe(
          map((msgs: IMessage[]) =>
            WsActions.loadPageSuccess({ messages: msgs, page: page + 1 })
          ),
          catchError((error) => {
            this.snackbarService.error(error.error);
            return EMPTY;
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private rxStompService: RxStompService,
    private snackbarService: SnackbarService,
    private messagesService: MessagesService,
    private store: Store<AppState>
  ) {}
}
