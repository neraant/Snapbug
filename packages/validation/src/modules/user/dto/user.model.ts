import { UserRole } from "@workspace/validation/modules/user/consts/user-role.const";
import { z } from "zod";

export const userModelSchema = z.object({
  id: z.uuid(),
  name: z.string().nullable(),
  email: z.email(),
  role: z.enum(UserRole),
});

export type UserModelType = z.infer<typeof userModelSchema>;
