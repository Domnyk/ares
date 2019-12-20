import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://recipes-app-apsi.herokuapp.com',
  loginPath: '/auth',
  usersPath: '/users'
};
