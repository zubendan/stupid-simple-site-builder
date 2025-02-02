export enum SystemRoleType {
  SYSTEM_ADMIN = 'system_admin',
  SYSTEM_support = 'system_support',
  USER = 'user',
}

export enum DefaultOrganizationUserRoleType {
  ADMIN = 'admin',
}

export const allSystemRoles: SystemRoleType[] = Object.values(SystemRoleType);
export const allDefaultOrganizationUserRoles: DefaultOrganizationUserRoleType[] =
  Object.values(DefaultOrganizationUserRoleType);
