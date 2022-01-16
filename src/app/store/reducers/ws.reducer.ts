import { createReducer, on } from '@ngrx/store';
import { WsState } from '../app.state';
import * as WsActions from '../actions/ws.actions';
import { IContact, IMessage } from 'src/app/messages/models/messages.model';

export const initialState: WsState = {
  users: [],
  error: '',
};

const mapMessageToUser = (users: IContact[], message: IMessage) => {
  const senderIndex = users.findIndex((user) => user.email === message.sender);
  users[senderIndex].newMessages = users[senderIndex].newMessages + 1;
  return { ...users };
};

export const wsReducer = createReducer(
  initialState,
  on(WsActions.receivedError, (state, { text }) => ({
    ...state,
    error: text,
  })),
  on(WsActions.receivedUsers, (state, { users }) => ({
    ...state,
    users: users,
    error: '',
  })),
  on(WsActions.receivedMessage, (state, { message }) => ({
    ...state,
    users: mapMessageToUser(state.users, message),
  })),
  on(WsActions.disconnected, () => ({ ...initialState }))
);
