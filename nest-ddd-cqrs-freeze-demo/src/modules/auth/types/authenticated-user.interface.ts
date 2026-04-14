import { Role } from '../constants/roles';

export interface AuthenticatedUser {
  userId: string;
  username: string;
  role: Role;
  permissions: string[];
}
