import { Role } from '../enums/role.enum';
import { RoleInfo } from '../interfaces/role.interface';

export const ROLE_INFO: { [key in Role]: RoleInfo } = {
  [Role.ADMIN]: {
    code: Role.ADMIN,
    name: 'Quản trị viên',
    description: 'Người quản lý toàn bộ hệ thống'
  },
  [Role.STAFF]: {
    code: Role.STAFF,
    name: 'Nhân viên y tế',
    description: 'Nhân viên xử lý các vấn đề y tế'
  },
  [Role.MARKETING]: {
    code: Role.MARKETING,
    name: 'Nhân viên truyền thông',
    description: 'Nhân viên quản lý truyền thông và marketing'
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
export const ADMIN_ROLES = [Role.ADMIN];
export const STAFF_ROLES = [Role.STAFF];
export const MARKETING_ROLES = [Role.MARKETING];
export const ALL_ROLES = Object.values(Role);
export const ADMIN_STAFF_ROLES = [Role.ADMIN, Role.STAFF];
export const ADMIN_MARKETING_ROLES = [Role.ADMIN, Role.MARKETING]; 