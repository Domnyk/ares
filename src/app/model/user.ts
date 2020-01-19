import {Recipe} from './recipe';

export interface User {
  basic_info: {
    username: string,
    password: string,
    surname: string,
    name: string,
    email: string
  };
  nickname: string;
  bio: string;
  favourite_recipes?: Recipe[];
  recommended_recipes?: Recipe[];
  my_recipes?: Recipe[];
}
