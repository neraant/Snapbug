import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export type UserPort = {
  findById: (userId: string) => Promise<UserModelType>;
};
