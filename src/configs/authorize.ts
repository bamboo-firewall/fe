export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  DEVOPS: 'devops',
};

export const CAN_VIEW = {
  [ROLES.ADMIN]: '*',
  [ROLES.USER]: ['/globalNetworkSet', '/hostEndpoint', '/globalNetworkPolicy', '/profile', '/'],
};

export const COLOR = {
  [ROLES.ADMIN]: 'red',
  [ROLES.USER]: 'green',
  [ROLES.DEVOPS]: 'gold',
};
