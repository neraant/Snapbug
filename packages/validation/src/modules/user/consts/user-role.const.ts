export enum UserRole {
  ADMIN = "admin",
  USER = "member",
}

export const userRoles = Object.values(UserRole) as [UserRole, ...UserRole[]];
