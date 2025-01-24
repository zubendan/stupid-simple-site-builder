export enum OrgPermission {
  VIEW_TEMPLATES = 'view_templates',
  CREATE_TEMPLATES = 'create_templates',
  EDIT_TEMPLATES = 'edit_templates',
  DELETE_TEMPLATES = 'delete_templates',
  PUBLISH_TEMPLATES = 'publish_templates',
  VIEW_COMPONENTS = 'view_components',
  CREATE_COMPONENTS = 'create_components',
  EDIT_COMPONENTS = 'edit_components',
  DELETE_COMPONENTS = 'delete_components',
  VIEW_DOMAINS = 'view_domains',
  ADD_DOMAINS = 'add_domains',
  EDIT_DOMAINS = 'edit_domains',
  DELETE_DOMAINS = 'delete_domains',
  VIEW_USERS = 'view_users',
  INVITE_USERS = 'invite_users',
  REMOVE_USERS = 'remove_users',
  VIEW_GENERAL_SETTINGS = 'view_general_settings',
  EDIT_GENERAL_SETTINGS = 'edit_general_settings',
  VIEW_ROLES = 'view_roles',
  CREATE_ROLES = 'create_roles',
  EDIT_ROLES = 'edit_roles',
  DELETE_ROLES = 'delete_roles',
  ASSIGN_ROLES = 'assign_roles',
  VIEW_PERMISSIONS = 'view_permissions',
}

export const allOrgPermissions: OrgPermission[] = Object.values(OrgPermission);

export enum SystemPermission {
  VIEW_ORGANIZATIONS = 'view_organizations',
  DELETE_ORGANIZATIONS = 'delete_organizations',
  VIEW_USERS = 'view_users',
  IMPERSONATE_USERS = 'impersonate_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
}

export const allSystemPermissions: SystemPermission[] =
  Object.values(SystemPermission);
