const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

exports.roles = Object.keys(allRoles);
exports.roleRights = new Map(Object.entries(allRoles));
