export interface User {
  basicInfo: {
    username: string,
    password: string,
    surname: string,
    name: string,
    email: string
  };
  nickname: string;
  bio: string;
  favouriteRecipes: number[];
}
