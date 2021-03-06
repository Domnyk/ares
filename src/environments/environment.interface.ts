export interface Environment {
  production: boolean;
  apiUrl: string;
  loginPath: string;
  usersPath: string;
  ingredientsPath: string;
  categoriesPath: string;
  searchPath: string;
  token?: string;
}
