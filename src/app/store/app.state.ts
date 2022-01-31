import { ofType } from '@ngrx/effects';
import { Action, ActionReducerMap, on } from '@ngrx/store';
import {
  ActionSanitizer,
  StateSanitizer,
} from '@ngrx/store-devtools/src/config';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IFullUser } from '../admin/admin.model';
import { IUser } from '../auth/models/auth.model';
import {
  IContact,
  IFile,
  IMessage,
  INotification,
} from '../messages/models/messages.model';
import * as WsActions from './actions/ws.actions';
import { authReducer } from './reducers/auth.reducer';
import { userReducer } from './reducers/user.reducer';
import { wsReducer } from './reducers/ws.reducer';

export interface AuthState extends IUser {
  error: string;
  emailSent: boolean;
  token: string;
}

export interface WsState {
  users: IContact[];
  notification: INotification[];
  selected: IContact;
  page: number;
  received: IMessage[];
  endOfMessages: boolean;
  error: string;
  draft: IMessage;
}

export interface UserPageState {
  users: IFullUser[];
  totalPages: number;
  totalElements: number;
}

export interface AppState {
  auth: AuthState;
  ws: WsState;
  userPage: UserPageState;
}

export const AppReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  ws: wsReducer,
  userPage: userReducer,
};

// Application state or actions payloads are too large making Redux DevTools serialization slow and consuming a lot of memory.
// See https://git.io/fpcP5 on how to configure it.
export const actionSanitizer: ActionSanitizer = (action: Action) => {
  if (action.type === WsActions.loadPageSuccess.type) {
    let newAction = action as any;
    return {
      ...newAction,
      messages: newAction.messages.map((message: IMessage) => ({
        ...message,
        attachments: message.attachments?.map((attachment) => ({
          ...attachment,
          file: new Blob(),
        })),
      })),
      draft: newAction.draft
        ? {
            ...newAction.draft,
            attachments: newAction.draft.attachments?.map(
              (attachment: IFile) => ({
                ...attachment,
                file: new Blob(),
              })
            ),
          }
        : newAction.draft,
    };
  } else return action;
};

export const stateSanitizer: StateSanitizer = (state: AppState) => {
  if (state.ws.received.length || state.ws.draft.sender) {
    return {
      ...state,
      ws: {
        ...state.ws,
        received: state.ws.received?.map((message) => ({
          ...message,
          attachments: message.attachments?.map((attachment) => ({
            ...attachment,
            file: new Blob(),
          })),
        })),
        draft: state.ws.draft
          ? {
              ...state.ws.draft,
              attachments: state.ws.draft.attachments?.map(
                (attachment: IFile) => ({
                  ...attachment,
                  file: new Blob(),
                })
              ),
            }
          : state.ws.draft,
      },
    };
  }
  return state;
};
