import { createAction, props } from '@ngrx/store';
import {
  IEditSelected,
  INewPassword,
  IUser,
} from '../../auth/models/auth.model';

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

export const newPasswordStart = createAction(
  '[Auth] Request new password start',
  props<{ request: INewPassword }>()
);

export const newPasswordSuccess = createAction(
  '[Auth] Request new password success!'
);

export const newPasswordFail = createAction(
  '[Auth] Request new password fail!',
  props<{ error: string }>()
);

export const editSelectedStart = createAction(
  '[Auth] Edit selected start',
  props<{ request: IEditSelected }>()
);

export const editSelectedSuccess = createAction(
  '[Auth] Edit selected success!',
  props<{ request: IEditSelected }>()
);

export const editSelectedFail = createAction(
  '[Auth] Edit selected fail!',
  props<{ error: string }>()
);

export const editSelectedWithIdStart = createAction(
  '[Auth] Edit selected start',
  props<{ request: IEditSelected; id: number }>()
);

export const editSelectedWithIdSuccess = createAction(
  '[Auth] Edit selected success!',
  props<{ request: IEditSelected }>()
);

export const editSelectedWithIdFail = createAction(
  '[Auth] Edit selected fail!',
  props<{ error: string }>()
);

export const refreshAuth = createAction('[Auth] Refresh Auth');

export const logout = createAction('[Auth] Logout');
