import { createAction } from '@ngrx/store';

export const registerStart = createAction(
  '[Auth] Register Start',
  (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: Date;
    birthDate: boolean;
  }) => ({ payload })
);
export const registerStop = createAction('[Auth] Register Stop');
export const registerError = createAction('[Auth] Register Error');
export const clearError = createAction('[Auth] Clear Error');
