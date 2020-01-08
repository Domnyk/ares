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
}
