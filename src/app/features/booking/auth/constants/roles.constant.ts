export const ROLES = {
  USER: 'NguoiDung'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES]; 