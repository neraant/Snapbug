import { z } from "zod";

export enum UserRole {
  ADMIN = "admin",
  USER = "member",
}

export const userRoles = Object.values(UserRole) as [UserRole, ...UserRole[]];

export const userRoleSchema = z.enum(userRoles);
