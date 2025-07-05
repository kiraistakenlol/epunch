import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ROUTES = {
  DASHBOARD: '/dashboard',
  SCANNER: '/scanner',
  LOYALTY_PROGRAMS: '/loyalty-programs',
  LOYALTY_PROGRAMS_CREATE: '/loyalty-programs/create',
  LOYALTY_PROGRAMS_VIEW: '/loyalty-programs/:id',
  DESIGN: '/design',
  WELCOME_QR: '/welcome-qr',
  ANALYTICS: '/analytics',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
} as const
