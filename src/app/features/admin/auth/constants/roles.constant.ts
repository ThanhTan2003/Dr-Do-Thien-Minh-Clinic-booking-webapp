export const ROLES = {
  ADMIN: 'QuanTriVienHeThong',
  STAFF: 'NhanVienYTe',
  MARKETING: 'NhanVienTruyenThong'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES]; 