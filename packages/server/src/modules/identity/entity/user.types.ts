export type UserPersistedType = {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
  passwordChangedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserType = {
  name: string | null;
  email: string;
  passwordHash: string;
};
