export interface IUser {
  userId: number;
  email: string;
  role: string;
}

export interface ILoginResponse extends IUser {
  jwtToken: string;
  refreshToken: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface JWTResponse {
  token: string;
}
