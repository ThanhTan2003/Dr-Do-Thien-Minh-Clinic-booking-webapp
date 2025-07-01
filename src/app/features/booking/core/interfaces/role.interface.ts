import { Role } from '../enums/role.enum';

export interface RoleInfo {
  code: Role;
  name: string;
  description?: string;
}

export interface UserRole {
  role: Role;
  displayName: string;
} 