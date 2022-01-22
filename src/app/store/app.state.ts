import { ActionReducerMap } from '@ngrx/store';
import { IUser } from '../auth/models/auth.model';
import {
  IContact,
  IMessage,
  INotification,
} from '../messages/models/messages.model';
import { authReducer } from './reducers/auth.reducer';
import { wsReducer } from './reducers/ws.reducer';

export interface AuthState extends IUser {
  error: string;
  emailSent: boolean;
}

export interface WsState {
  users: IContact[];
  notification: INotification[];
  selected: IContact;
  page: number;
  received: IMessage[];
  endOfMessages: boolean;
  error: string;
}

export interface AppState {
  auth: AuthState;
  ws: WsState;
}

export const AppReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  ws: wsReducer,
};
