import { createAction, props } from '@ngrx/store';
import { IEditSelected, IRegister, IUser } from '../../auth/models/auth.model';

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

export const emailRegisterStart = createAction(
  '[Auth] Request new email start',
  props<{ email: string }>()
);

export const emailRegisterSuccess = createAction(
  '[Auth] Request new email success!'
);

export const emailRegisterFail = createAction(
  '[Auth] Request new email fail!',
  props<{ error: string }>()
);

export const emailPasswordStart = createAction(
  '[Auth] Email new password start',
  props<{ email: string }>()
);

export const emailPasswordSuccess = createAction(
  '[Auth] Email new password success!'
);

export const emailPasswordFail = createAction(
  '[Auth] Email new password fail!',
  props<{ error: string }>()
);

export const editPrincipalSuccess = createAction(
  '[Auth] Principal data changed!',
  props<{ request: IEditSelected }>()
);

export const saveRegisterToken = createAction(
  '[Auth] Save register token',
  props<{ token: string }>()
);
export const resetRegisterToken = createAction('[Auth] Reset register token');

export const refreshAuth = createAction('[Auth] Refresh Auth');

export const logout = createAction('[Auth] Logout');
