export interface IBasicUser {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  biography: string;
}

export interface IJwt extends IUser {
  jwtToken: string;
}

export interface IAuth extends IJwt {
  refreshToken: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister extends ILogin {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface INewPassword {
  oldPassword: string;
  password: string;
}

export interface IEditSelected {
  selected: string;
  change: string;
}
