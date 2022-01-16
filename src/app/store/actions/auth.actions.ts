import { createAction, props } from '@ngrx/store';
import { IContact } from 'src/app/messages/models/messages.model';
import { IUser } from '../../auth/models/auth.model';

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: IUser }>()
);

export const loginFail = createAction(
  '[Auth] Login Fail',
  props<{ error: string }>()
);

// export const receivedUsers = createAction(
//   '[Auth] Ws Received Users',
//   props<{ users: IContact[] }>()
// );

export const refreshAuth = createAction('[Auth] Refresh Auth');

export const logout = createAction('[Auth] Logout');
