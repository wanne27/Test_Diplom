import { UserRoles } from './UserRoles';

export interface User {
  id?: string;
  email: string;
  name: string;
  token: string;
  roles?: UserRoles[];
  role?: any;
}
export interface UserResponse {
  access_token: 'string';
  expires_in: number;
  scope: 'recruitify_api';
  token_type: string;
}

export interface UserData {
  email: string;
  password: string;
}
