export const ROLES = {
  ADMIN: 'ADMIN',
  OPERATIONS_OFFICER: 'OPERATIONS_OFFICER',
  FIELD_TEAM: 'FIELD_TEAM'
};

export const hasRole = (user, role) => {
  return user && user.role === role;
};

export const hasAnyRole = (user, roles) => {
  return user && roles.includes(user.role);
};

export const canAccess = (user, permission) => {
  // Simplistic role check mappings
  const permissions = {
    'manage_users': [ROLES.ADMIN],
    'create_expedition': [ROLES.ADMIN, ROLES.OPERATIONS_OFFICER],
    'edit_expedition': [ROLES.ADMIN, ROLES.OPERATIONS_OFFICER],
    'delete_expedition': [ROLES.ADMIN],
    'manage_teams': [ROLES.ADMIN, ROLES.OPERATIONS_OFFICER],
    'manage_inventory': [ROLES.ADMIN, ROLES.OPERATIONS_OFFICER],
    'manage_cargo': [ROLES.ADMIN, ROLES.OPERATIONS_OFFICER],
    'report_emergency': [ROLES.ADMIN, ROLES.OPERATIONS_OFFICER, ROLES.FIELD_TEAM],
    'delete_emergency': [ROLES.ADMIN, ROLES.OPERATIONS_OFFICER],
    'view_analytics': [ROLES.ADMIN, ROLES.OPERATIONS_OFFICER],
  };

  if (!permissions[permission]) return false;
  return hasAnyRole(user, permissions[permission]);
};
