export interface CurrentUser {
  id: number;
  username: string;
  token: string;
}

export interface CurrentUserDto {
  id: number;
  basic_info: {
    username: string;
    email: string;
  };
  favourite_recipes: Array<{ id: number }>;
  top_rated_recipes: Array<{ id: number }>;
  recommended_recipes: Array<{ id: number }>;
  nickname: string;
  bio: string;
}
