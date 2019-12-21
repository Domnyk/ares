import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://recipes-app-apsi.herokuapp.com',
  loginPath: '/auth',
  usersPath: '/users',
  token: 'my_fancy_token'
};
