import type { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";

export type UserPersistedType = {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserType = {
  name: string | null;
  email: string;
  passwordHash: string;
};
