import { createAction, props } from '@ngrx/store';
import { IContact } from 'src/app/messages/models/messages.model';

export const receivedUsers = createAction(
  '[Auth] Ws Received Users',
  props<{ users: IContact[] }>()
);

export const receivedMessages = createAction(
  '[Auth] Ws Received Users',
  props<{ users: IContact[] }>()
);
