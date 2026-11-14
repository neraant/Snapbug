import type { UserModelType } from "@workspace/validation/modules/user/dto/user.model";

export type UserPort = {
  findManyByIds: (ids: string[]) => Promise<UserModelType[]>;
};
