import { createReducer, on } from '@ngrx/store';
import { UserPageState } from '../app.state';
import * as UserActions from '../actions/user.actions';

export const initialState: UserPageState = {
  users: [],
  totalPages: 0,
  totalElements: 0,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.userPageLoadSuccess, (state, { userPage }) => ({
    ...state,
    ...userPage,
  })),
  on(UserActions.editSelectedWithIdSuccess, (state, { response }) => ({
    ...state,
    users: state.users.map((user) =>
      user.id === response.id
        ? { ...user, [response.selected]: response.change }
        : user
    ),
  }))
);
