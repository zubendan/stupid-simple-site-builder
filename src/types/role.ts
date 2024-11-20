export enum UserRoleType {
  SYSTEM_ADMIN = 'system_admin',
  SYSTEM_support = 'system_support',
  USER = 'user',
}

export enum OrganizationUserRoleType {
  ORGANIZATION_ADMIN = 'organization_admin',
  ORGANIZATION_GUEST = 'organization_guest',
  ORGANIZATION_USER = 'organization_user',
}

export const allUserRoles: UserRoleType[] = Object.values(UserRoleType);
export const allOrganizationUserRoles: OrganizationUserRoleType[] =
  Object.values(OrganizationUserRoleType);
