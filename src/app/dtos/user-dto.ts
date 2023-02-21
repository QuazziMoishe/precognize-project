export interface UserDto {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  creationDate?: number;
  token: string;
  role: 'user' | 'admin';
}
