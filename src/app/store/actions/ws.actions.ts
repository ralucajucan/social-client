import { createAction, props } from '@ngrx/store';
import {
  IContact,
  IMessage,
  INotification,
  SendDTO,
} from 'src/app/messages/models/messages.model';

export const connectionOpen = createAction('[WS] Connection Open');

export const receivedUsers = createAction(
  '[WS] Received Users',
  props<{ users: IContact[] }>()
);

export const receivedMessage = createAction(
  '[WS] Received Message',
  props<{ message: IMessage; notification: INotification | null }>()
);

export const receivedError = createAction(
  '[WS] Received Error',
  props<{ text: string }>()
);

export const select = createAction(
  '[WS] Select contact',
  props<{ selection: IContact }>()
);

export const loadPageSuccess = createAction(
  '[HTTP] Load messages page success',
  props<{ messages: IMessage[]; page: number }>()
);

export const loadNextPageStart = createAction(
  '[HTTP] Load next messages page start'
);

export const sendMessage = createAction(
  '[Ws] Send message',
  props<{ message: SendDTO }>()
);

export const clearNotifications = createAction('[WS] Clear notifications');

export const disconnected = createAction('[Ws] Disconnected');
