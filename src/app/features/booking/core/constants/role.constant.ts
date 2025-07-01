import { Role } from '../enums/role.enum';
import { RoleInfo } from '../interfaces/role.interface';

export const ROLE_INFO: { [key in Role]: RoleInfo } = {
  [Role.USER]: {
    code: Role.USER,
    name: 'Người dùng',
    description: 'Người dùng'
  }
};

// Helper functions
export const getRoleName = (role: Role): string => {
  return ROLE_INFO[role]?.name || role;
};

export const getRoleDescription = (role: Role): string => {
  return ROLE_INFO[role]?.description || '';
};

// Commonly used role groups
export const USER_ROLES = [Role.USER];