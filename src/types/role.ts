export enum UserRoleType {
  SYSTEM_ADMIN = 'system_admin',
  SYSTEM_support = 'system_support',
  USER = 'user',
}

export enum DefaultOrganizationUserRoleType {
  ADMIN = 'admin',
}

export const allUserRoles: UserRoleType[] = Object.values(UserRoleType);
export const allDefaultOrganizationUserRoles: DefaultOrganizationUserRoleType[] =
  Object.values(DefaultOrganizationUserRoleType);
