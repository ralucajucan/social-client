import { createReducer, on } from '@ngrx/store';
import { WsState } from '../app.state';
import * as WsActions from '../actions/ws.actions';

export const initialState: WsState = {
  users: [],
};

export const wsReducer = createReducer(
  initialState,
  on(WsActions.receivedUsers, (state, { users }) => ({
    ...state,
    users: users,
  }))
);
