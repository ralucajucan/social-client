import { state } from '@angular/animations';
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
  emailSent: false,
  token: '',
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginStart, () => ({ ...initialState })),
  on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, ...user })),
  on(AuthActions.loginFail, (state, { error }) => ({ ...state, error: error })),
  on(AuthActions.logout, (state) => ({ ...state, ...initialState })),
  on(AuthActions.emailRegisterStart, () => ({
    ...initialState,
  })),
  on(AuthActions.emailRegisterSuccess, (state) => ({
    ...state,
    emailSent: true,
  })),
  on(AuthActions.emailRegisterFail, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(AuthActions.emailPasswordStart, () => ({
    ...initialState,
  })),
  on(AuthActions.emailPasswordSuccess, (state) => ({
    ...state,
    emailSent: true,
  })),
  on(AuthActions.emailPasswordFail, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(AuthActions.editPrincipalSuccess, (state, { request }) => ({
    ...state,
    [request.selected]: request.change,
  })),
  on(AuthActions.saveRegisterToken, (state, { token }) => ({
    ...state,
    token,
  })),
  on(AuthActions.saveRegisterToken, (state, initialState) => ({
    ...state,
    token: initialState.token,
  }))
);
