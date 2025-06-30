export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES]; 