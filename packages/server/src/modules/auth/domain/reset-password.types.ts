export type ResetPasswordPersistedType = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
};

export type CreateResetPasswordType = {
  userId: string;
  token: string;
  expiresAt: Date;
};
