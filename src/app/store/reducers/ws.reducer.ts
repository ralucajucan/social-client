import { createReducer, on } from '@ngrx/store';
import { WsState } from '../app.state';
import * as WsActions from '../actions/ws.actions';

export const initialState: WsState = {
  users: [],
  notification: [],
  selected: {
    name: '',
    email: '',
    online: false,
    received: 0,
  },
  page: 0,
  received: [],
  endOfMessages: true,
  error: '',
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
  on(WsActions.receivedMessage, (state, { message, notification }) => ({
    ...state,
    users: state.users.map((user) => {
      if (user.email === message.sender) {
        let newUser = { ...user };
        newUser.received += 1;
        return newUser;
      }
      return user;
    }),
    notification: notification
      ? state.notification.concat([
          {
            ...notification,
            sender: state.users.find((user) => user.email === message.sender)!
              .name,
          },
        ])
      : state.notification,
    received:
      message.sender === state.selected.email ||
      message.receiver === state.selected.email
        ? state.received.concat(message)
        : state.received,
  })),
  on(WsActions.select, (state, { selection }) => ({
    ...state,
    selected: selection,
    page: 0,
    received: initialState.received,
    endOfMessages: true,
  })),
  on(WsActions.loadPageSuccess, (state, { messages, page }) => ({
    ...state,
    page: page,
    received: messages.slice().reverse().concat(state.received),
    endOfMessages: messages.length < 10 ? true : false,
  })),
  on(WsActions.clearNotifications, (state) => ({ ...state, notification: [] })),
  on(WsActions.disconnected, () => ({ ...initialState }))
);
