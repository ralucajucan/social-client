import { createReducer, on } from '@ngrx/store';
import { registerStart } from '../actions/auth.actions';

export interface IAuthState {
  authError: string;
  loading: boolean;
}

export const initialAuthState = {
  authError: '',
  loading: false,
};

export const authReducer = createReducer(
  initialAuthState,
  on(registerStart, (state) => ({ ...state, loading: true }))
);
