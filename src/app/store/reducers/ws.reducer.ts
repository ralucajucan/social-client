import { createReducer, on } from '@ngrx/store';
import { WsState } from '../app.state';
import * as WsActions from '../actions/ws.actions';
import { userPageLoadFail } from '../actions/user.actions';

export const initialState: WsState = {
  users: [],
  notification: [],
  selected: {
    name: '',
    email: '',
    online: false,
    newMessages: 0,
  },
  page: 0,
  received: [],
  endOfMessages: true,
  error: '',
  draft: {
    id: 0,
    sender: '',
    receiver: '',
    text: '',
    attachmentIds: '',
    attachments: [],
    status: 'DRAFT',
    edited: false,
    createdOn: '',
    updatedOn: '',
  },
};

export const wsReducer = createReducer(
  initialState,
  on(WsActions.receivedError, (state, { text }) => ({
    ...state,
    error: text,
  })),
  on(WsActions.receivedUsers, (state, { users }) => ({
    ...state,
    users: users.map((user) =>
      user.newMessages === -1
        ? {
            ...user,
            newMessages:
              state.users.find((u) => u.email === user.email)?.newMessages || 0,
          }
        : { ...user }
    ),
    error: '',
  })),
  on(
    WsActions.receivedMessage,
    (state, { message, notification, authEmail }) => ({
      ...state,
      users: state.users.map((user) => {
        if (user.email === message.sender && message.sender !== authEmail) {
          let newUser = { ...user };
          newUser.newMessages += 1;
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
    })
  ),
  on(WsActions.select, (state, { selection }) => ({
    ...state,
    users: state.users.map((user) =>
      user.email === selection.email ? { ...user, newMessages: 0 } : { ...user }
    ),
    selected: { ...selection, newMessages: 0 },
    page: 0,
    received: initialState.received,
    endOfMessages: true,
  })),
  on(WsActions.loadPageSuccess, (state, { messages, page, draft }) => ({
    ...state,
    page: page,
    received: messages.slice().reverse().concat(state.received),
    endOfMessages: messages.length < 10 ? true : false,
    draft: draft || state.draft,
  })),
  on(WsActions.editMessageSuccess, (state, { message }) => ({
    ...state,
    received: state.received.map((current) =>
      current.id === message.id ? { ...message } : { ...current }
    ),
  })),
  on(
    WsActions.removeAttachmentSuccess,
    (state, { attachmentId, messageId }) => ({
      ...state,
      received: state.received.map((current) =>
        current.id === messageId
          ? {
              ...current,
              attachments: current.attachments.filter(
                (a) => a.id !== attachmentId
              ),
            }
          : { ...current }
      ),
    })
  ),
  on(WsActions.clearNotifications, (state) => ({ ...state, notification: [] })),
  on(WsActions.disconnected, () => ({ ...initialState }))
);
