import type { InterfaceLanguage } from "@workspace/validation/modules/user/consts/interface-language.const";

export type UserPersistedType = {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
  interfaceLanguage: InterfaceLanguage;
  passwordChangedAt: Date | null;
  onboardingCompletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserType = Partial<Pick<UserPersistedType, "name">> &
  Pick<UserPersistedType, "email" | "passwordHash">;

export type UpdateUserType = Partial<
  Pick<
    UserPersistedType,
    "name" | "email" | "passwordHash" | "interfaceLanguage" | "passwordChangedAt" | "onboardingCompletedAt"
  >
>;
