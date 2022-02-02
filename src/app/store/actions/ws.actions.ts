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
  props<{
    message: IMessage;
    notification: INotification | null;
    authEmail: string;
  }>()
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
  props<{ messages: IMessage[]; page: number; draft: IMessage | undefined }>()
);

export const loadNextPageStart = createAction(
  '[HTTP] Load next messages page start'
);

export const sendMessage = createAction(
  '[WS] Send message',
  props<{ message: SendDTO }>()
);

export const editMessageStart = createAction(
  '[Message] Edit message start',
  props<{ message: SendDTO; id: number }>()
);

export const editMessageSuccess = createAction(
  '[Message] Edit message success',
  props<{ message: IMessage }>()
);
export const editMessageFail = createAction(
  '[Message] Edit message fail',
  props<{ error: String }>()
);

export const removeAttachmentStart = createAction(
  '[Message] Remove attachment message start',
  props<{ attachmentId: string; messageId: number }>()
);

export const removeAttachmentSuccess = createAction(
  '[Message] Remove attachment message success',
  props<{ attachmentId: string; messageId: number }>()
);
export const removeAttachmentFail = createAction(
  '[Message] Remove attachment message fail',
  props<{ error: String }>()
);

export const removeMessageStart = createAction(
  '[Message] Remove message start',
  props<{ email: string; id: number }>()
);

export const removeMessageSuccess = createAction(
  '[Message] Remove message success',
  props<{ message: IMessage }>()
);
export const removeMessageFail = createAction(
  '[Message] Remove message fail',
  props<{ error: String }>()
);

export const saveDraft = createAction(
  '[WS] Save draft',
  props<{ message: SendDTO }>()
);

export const clearNotifications = createAction('[WS] Clear notifications');

export const disconnected = createAction('[WS] Disconnected');
