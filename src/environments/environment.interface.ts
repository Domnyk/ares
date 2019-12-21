export interface Environment {
  production: boolean;
  apiUrl: string;
  loginPath: string;
  usersPath: string;
  token?: string;
}
