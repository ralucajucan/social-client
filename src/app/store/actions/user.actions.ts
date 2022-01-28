import { createAction, props } from '@ngrx/store';
import { IFullUser, IPageRequest } from 'src/app/admin/admin.model';
import {
  IEditResponse,
  IEditSelected,
  INewPassword,
} from 'src/app/auth/models/auth.model';
import { UserPageState } from '../app.state';

export const newPasswordStart = createAction(
  '[User] Request new password start',
  props<{ request: INewPassword }>()
);

export const newPasswordSuccess = createAction(
  '[User] Request new password success!'
);

export const newPasswordFail = createAction(
  '[User] Request new password fail!',
  props<{ error: string }>()
);

export const editSelectedStart = createAction(
  '[User] Edit selected start',
  props<{ request: IEditSelected }>()
);

export const editSelectedFail = createAction(
  '[User] Edit selected fail!',
  props<{ error: string }>()
);

export const editSelectedWithIdStart = createAction(
  '[User] Edit selected with id start',
  props<{ request: IEditSelected; id: number }>()
);

export const editSelectedWithIdSuccess = createAction(
  '[User] Edit selected with id success!',
  props<{ response: IEditResponse }>()
);

export const editSelectedWithIdFail = createAction(
  '[User] Edit selected with id fail!',
  props<{ error: string }>()
);

export const userPageLoadStart = createAction(
  '[Admin] Load users page start',
  props<{ request: IPageRequest }>()
);

export const userPageLoadSuccess = createAction(
  '[Admin] Load users page success',
  props<{ userPage: UserPageState }>()
);

export const userPageLoadFail = createAction(
  '[User] Load users page fail',
  props<{ error: string }>()
);
