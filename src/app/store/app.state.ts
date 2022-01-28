import { ActionReducerMap } from '@ngrx/store';
import { IFullUser } from '../admin/admin.model';
import { IUser } from '../auth/models/auth.model';
import {
  IContact,
  IMessage,
  INotification,
} from '../messages/models/messages.model';
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
