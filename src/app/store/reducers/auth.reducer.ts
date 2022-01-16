import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { AuthState } from '../app.state';

export const initialState: AuthState = {
  id: 0,
  email: '',
  role: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  biography: '',
  error: '',
  // users: [],
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginStart, (state) => ({ ...state, error: '' })),
  on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, ...user })),
  on(AuthActions.logout, (state) => ({ ...state, ...initialState })),
  on(AuthActions.loginFail, (state, { error }) => ({ ...state, error: error }))
  // on(AuthActions.receivedUsers, (state, { users }) => ({
  //   ...state,
  //   users: users,
  // }))
);
