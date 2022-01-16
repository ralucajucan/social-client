import { ActionReducerMap } from '@ngrx/store';
import { IUser } from '../auth/models/auth.model';
import { IContact } from '../messages/models/messages.model';
import { authReducer } from './reducers/auth.reducer';
import { wsReducer } from './reducers/ws.reducer';

export interface AuthState extends IUser {
  error: string;
}

export interface WsState {
  users: IContact[];
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
