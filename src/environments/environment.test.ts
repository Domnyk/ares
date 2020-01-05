import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://recipes-app-apsi.herokuapp.com',
  loginPath: '/auth',
  usersPath: '/users',
  ingredientsPath: '/ingredients',
  categoriesPath: '/categories',
  searchPath: '/search',
  token: 'my_fancy_token'
};
