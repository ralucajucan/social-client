import { createAction, props } from '@ngrx/store';
import { IContact, IMessage } from 'src/app/messages/models/messages.model';

export const connectionOpen = createAction('[WS] Connection Open');

export const receivedUsers = createAction(
  '[WS] Received Users',
  props<{ users: IContact[] }>()
);

export const receivedMessage = createAction(
  '[WS] Received Message',
  props<{ message: IMessage }>()
);

export const receivedError = createAction(
  '[WS] Received Error',
  props<{ text: string }>()
);

export const disconnected = createAction('[Ws] Disconnected');
