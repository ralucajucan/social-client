export interface IPageRequest {
  page: number;
  count: number;
}

export interface IFullUser {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  locked: boolean;
  firstName: string;
  lastName: string;
  birthDate: string;
}
