const User_Role = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const userRole = [User_Role.ADMIN, User_Role.USER];

export default User_Role;
